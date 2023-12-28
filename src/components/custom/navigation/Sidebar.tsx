import { Plus, Settings, User } from 'lucide-react'
import { ToggleThemeButton } from './ToggleThemeButton'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { pathname: currentPathname } = useLocation()
  const navigate = useNavigate()

  // TODO: Create component for / icon 

  const routes = [
    {
      name: 'S3 Buckets',
      path: '/',
      icon: <svg width="14" height="18" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M16.006 3.9534C16.0063 3.95339 16.0056 3.95676 16.003 3.96355C16.0043 3.9568 16.0056 3.95341 16.006 3.9534ZM15.9848 4C15.9634 3.96295 15.9219 3.90368 15.8439 3.82179C15.6248 3.59156 15.2133 3.29323 14.5517 2.9992C13.2336 2.41337 11.2724 2 9 2C6.72757 2 4.76643 2.41337 3.44832 2.9992C2.78673 3.29323 2.37516 3.59156 2.15605 3.82179C2.07812 3.90368 2.03659 3.96294 2.01516 4C2.03659 4.03706 2.07812 4.09632 2.15605 4.17821C2.37516 4.40844 2.78673 4.70677 3.44832 5.0008C4.76643 5.58663 6.72757 6 9 6C11.2724 6 13.2336 5.58663 14.5517 5.0008C15.2133 4.70677 15.6248 4.40844 15.8439 4.17821C15.9219 4.09632 15.9634 4.03706 15.9848 4ZM1.99402 3.9534C1.99436 3.9534 1.99567 3.9568 1.99699 3.96355C1.99435 3.95676 1.99369 3.95339 1.99402 3.9534ZM1.99402 4.0466C1.99369 4.04661 1.99435 4.04324 1.99699 4.03645C1.99567 4.0432 1.99436 4.0466 1.99402 4.0466ZM16.003 4.03645C16.0056 4.04324 16.0063 4.04661 16.006 4.0466C16.0056 4.04659 16.0043 4.0432 16.003 4.03645ZM9 8C13.9706 8 18 6.20914 18 4C18 1.79086 13.9706 0 9 0C4.02944 0 0 1.79086 0 4C0 6.20914 4.02944 8 9 8Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M2.00008 17.9999L8.15392e-05 3.99988L1.97998 3.71704L3.97998 17.717L2.00008 17.9999Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M16.0001 4.00012L14.0001 18.0001L15.98 18.283L17.98 4.28296L16.0001 4.00012Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M2.34923 17.2408C2.76855 16.8813 3.39985 16.9299 3.75927 17.3492C6.51402 20.5631 11.486 20.5631 14.2408 17.3492C14.6002 16.9299 15.2315 16.8813 15.6508 17.2408C16.0701 17.6002 16.1187 18.2315 15.7593 18.6508C12.2063 22.7959 5.7937 22.7959 2.24076 18.6508C1.88134 18.2315 1.9299 17.6002 2.34923 17.2408Z" fill="currentColor" />
      </svg>
    },
    {
      name: 'Create Bucket',
      path: '/create-bucket',
      icon: <Plus size={18} />
    },
    // {
    //   name: 'Create Bucket',
    //   path: '/buckets/test/test2/test.txt',
    //   icon: <Plus size={18} />
    // },
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
  // console.log(path)
    navigate(path)
  }


  return (
    <div className='w-12 py-4 fixed top-14 h-screen bg-background border-r'>
      <div className='grid gap-2 justify-center'>
        {routes.map((route, index) => (
          <Button size='iconSm' variant='ghost' key={index} className={`${(currentPathname === route.path || route.path === '/' && currentPathname.includes('/buckets')) && 'bg-secondary '} text-muted-foreground flex items-center gap-2 p-2 hover:bg-secondary cursor-pointer rounded-md`} onClick={() => handleNavigation(route.path)}>
            {route.icon}
          </Button >
        ))}
        <div className='fixed bottom-2 z-50 left-2'>
          <ToggleThemeButton />
        </div>
      </div>
    </div>
  )
}

export default Sidebar