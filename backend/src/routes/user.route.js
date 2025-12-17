import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptFriendRequest, getFriendRequest, getMyFriends, getOutgoingFriendRequest, getRecommendedUsers ,sendFriendRequest } from '../controllers/user.controller.js';
 const router = express.Router();
 //apply middleware to all routes by using the below line 
 router.use(protectRoute)
//  or use it like in auth.route.js
 router.get("/", getRecommendedUsers);
 router.get("/friends",getMyFriends);
 router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest)
router.get("/friend-request",getFriendRequest);
router.get("/outgoing-friend-request",getOutgoingFriendRequest)
 export default router;