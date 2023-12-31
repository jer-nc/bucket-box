import UserListSelect from './UserList'
import logo from '../../../assets/logo-bucket-box.svg'

const Navbar = () => {
    return (
        <nav className={`z-50 px-4 flex items-center fixed top-0 w-full h-14 bg-background border-b`}>
            <div className='w-full flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <img src={logo} alt="logo" className='w-6' />
                </div>
                <div className='flex items-center'>
                    <div className='flex items-center'>
                        <UserListSelect />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar