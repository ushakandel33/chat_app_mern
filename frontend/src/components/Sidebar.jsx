import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router'
import { BellIcon, Home, NotebookIcon, ShipWheelIcon, User } from 'lucide-react'

const Sidebar = () => {
    const {authUser} = useAuthUser()
    const location = useLocation();
    const currentPath = location.pathname
  return (
    <aside className='w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky'>
        {/* logo */}
        <div className='p-5 border-b border-base-300'>
            <Link to={'/'}>
            <ShipWheelIcon className='size-9 text-primary'/>
            <span className='text-3xl font-bold bg-clip-text font-mono text-transparent bg-gradient-to-r from-primary to-secondary'>
                Chatify
            </span>

            </Link>
        </div>

{/* navigation */}
        <nav className='flex-1 p-4 space-y-1'>
            <Link to={'/'} className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath==='/'? 'btn-active':''}`}>
            <Home className='opacity-70 size-5 text-base-content'/>
                HOME
            </Link> 

            {/* <Link to={'/friends'} className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath==='/friends'? 'btn-active':''}`}>
            <User className='opacity-70 size-5 text-base-content'/>
                Friends
            </Link>  */}

            <Link to={'/notification'} className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath==='/notification'? 'btn-active':''}`}>
            <BellIcon className='opacity-70 size-5 text-base-content'/>
                NOTIFICATION
            </Link>            
        </nav>

        {/* userProfile section  */}

        <div className='p-4 border-t'>
            <div className='flex items-center gap-3 '>
                <div className='avatar'>
                    <div className='w-10 rounded-full'> 
                    <img src={authUser?.profilePic} alt="avatar"/>
                    </div>
                </div>

            <div className='flex-1'>
                <p className='text-sm font-semibold '>{authUser?.fullName}</p>
                <p className='text-xs text-success flex items-center gap-1'>
                    <span className='bg-success size-2 inline-block rounded-full animate-pulse '></span>
                    Online
                </p>

            </div>
            </div>
        </div>
    </aside>
  )
}

export default Sidebar