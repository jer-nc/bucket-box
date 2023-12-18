import { Button } from '@/components/ui/button';
import { Folder, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { listAllBuckets } from '@/cli-functions/listAllBuckets';
import { useUserSessionStore } from '@/store/useSessionStore';
import { Separator } from '@/components/ui/separator';

function ListBuckets() {
    const { toast } = useToast();
    const [buckets, setBuckets] = useState([]);
    const { profiles, currentProfile } = useUserSessionStore();
    const [loading, setLoading] = useState(false);

    const handleListBuckets = async () => {
        try {
            setLoading(true);
            const profile = localStorage.getItem('aws-profile') || '';
            const bucketList = await listAllBuckets(profile);
            setBuckets(bucketList);
        } catch (error) {
            console.error(error);
            setBuckets([]);
            if (error instanceof Error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                    className: 'text-xs',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profiles.length > 0) {
            handleListBuckets(); // Ejecutar al montar el componente si hay perfiles
        }
    }, [profiles, currentProfile]);

    return (
        <div>
            <div className='flex justify-between items-center'>
                <p className='font-semibold'>S3 Buckets</p>
                {/* <Button onClick={handleListBuckets}>List Buckets</Button> */}
            </div>
            <Separator className='my-2' />
            <div className={`py-12 ${loading || profiles.length === 0 || buckets.length === 0 ? 'flex flex-col justify-center' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'}`}>
                {loading ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='flex items-center justify-center py-8'>
                        <p className='text-sm'>Loading...</p>
                    </div>
                ) : profiles.length === 0 ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='mx-auto text-center flex flex-col justify-center'>
                        <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>No profiles available</p>
                    </div>
                ) : buckets.length === 0 && !loading ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='mx-auto text-center flex flex-col justify-center'>
                        <Folder fill='currentColor' width={24} height={24} className='mx-auto' size={24} />
                        <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>No buckets available</p>
                        <Button className='mt-4'>
                            Create Bucket
                            <Plus className='ml-2' size={18} />
                        </Button>
                    </div>
                ) : (
                    buckets.map((bucket, index) => (
                        <div title={bucket} key={index} className='w-44 mx-auto p-4 flex flex-col gap-4 hover:bg-secondary rounded-md cursor-pointer'>
                            <Folder fill='currentColor' width={24} height={24} className='mx-auto' size={24} />
                            <p className='text-sm truncate mx-auto max-w-[10rem]'>{bucket}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ListBuckets;
