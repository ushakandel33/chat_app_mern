import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { login } from '../lib/api'
import { ShipWheelIcon } from 'lucide-react'
import { Link } from 'react-router'

const LoginPage = () => {
  const queryClient = useQueryClient()
  const [loginData, setloginData] = useState({
    email: "",
    password: ""
  })
  const { mutate: loginMutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("login successfull"),
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  })

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutate(loginData)
  }
  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme='forest'>
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        {/* left section */}

        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          {/* logo */}
          <div className='mb-4 flex items-center justify-start'>
            {/* <img src='/' alt="" /> */}
            <ShipWheelIcon className='size-9 text-primary' />
            <span className='text-3xl font-bold bg-clip-text tracking-wider text-transparent bg-gradient-to-r from-primary to-secondary'>
              Chatify
            </span>
          </div>
          {/* show error */}
          {
            error && (
              <div className='alert alert-error mb-4 '>
                <span>{error.response.data.message}</span>
              </div>
            )}
          {/* login form */}
          <div className='w-full'>
            <form onSubmit={handleLogin}>
              <div className='space-y-4'>
                <div>
                  <h2 className='font-bold  text-xl '>Welcome Back</h2>
                  <p className='text-center font-serif opacity-80'>Sign in to your account to continue conversations with your friends </p>
                </div>

                <div className='flex flex-col gap-3'>
                  <div className='form-control w-full space-y-2'>
                    <label className='label'>
                      <span className='label-text'>Emaill</span>
                    </label>
                    <input className='input input-bordered w-full' type="email" onChange={(e) => setloginData({ ...loginData, email: e.target.value })} placeholder='Enter your email' value={loginData.email} required />
                  </div>

                  <div className='form-control w-full space-y-2'>
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input type="password" value={loginData.password} onChange={(e) => setloginData({ ...loginData, password: e.target.value })} className='input input-bordered w-full' placeholder='Enter you password' required />

                  </div>

                  <button type='submit' className='btn btn-primary w-full' disabled={isPending}>
                    {isPending?(
                      <>
                      <span className='animate-spin loading loading-spinner loading-xs'></span>
                      Signing in...
                      </>                      
                    ):("Sign in")}
                  </button>

                  <div className='text-center mt-4 '>
                    <p className='text-sm'>
                      Don't have an account {' '}
                      <Link className='text-primary hover:underline' to={'/signup'}>
                      Create one</Link>
                    </p>

                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

{/* image scene  */}
<div className='hidden lg:flex w-full lg:w-1/2 bg-primary items-center justify-center'>
  <div className='max-w-md p-8 '>
    <div className='relative aspect-square max-w-sm mx-auto'>
    <img src="/SignUp_image.png" alt="signup image" className='w-full h-full' />
    </div>

  <div className='text-center space-y-3 mt-5'>
    <h2 className='text-xl font-semibold'>Connect with people</h2>
    <p className='opacity-70 font-serif'>practice conversation , make friends and improve your leanguae skills together </p>
  </div>
  </div>
</div>
      </div>
    </div>
  )
}

export default LoginPage