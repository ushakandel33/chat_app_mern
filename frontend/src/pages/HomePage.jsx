import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getOutgoingRequests, getRecommendedUsers, getUsersFriends, sendFriendRequest } from '../lib/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { CheckCircleIcon, MapIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import FriendCard, { getLanguageFlag } from '../components/FriendCard';
import NoFriend from '../components/NoFriend';
import { capitialize } from '../lib/utils';

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingFriendRequest, setOutgoingFriendRequest] = useState(new Set());
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUsersFriends
  })

  const { data: recommendUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers
  })

  const { data: outgoingRequest } = useQuery({
    queryKey: ["outgoingFriendRequest"],
    queryFn: getOutgoingRequests
  })

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequest"] })
      toast.success("friend request send successfully")
    }
  })

  // to update the state 
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingRequest && outgoingRequest.length > 0) {
      outgoingRequest.forEach((req) => {
        console.log(req)
        outgoingIds.add(req.recipient._id); // or req.recipient if it's already a string
      });
      setOutgoingFriendRequest(outgoingIds);
    }
  }, [outgoingRequest]);

  return (
    <div className='p-4 sm:p-6 lg:p-8 '>
      <div className='container  mx-auto space-y-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to={'/notification'} className='btn btn-outline btn-sm'>
            <UsersIcon className='size-4 mr-2' />
            friend Requests
          </Link>
        </div>
        {loadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : friends.length === 0 ? (
          <NoFriend />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {
              friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))
            }
          </div>
        )}

        <section>
          <div className='mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Meet New Friends</h2>

                <p className='opacity-70'>discover perfect friends based on your profile</p>
              </div>
            </div>
          </div>

          {
            loadingUsers ? (
              <div className='flex justify-center py-12'>
                <span className='loading loading-spinner loading-lg'></span>
              </div>
            ) : recommendUsers.length === 0 ? (
              <div className='card bg-base-200 text-center'>
                <h3 className='text-lg font-bold mb-2'>No recommendations found</h3>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {
                  recommendUsers.map((user) => {
                    const hasRequestBeenSent = outgoingFriendRequest.has(user._id)
                    return (
                      <div key={user._id} className='card bg-base-200 hover:shadow-lg transition-all duration-300'>
                        <div className='card-body p-5 space-y-4'>
                          <div className='flex items-center gap-3'>
                            <div className='avatar size-16 rounded-full'>
                              <img src={user.profilePic} alt={user.fullName} />
                            </div>

                            <div>
                              <h3 className='font-semibold text-lg '>{user.fullName}</h3>
                              {user.location && (
                                <div className='flex items-center text-xs opacity-70 mt-1'>
                                  <MapIcon className='size-3 mr-1' />
                                  {user.location}
                                </div>
                              )}
                            </div>

                          </div>

                          <div className='flex flex-wrap gap-1.5'>
                            <span className='badge badge-secondary'>
                              {getLanguageFlag(user.nativeLanguage)}
                              Native:{capitialize(user.nativeLanguage)}
                            </span>
                            <span className='badge badge-outline'>
                              {getLanguageFlag(user.learningLanguage)}
                              learning :{capitialize(user.learningLanguage)}
                            </span>

                          </div>
                          {user.bio && (
                            <p className='text-sm opacity-70'>{user.bio}</p>
                          )}

                          {/* action button */}
                          <button 
                          onClick={()=>sendRequestMutation(user._id)}
                           disabled={hasRequestBeenSent||isPending} 
                           className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}>
                            {hasRequestBeenSent?(
                              <>
                                <CheckCircleIcon className='size-4 mr-2' />
                                Request sent
                              </>
                            ):(
                              <>
                                <UserPlusIcon className='size-4 mr-2' />
                                Send Friend Request
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                    )
                  })
                }
              </div>
            )
          }
        </section>

      </div>
    </div>
  )
}

export default HomePage

