import { Button } from '@/components/ui/button';
import { Folder, Plus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { listAllBuckets } from '@/cli-functions/listAllBuckets';
import { useUserSessionStore } from '@/store/useSessionStore';

function ListBuckets() {
    const { toast } = useToast()
    const [buckets, setBuckets] = useState([]);
    const { currentProfile } = useUserSessionStore()

    console.log('currentProfile', currentProfile)

    const handleListBuckets = async () => {
        try {
            const profile = localStorage.getItem('aws-profile') || '';
            const bucketList = await listAllBuckets(profile);
            setBuckets(bucketList);
        } catch (error: any) {
            console.error(error);
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
                className: 'text-xs',
            });
        }
    };

    // useEffect(() => {
    //     handleListBuckets(); // Ejecutar al montar el componente
    // }, [currentProfile]);

    return (
        <div >
            <div className='flex justify-between items-center'>
                <p className='font-semibold'>S3 Buckets</p>
                <Button onClick={handleListBuckets}>List Buckets</Button>
            </div>
            <div className={`py-12 ${buckets.length === 0 ? 'flex flex-col  justify-center' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'} `}>
                {buckets.length === 0 ? (
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
