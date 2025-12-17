import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completeOnboarding } from '../lib/api'
import toast from 'react-hot-toast'
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react'
import { LANGUAGES } from '../constants'

const OnboardingPage = () => {
  const { authUser } = useAuthUser()
  const queryClient = useQueryClient()
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || ""
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("profile completed successfully "),
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError:(error)=>{
      console.log(error)
      toast.error(error.response.data.message)
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    onboardingMutation(formState)
  }

  const handleRandomAvatart = () => { 
    const idx = Math.floor(Math.random()*100)+1 ;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    setFormState({
      ...formState,profilePic:randomAvatar
    })
    toast.success("Avatar changed successfully")
  }
  return (
    <div className='min-h-screen bg-base-100 p-4 flex items-center justify-center'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl '>
        <div className='card-body p-6 sm:p-8 '>
          <h1 className='text-2xl font-bold text-primary sm:text-3xl text-center mb-6'>Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* profilepic container */}
            <div className='flex items-center justify-center space-y-4 flex-col'>

              {/* image preview */}
              <div className='size-32 rounded-full bg-red-300 overflow-hidden'>
                {
                  formState.profilePic ? (
                    <img src={formState.profilePic} alt="profilepic preview" className='w-full h-full object-cover' />
                  ) : (
                    <div className='flex items-center justify-center h-full'>
                      <CameraIcon className='size-12 text-base-content opacity-40' />
                    </div>
                  )
                }
              </div>
              {/* generate random avatar */}
              <div className='flex items-center justify-center gap-2'>
                <button className='btn btn-accent' type='button' onClick={handleRandomAvatart}>
                  <ShuffleIcon className='size-4 mr-2' />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/* fullName */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>
              <input type="text" name="fullName" value={formState.fullName} placeholder='Your Full Name' onChange={(e) => setFormState({ ...formState, fullName: e.target.value })} className='input input-bordered w-full' required/>
            </div>
            {/* bio */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Bio</span>
              </label>
              <textarea type="text" name="bio" value={formState.bio} placeholder='tell others about yourself' onChange={(e) => setFormState({ ...formState, bio:e.target.value })} className='input input-bordered w-full' required />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

              {/* native language */}

              <div className='form-control '>
                <label className='label'>
                  <span className='label-text'>Native Language</span>
                </label>
                <select name="nativeLanguage" value={formState.nativeLanguage} className='select select-bordered w-full' onChange={(e) => setFormState({ ...formState, nativeLanguage:e.target.value })}>
                  <option value="">select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase}>{lang}</option>
                  ))}
                </select>

              </div>
              {/* learning language */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Learning Language</span>
                </label>
                <select name="learningLanguage" value={formState.learningLanguage} className='select select-bordered w-full' onChange={(e) => setFormState({ ...formState, learningLanguage:e.target.value })}>
                  <option value="">select your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase}>{lang}</option>
                  ))}
                </select>
              </div>
              </div>
{/* location  */}
           <div className='form-control'>
              <label className='label'>
                <span className='label-text'>location</span>
              </label>
              <div className='relative'>

              <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70'/>
              <input type="text" name="location" value={formState.location} placeholder='Your location - city,country' onChange={(e) => setFormState({ ...formState, location:e.target.value })} className='input input-bordered w-full pl-10'/>
            </div>
              </div>

            
{/* submit */}
<button type='submit' className='btn btn-primary w-full rounded-full' disabled={isPending}>{isPending?(
  <div>
    <LoaderIcon className='animate-spin size-5 mr-2'>onboarding...</LoaderIcon>
  </div>
):(
<>
  <ShipWheelIcon className='size-5 mr-2'/>
  Complete Onboarding
</>

)}</button>

                
          </form>
        </div>

      </div>

    </div>
  )
}

export default OnboardingPage