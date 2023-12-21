import { Button } from '@/components/ui/button';
import { ChevronLeft, RefreshCcw } from 'lucide-react';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
}

const BucketContentsLayout = ({ children }: Props) => {
    const { pathname: currentPathname } = useLocation()

    console.log('currentPathname', currentPathname)

    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/');
    }

    const currentPathnameWithoutBuckets = currentPathname.replace('/buckets/', '');

    return (
        <div>
            <div className='top-14 sticky w-full z-50  flex justify-between items-center bg-background py-4'>
                <div className='flex items-center gap-2'>
                    <Button onClick={handleNavigate} size='icon' variant='ghost' >
                        <ChevronLeft size={18} />
                    </Button>
                    <p className='font-semibold'>
                        {/* {currentPathname.split('/').pop()}{' '} */}
                        {currentPathnameWithoutBuckets}
                    </p>
                </div>
                <Button size='icon' variant='ghost' >
                    <RefreshCcw size={18} />
                </Button>
            </div>
            {children}
        </div>
    )
}

export default BucketContentsLayout