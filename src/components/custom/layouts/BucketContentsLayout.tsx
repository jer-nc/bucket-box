import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { extractBucketAndFolder } from '@/lib/utils';
import { useBucketStore } from '@/store/useBucketStore';
import { useUserSessionStore } from '@/store/useSessionStore';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, RefreshCcw } from 'lucide-react';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import CreateFolderDialog from '../dialogs/CreateFolderDialog';
import UploadFilesDialog from '../dialogs/UploadFilesDialog';

const BucketContentsLayout = () => {
    const outlet = useOutlet();
    const { pathname: currentPathname } = useLocation()
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const { currentProfile } = useUserSessionStore();
    const { bucketName, folderPath } = extractBucketAndFolder(currentPathname)
    const { setIsRefetching } = useBucketStore()

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

    const currentPathnameWithoutBuckets = currentPathname.replace('/buckets/', '');

    const handleRefetch = async () => {
        setIsRefetching(true);
        try {
            if (splitedPath.length === 3) {
                await queryClient.refetchQueries({
                    queryKey: ['bucketData', currentProfile, bucketName],
                });
            } else {
                await queryClient.refetchQueries({
                    queryKey: ['bucketDataSubfolder', currentProfile, folderPath],
                });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                })
                console.error('Error during refetch:', error);
            }
        } finally {
            setIsRefetching(false);
        }
    }


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
                <div className='flex items-center gap-2'>
                    <UploadFilesDialog bucketName={bucketName} folderPath={folderPath} profile={currentProfile} />
                    <CreateFolderDialog bucketName={bucketName} folderPath={folderPath} profile={currentProfile} />
                    <Button size='icon' variant='ghost' onClick={handleRefetch}>
                        <RefreshCcw size={18} />
                    </Button>
                </div>
            </div>
            {outlet}
        </div>
    )
}

export default BucketContentsLayout