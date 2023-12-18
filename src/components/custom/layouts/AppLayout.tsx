import React from 'react'
import Navbar from '../navigation/Navbar'
import Sidebar from '../navigation/Sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import useUserSession from '@/hooks/useUserSession'


interface Props {
    children: React.ReactNode
}
const AppLayout = ({ children }: Props) => {
    useUserSession()

    return (
        <div>
            <ScrollArea className="h-screen w-full">
                <Navbar />
                <Sidebar />
                <div className='pt-16 px-24 max-w-[2000px] w-full mx-auto'>
                    {children}
                </div>
            </ScrollArea>
        </div>
    )
}

export default AppLayout