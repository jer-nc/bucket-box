// useSubfolderContents.js
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserSessionStore } from '@/store/useSessionStore';
import { File } from '@/lib/app';
import { toast } from '@/components/ui/use-toast';
import { extractBucketAndFolder } from '@/lib/utils';
import { fetchSubfolderContents } from '@/services/fetchSubfolderContents';

const useSubfolderContents = () => {
    const { pathname: currentPathname } = useLocation();
    const { profiles, currentProfile } = useUserSessionStore();
    const [loading, setLoading] = useState(true);
    const [bucketContents, setBucketContents] = useState<File[]>([]);
    const navigate = useNavigate();

    const { bucketName, folderPath } = extractBucketAndFolder(currentPathname);

    useEffect(() => {
        if (profiles.length > 0 && currentPathname !== '/') {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const profile = localStorage.getItem('aws-profile') || '';
                    const response = await fetchSubfolderContents(bucketName, folderPath, profile);

                    if (response) {
                        setBucketContents(response as File[]);
                    } else {
                        setBucketContents([]);
                    }
                } catch (error) {
                    console.error(error);
                    setBucketContents([]);
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
            fetchData();
        }
    }, [profiles, currentProfile, currentPathname, bucketName, folderPath]);

    const handleNavigate = (prefix: string) => {
        const folderName = currentPathname.replace('/buckets/', '');
        const newPathname = `/buckets/${folderName}/${prefix}`;
        navigate(newPathname);
    };

    const handleCardClick = (file: File) => {
        if (file.type === 'folder') {
            handleNavigate(file.name);
        } else {
            return;
        }
    };

    return { loading, bucketContents, handleCardClick };
};

export default useSubfolderContents;
