
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req,res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user
        const recommendedUsers = await User.find({
            $and:[
            {_id:{$ne:currentUserId}},//exclude the current user
            {_id:{$nin:currentUser.friends}}, //exclude current user's friends 
            {isOnboarded:true}
            ]
        })

        res.status(200).json(recommendedUsers)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,message:"internal server issue"})
    }
} 

export async function getMyFriends(req,res) {
    try {

        // use populate when u want to collect data from a array of mongoose ObjectId
        const user = await User.findById(req.user.id).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage ");

        res.status(200).json(user.friends)
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:"internal server issues"})
    }
}

export async function sendFriendRequest(req,res) {
    try {
        console.log(req.user.id);
        const myId = req.user.id;
       const {id : recipientId} = req.params

    //    preventing sending req to yourself 
        if (myId === recipientId) {
            return res.status(400).json({success : false , message :"you can't send friend request to yourself"})
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({message:"recipient doesn't exists"});
        }
     if (recipient.friends.includes(myId)) {
        return res.status(400).json({message:"you are already friends with this user"})
     }
        
    //  check if a request already exists

    const existingRequest = await FriendRequest.findOne({
        $or:[
            {sender:myId,recipient:recipientId},
            {sender:recipientId,recipient: myId},
        ],
    })

    if (existingRequest) {
        return res.status(400).json({message:"a friend request already exists"})
    }

   const friendRequest = await FriendRequest.create({
        sender:myId,
        recipient:recipientId,
    })

    res.status(200).json(friendRequest)

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server issue"})
    }
}

export async function acceptFriendRequest(req,res) {
    try {
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({message:"friend request not found "})
        }

        if(friendRequest.recipient.toString()!== req.user.id){
            return res.status(400).json({message:"you are not authorised to accept this request"});
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient},
        })

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{
                friends:friendRequest.sender
            }
        }
        )

        res.status(200).json({message:"friend request accepted"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false , message:"internal server issue"})
    }
}

export async function getFriendRequest(req,res) {
    try {
        const incomingRequest = await FriendRequest.find({
            recipient:req.user.id,
            status:'pending'
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage")

        const acceptedRequest = await FriendRequest.find({
            recipient:req.user.id,
            status:'accepted'
        }).populate("recipient","fullName profilePic ")

        res.status(200).json({acceptedRequest, incomingRequest})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false , message:"internal server issue"})
    }
}

export async function getOutgoingFriendRequest(req,res) {
    try {
        const OutgoingRequest = await FriendRequest({
            sender:req.user.id,
            status:"pending",
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(OutgoingRequest)
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false , message : "internal server issue"})
    }
}