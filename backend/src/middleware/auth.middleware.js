import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async(req,res ,next)=>{
try {
    const token = req.cookies.jwt; 
    if (!token) {
        return res.status(401).json({message:"unauthorised - no token found"});
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    if (!decoded) {
        return res.status(401).json({message:"unauthorised - invalid token found"})
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
        return res.status(401).json({message:"unauthorised - no token found"})
    }

    req.user = user;
    next();
} catch (error) {
    console.log(error);
    res.status(500).json({success:false , message:"internal sever issue "})
}
}