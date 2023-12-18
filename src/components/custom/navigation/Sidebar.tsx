'use client'
import { File, Folder, FolderPlus, Settings, User } from 'lucide-react'
import React from 'react'
import { ToggleThemeButton } from './ToggleThemeButton'
import { useLocation, useNavigate  } from 'react-router-dom'
const Sidebar = () => {
  const { pathname: currentPathname } = useLocation()
  const navigate  = useNavigate()
 


  const routes = [
    {
      name: 'S3 Buckets',
      path: '/',
      icon: <Folder size={18} />
    },
    {
      name: 'buckets',
      path: '/test',
      icon: <File size={18} />
    },
    {
      name: 'Create Bucket',
      path: '/create-bucket',
      icon: <FolderPlus size={18} />
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings size={18} />
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User size={18} />
    }
  ]

  const handleNavigation = (path: string) => {
    console.log(path)
    navigate(path)
  }


  return (
    <div className='w-12 py-4 fixed top-14 h-screen bg-background border-r'>
      <div className='grid gap-2 justify-center'>
        {routes.map((route, index) => (
          <div key={index} className={`${currentPathname === route.path && 'bg-secondary '} text-muted-foreground flex items-center gap-2 p-2 hover:bg-secondary cursor-pointer rounded-md`} onClick={() => handleNavigation(route.path)}>
            {route.icon}
          </div>
        ))}
        <div className='fixed bottom-2 z-50 left-2'>
          <ToggleThemeButton />
        </div>
      </div>
    </div>
  )
}

export default Sidebar