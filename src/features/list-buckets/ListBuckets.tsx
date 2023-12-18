import { Button } from '@/components/ui/button';
import { Folder, Plus, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { listAllBuckets } from '@/cli-functions/listAllBuckets';
import { useUserSessionStore } from '@/store/useSessionStore';
import Spinner from '@/components/custom/loaders/Spinner';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import CardDropdown from '@/components/custom/dropdowns/CardDropdown';

export interface Bucket {
    Name: string;
    CreationDate?: string;
}

function ListBuckets() {
    const { toast } = useToast();
    const [buckets, setBuckets] = useState<Bucket[]>([]);
    const { profiles, currentProfile } = useUserSessionStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleListBuckets = async () => {
        try {
            setLoading(true);
            const profile = localStorage.getItem('aws-profile') || '';
            const bucketList = await listAllBuckets(profile);
            console.log('bucketList', bucketList.Buckets)
            setBuckets(bucketList.Buckets);
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

    const handleNavigate = (bucket: string) => {
        navigate(`/buckets/${bucket}`);
    };

    useEffect(() => {
        if (profiles.length > 0) {
            handleListBuckets(); // Ejecutar al montar el componente si hay perfiles
        }
    }, [profiles, currentProfile]);

    return (
        <div className='relative'>
            <div className='top-14 sticky w-full z-[100]  flex justify-between items-center bg-background py-4'>
                <p className='font-semibold'>S3 Buckets</p>
                <Button size='icon' variant='ghost' onClick={handleListBuckets}>
                    <RefreshCcw size={18} />
                </Button>
            </div>
            {/* <Separator className='my-2' />  */}
            <div className={`py-4 ${loading || profiles.length === 0 || buckets.length === 0 ? 'flex flex-col justify-center' : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'}`}>
                {loading ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='flex items-center justify-center py-8'>
                        <Spinner />
                    </div>
                ) : profiles.length === 0 ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='mx-auto text-center flex flex-col justify-center'>
                        <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>No profiles available</p>
                    </div>
                ) : buckets.length === 0 && !loading ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='mx-auto text-center flex flex-col justify-center'>
                        <Folder fill='currentColor' className='mx-auto' size={24} />
                        <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>No buckets available</p>
                        <Button className='mt-4'>
                            Create Bucket
                            <Plus className='ml-2' size={18} />
                        </Button>
                    </div>
                ) : (
                    buckets.map((bucket, index) => (
                        <Card onClick={() => handleNavigate(bucket.Name)} title={bucket.Name} key={index} className='p-4 flex items-center justify-between gap-4 hover:bg-secondary/30 rounded-md cursor-pointer'>
                            <div className='flex items-center gap-4'>
                                <Folder fill='currentColor' size={16} />
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
