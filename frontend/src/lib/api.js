import { axiosInstance } from "./axios"

export const signUp = async(signupData) => {
    const res = await axiosInstance.post("/auth/signup",signupData)
    return res.data;
}

export const getAuthUser = async()=>{
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data
        
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const completeOnboarding = async(formData)=>{
const res = await axiosInstance.post("/auth/onboarding",formData)
return res.data
}

export const login = async(loginData)=>{
    const res = await axiosInstance.post("/auth/login",loginData);
    return res.data
}

export const logout =async()=>{
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
}

export const getUsersFriends=async()=>{
    const res  = await axiosInstance.get("/users/friends")
    return res.data
}

export const getRecommendedUsers=async()=>{
    const res = await axiosInstance.get("/users")
    return res.data
}


export const getOutgoingRequests=async()=>{
    const res = await axiosInstance.get("/users/outgoing-friend-request")
    return res.data
}


export const sendFriendRequest=async(userId)=>{
    const res = await axiosInstance.post(`/users/friend-request/${userId}`)
    return res.data
}

export const getFriendRequest=async()=>{
    const res = await axiosInstance.get("/users/friend-request")
    return res.data
}

export const acceptFriendRequest=async(requsetId)=>{
    const res = await axiosInstance.put(`/users/friend-request/${requsetId}/accept`)
    return res.data
}

export const getStreamToken=async()=>{
    const res = await axiosInstance.get("/chat/token")
    return res.data
}