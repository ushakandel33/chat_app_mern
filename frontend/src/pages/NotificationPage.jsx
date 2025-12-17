import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { acceptFriendRequest, getFriendRequest } from '../lib/api';
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from 'lucide-react';

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isloading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequest
  })

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    },
  })

  const incomingRequest = friendRequests?.incomingRequest || []
  const acceptedRequest = friendRequests?.acceptedRequest || []
  console.log(acceptedRequest)
  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-automax-w-4xl space-y-8'>
        <h1 className='text-2xl sm:text-3xl font-bold font-mono tracking-tight mb-6 '>
          Notifications
        </h1>
        {isloading ? (

          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : (
          <>
            {incomingRequest.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <UserCheckIcon className='size-5 text-primary' />
                  friends requests
                  <span className='badge badge-primary ml-2'>{incomingRequest.length}</span>
                </h2>

                <div className='space-y-3'>
                  {
                    incomingRequest.map((request) => (
                      <div className='card bg-base-200 shadow-sm hover:shadow-md transition-shadow' key={request._id} >
                        <div className='card-body p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <div className='avatart size-14 rounded-full bg-base-300'>
                                <img src={request.sender.profilePic} alt={request.sender.fullName} />
                              </div>
                            </div>
                            <h3 className='font-bold truncate'>{request.sender.fullName}</h3>
                            <div className='flex gap-1.5 mt-1 flex-wrap'>
                              <span className='badge badge-secondary badge-sm  text-xs'>

                                native:{request.sender.nativeLanguage}
                              </span>

                              <span className='badge badge-outline badge-sm text-xs'>

                                native:{request.sender.learningLanguage}
                              </span>
                            </div>
                          </div>

                        </div>

                        <button onClick={() => acceptRequestMutation(request._id)} disabled={isPending} className='btn btn-primary btn-sm'>
                          Accept
                        </button>

                        {/* todo : accepted requests */}

                        {
                          acceptedRequest.length > 0 && (
                            <section className='space-y-4'>
                              <h2 className='text-xl font-semibold flex items-center gap-2'>
                                <BellIcon className='size-5 text-success' />
                                New Connections
                              </h2>

                              <div className='space-y-3'>
                                {
                                  acceptedRequest.map((notification) => (
                                    <div key={notification._id} className='card bg-base-200 shadow-sm'>
                                      <div className='card-body'>
                                        <div className='avatar mt-1 size-10 rounded-full'>
                                          <img src={notification.recipient.profilePic} alt={notification.recipient.fullName} />
                                        </div>
                                        <div className='flex-1'>
                                          <h3 className='font-semibold'>{notification.recipient.fullName}</h3>
                                          <p className='text-sm my-1'>{notification.recipient.fullName} accepted your friend request</p>
                                          <p className='text-xs flex items-center opacity-70'><ClockIcon />
                                            Recently
                                          </p>
                                        </div>
                                        <div className='badge badge-success'>
                                          <MessageSquareIcon className='size-3 mr-1' />
                                          New Friend
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                }

                              </div>
                            </section>
                          )
                        }
                      </div>
                    ))
                  }
                </div>

              </section>
            )}
          </>
        )}

      </div>

    </div>
  )
}

export default NotificationPage