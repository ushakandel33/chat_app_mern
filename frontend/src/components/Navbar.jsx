import React from 'react'
import { Link, useLocation } from 'react-router'
import useAuthUser from '../hooks/useAuthUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import toast from 'react-hot-toast';
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");
    const {authUser} = useAuthUser();

    const queryClient = useQueryClient({})

    const {mutate:logoutMutation} = useMutation({
        mutationFn:logout,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["authUser"]})
            toast.success("logout successfully")
        }
    }) 
  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center '>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-end '>
                {isChatPage&&(
                    <div className='pl-5'>
                        <Link to={'/'} className='flex items-center gap-2.5'>
                        <ShipWheelIcon className='size-9 text-primary'/>
                        <span className='text-3xl bg-clip-text font-bold font-mono text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>Chatify</span>
                        </Link>
                    </div>
                )}

                <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
                     
            <Link to={'/notification'} className={`btn btn-ghost btn-circle`}>
            <BellIcon className='opacity-70 size-6 text-base-content'/>
            </Link>   

                </div>
                <ThemeSelector/>
                <div className='avatar flex items-center'>
                    <div className='w-9 h-9 rounded-full'>
                        <img src={authUser?.profilePic} alt="user" rel='noreferrer' />
                    </div>
                </div>

                {/* logout */}
                <button className='btn btn-ghost btn-circle' onClick={logoutMutation}><LogOutIcon className='h-6 w-6 text-base-content opacity-70'/></button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar