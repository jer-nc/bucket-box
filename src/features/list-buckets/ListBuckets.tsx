import { Button } from '@/components/ui/button';
import { Plus, RefreshCcw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { listAllBuckets } from '@/cli-functions';
import { useUserSessionStore } from '@/store/useSessionStore';
import Spinner from '@/components/custom/loaders/Spinner';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import CardDropdown from '@/components/custom/dropdowns/CardDropdown';
import bucketIcon from '@/assets/icons/bucket-icon.svg';
import { useQuery } from '@tanstack/react-query';
import { Bucket } from '@/lib/app';
import { useState } from 'react';


function ListBuckets() {
    const { profiles } = useUserSessionStore();
    const navigate = useNavigate();
    const profile = localStorage.getItem('aws-profile') || '';
    const [isRefetching, setIsRefetching] = useState(false);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['buckets', profile],
        queryFn: () => listAllBuckets(profile),
        retry: 1,
    });

    if (isError) {
        toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        })
    }

    // console.log('data', data)


    const handleNavigate = (bucket: string) => {
        navigate(`/buckets/${bucket}`);
    };


    const handleRefetch = async () => {
        setIsRefetching(true);
        await refetch();
        setIsRefetching(false);
    };



    return (
        <div className='relative'>
            <div className='top-14 sticky w-full z-50 flex justify-between items-center bg-background py-4'>
                <p className='font-semibold'>S3 Buckets</p>
                <Button size='icon' variant='ghost' onClick={handleRefetch}>
                    <RefreshCcw size={16} />
                </Button>
            </div>
            <div className={`py-4 ${isLoading || isRefetching || profiles.length === 0 || data?.Buckets.length === 0 ? 'flex flex-col justify-center' : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'}`}>
                {isLoading || isRefetching ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='flex items-center justify-center py-8'>
                        <Spinner />
                    </div>
                ) : profiles.length === 0 ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='mx-auto text-center flex flex-col justify-center'>
                        <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>No profiles available</p>
                    </div>
                ) : (data as Array<unknown>)?.length === 0 && !isLoading ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='mx-auto text-center flex flex-col justify-center'>
                        <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>No buckets available</p>
                        <Button className='mt-4'>
                            Create Bucket
                            <Plus className='ml-2' size={18} />
                        </Button>
                    </div>
                ) : (
                    data?.Buckets.map((bucket: Bucket, index: number) => (
                        <Card onClick={() => handleNavigate(bucket.Name)} title={bucket.Name} key={index} className='p-4 flex items-center justify-between gap-4 hover:bg-secondary/30 rounded-md cursor-pointer'>
                            <div className='flex items-center gap-4'>
                                <img src={bucketIcon} alt='bucket icon' className='w-5 h-5' />
                                <p className='text-start text-sm truncate max-w-[10rem]'>{bucket.Name}</p>
                            </div>
                            <CardDropdown bucket={bucket} />
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

export default ListBuckets;
