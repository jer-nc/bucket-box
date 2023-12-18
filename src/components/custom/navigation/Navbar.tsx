import React from 'react'
import UserListSelect from './UserList'

const Navbar = () => {
    return (
        <nav className={`z-50 px-4 flex items-center fixed top-0 w-full h-14 bg-background border-b`}>
            <div className='w-full flex justify-between items-center'>
                <h1 className='font-semibold'>Bucket Box</h1>
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