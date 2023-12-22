import { Button } from '@/components/ui/button';
import { extractBucketAndFolder } from '@/lib/utils';
import { useUserSessionStore } from '@/store/useSessionStore';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, RefreshCcw } from 'lucide-react';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';

const BucketContentsLayout = () => {
    const outlet = useOutlet();
    const { pathname: currentPathname } = useLocation()
    const navigate = useNavigate();
    console.log('currentPathname', currentPathname)
    const queryClient = useQueryClient()
    const { currentProfile } = useUserSessionStore();
    const { bucketName, folderPath } = extractBucketAndFolder(currentPathname)

    const handleNavigate = () => {
        const segments = currentPathname.split('/');
        if (segments[segments.length - 2] === 'buckets') {
            navigate('/');
        } else {
            const newPath = segments.slice(0, -1).join('/');
            navigate(newPath);
        }
    }

    const splitedPath = currentPathname.split('/');
    // console.log('splitedPath', splitedPath)

    const currentPathnameWithoutBuckets = currentPathname.replace('/buckets/', '');

    return (
        <div>
            <div className='top-14 sticky w-full z-50  flex justify-between items-center bg-background py-4'>
                <div className='flex items-center gap-2'>
                    <Button onClick={handleNavigate} size='icon' variant='ghost' className='text-muted-foreground' >
                        <ChevronLeft size={18} />
                    </Button>
                    <p className='text-muted-foreground text-sm'>
                        {currentPathnameWithoutBuckets}
                    </p>
                </div>
                <Button size='icon' variant='ghost' onClick={() => {
                    if (splitedPath.length === 3) {
                        queryClient.refetchQueries({
                            queryKey: ['bucketData', currentProfile, bucketName],
                        });
                    } else {
                        queryClient.refetchQueries({
                            queryKey: ['bucketDataSubfolder', currentProfile, folderPath],
                        });
                    }
                }}>
                    <RefreshCcw size={18} />
                </Button>
            </div>
            {outlet}
        </div>
    )
}

export default BucketContentsLayout