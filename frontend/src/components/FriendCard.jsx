import React from 'react'
import { LANGUAGE_TO_FLAG } from '../constants'
import { Link } from 'react-router'

const FriendCard = ({friend}) => {
  return (
    <div className='bg-base-200 card hover:shadow-md transition-shadow  '>
        <div className='card-body p-4'>
            {/* user info */}
            <div className='flex items-center gap-3 mb-3'>
                <div className='avatart size-12'>
                    <img src={friend.profilePic} alt={friend.fullName} />
                </div>
                <h3 className='font-bold truncate'>{friend.fullName}</h3>
            </div>

            <div className='flex items-center gap-1.5 mb-3 flex-wrap'>
                <span className='badge badge-secondary text-xs'>
                    {getLanguageFlag(friend.nativeLanguage)}
                    native:{friend.nativeLanguage}
                </span>

                 <span className='badge badge-outline text-xs'>
                    {getLanguageFlag(friend.learningLanguage)}
                    native:{friend.learningLanguage}
                </span>
            </div>

            <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
            Message
            </Link>
            
        </div>
    </div>
  )
}

export default FriendCard

export function getLanguageFlag(language){
    if (!language) return null 
         
    const langlower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langlower];
    if (countryCode) {
        return(
            <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt={`${langlower} flag`}  className='h-3 mr-1 inline-block'/>
        )
    }
    return null
}