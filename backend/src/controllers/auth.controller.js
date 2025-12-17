// import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import { upsertStreamUser } from "../lib/stream.js";
export async function signup(req,res){
    const {fullName, email , password } = req.body;
    try {
    if (!email||!password||!fullName) {
        return res.status(400).json({message:"all fields are required"})
    }

    if (password.length<6) {
        return res.status(400).json({message:"password must be strong"})
    }

    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({message:"invalid email format"});
    }
        
    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.status(400).json({message:"user already exists"})
    }

    const idx = Math.floor(Math.random()*100)+1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    const newUser = await User.create({
        email,
        fullName,
        password,
        profilePic:randomAvatar
    })

    // create the user in stream as well 
    try {
         await upsertStreamUser({
        id:newUser._id.toString(),
        name:newUser.fullName,
        image:newUser.profilePic || "",
    })
    console.log(`streams user created for ${newUser.fullName}`)
    } catch (error) {
        console.log(error);
    }
   
    const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
        expiresIn:"7d"
    })

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true, //prevent XXS attack,
        sameSite:"strict",
        secure:process.env.NODE_ENV==="production"
    })
    res.status(201).json({success:true ,message:"user created successfully", user:newUser});

    } catch (error) {
        console.log("error in signup controller",error)
        res.status(500).json({message:"internal server error"})
    }
}


export async function login(req,res){
    try {
        const {email,password} = req.body;
        if (!email||!password) {
            return res.status(400).json({message:"all credentials required"})
        }
        
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message:"invalid email and password"})
        }
        // go to user model for comparing password with hash 
        // or 
//   const isVerified = await bcrypt.compare(password,user.password);
const isVerified = await user.matchPassword(password);
  if (!isVerified) {
    return res.status(400).json({message:"invalid email and password"});
  }

  const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY ,{
    expiresIn:"7d"
  }) 
  res.cookie("jwt",token,{
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE_ENV==="production"
  });

  res.status(200).json({success:true , message:"login succesful" , user})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"internal server issue"})
    }
}

export async function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({success:true , message:"logout successful"});
}

export async function onboard(req,res) {
    console.log(req.user)
    try {
        const userId = req.user._id;

        const {fullName , bio , nativeLanguage , learningLanguage , location } = req.body;

        if (!fullName||! bio ||! nativeLanguage ||! learningLanguage ||! location ) {
          return res.status(400).json({message:"all fields are required ",
                miisingfields : [
                    !fullName && 'fullName',
                    ! bio && "bio",
                    ! nativeLanguage &&"nativeLanguage",
                    ! learningLanguage &&"learningLanguage",
                    ! location && "location"
                ].filter(Boolean)
            })
        }

       const updatedUser =  await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true,
        },{new:true})

        if (!updatedUser) {
            return res.status(404).json({message:"user not found "})
        }

        // update the user info in stream as well
        try {
           await upsertStreamUser({
            id:updatedUser._id.toString(),
            name:updatedUser.fullName,
            image: updatedUser.profilePic|| "",
        })  
        console.log(`stream user updated for ${updatedUser.fullName}`)
        } catch (error) {
         console.log('stream update erro')   
        }
        res.status(200).json({success:true , user:updatedUser , message:"user updated "})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false , message:"internal server issue"})
    }
}