import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
// import 'stream-chat-react/dist/css/v2/index.css';

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window
} from 'stream-chat-react'
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader';
import CallButton from '../components/CallButton';
import PageLoader from '../components/PageLoader';

const STREAM_API_KEY =import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const {id:targetUserId} = useParams();
const [chatClient , setChatClient] = useState(null);
const [channel,setChannel] = useState(null);
const [loading,setLoading] = useState(true)

const {authUser} = useAuthUser();


const {data:tokenData} = useQuery({
  queryKey:["streamToken"],
  queryFn:getStreamToken,
  enabled:!!authUser
})


useEffect(()=>{
const initChat = async()=>{
  console.log(authUser)
  console.log(tokenData?.token)
 if (!tokenData?.token||!authUser) return;
 try {
  console.log("initialixing stream chat client..")

  const client = StreamChat.getInstance(STREAM_API_KEY)
  await client.connectUser({
    id:authUser._id,
    name:authUser.fullName,
    image:authUser.profilePic,
  },tokenData.token)
// creating a unique channel id so that it ensures that same channel is created regardless of who initiates it
  const channelId = [authUser._id,targetUserId].sort().join("-")

  const currChannel = client.channel("messaging",channelId,{
    members:[authUser._id , targetUserId],
  });
  await currChannel.watch()

  setChatClient(client)
  setChannel(currChannel)
 } catch (error) {
  console.log(error)
toast.error("counld not connect to chat . please try again")
 }finally{
  setLoading(false)
 }
}
initChat()
},[tokenData,authUser,targetUserId])

const handleVideoCall=()=>{
  if (channel) {
    const callUrl = `${window.location.origin}/call/${channel.id}`;
    channel.sendMessage({
      text:`I've started a video call , join me here: ${callUrl}`
    })
    toast.success(
  "video call link sent successfully"
    )
    
  }
}
if (loading ||!chatClient||!channel) return <PageLoader/>
  return (
    <div className='h-[95vh] '>

         <Chat client={chatClient}>
      <Channel channel={channel}>
        <div className='w-full relative'>
          <CallButton handleVideoCall={handleVideoCall}/>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput focus />
        </Window>
        </div>
        <Thread />
      </Channel>
    </Chat>
    </div>
  )
}

export default ChatPage