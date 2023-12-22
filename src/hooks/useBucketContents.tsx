import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserSessionStore } from '@/store/useSessionStore';
import { fetchBucketContents } from '@/services/fetchBucketContents';
import { File } from '@/lib/app';
import { toast } from '@/components/ui/use-toast';
import { useBucketStore } from '@/store/useBucketStore';
import { getBucketRegion } from '@/cli-functions';

const useBucketContents = () => {
    const { pathname: currentPathname } = useLocation();
    const { profiles, currentProfile } = useUserSessionStore();
    const [loading, setLoading] = useState(true);
    const [bucketContents, setBucketContents] = useState<File[]>([]);
    const { setCurrentBucketRegion } = useBucketStore();

    useEffect(() => {
        if (profiles.length > 0 && currentPathname !== '/') {
            const fetchData = async () => {
                setLoading(true);
                const profile = localStorage.getItem('aws-profile') || '';
                const folderName = currentPathname.replace('/buckets/', '');

                try {
                    const region = await getBucketRegion(folderName, profile);
                    setCurrentBucketRegion(region);
                    const contents = await fetchBucketContents(folderName, profile, region);
                    setBucketContents(contents as File[]);
                    setLoading(false);
                } catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        toast({
                            title: 'Error',
                            description: error.message,
                            variant: 'destructive',
                            className: 'text-xs',
                        });
                    }
                    setLoading(false);
                    setBucketContents([]);
                }
            };
            fetchData();
        }
    }, [profiles, currentPathname, currentProfile]);

    return { loading, bucketContents };
};

export default useBucketContents;
