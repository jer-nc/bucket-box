import CardDropdownContents from '@/components/custom/dropdowns/CardDropdownContents';
import Spinner from '@/components/custom/loaders/Spinner';
import { Card } from '@/components/ui/card';
import { File as FileIcon, Folder } from 'lucide-react';
import { File } from '@/lib/app';
import { extractBucketAndFolder, getFileExtension } from '@/lib/utils';
import IconMap from '@/components/custom/icons/IconMap';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSubfolderContents } from '@/services/fetchSubfolderContents';
import { useBucketStore } from '@/store/useBucketStore';


const ListBucketSubfolderContents = () => {
    const { pathname: currentPathname } = useLocation();
    const navigate = useNavigate();
    const profile = localStorage.getItem('aws-profile') || '';
    const { bucketName, folderPath } = extractBucketAndFolder(currentPathname);
    const { currentBucketRegion , isRefetching} = useBucketStore();

    console.log('bucketName', bucketName)
    console.log('folderPath', folderPath)
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['bucketDataSubfolder', profile, folderPath],
        queryFn: () => fetchSubfolderContents(bucketName, folderPath, profile, currentBucketRegion),
        retry: 3,
    });

    console.log('data', data)

    if (isError) {
        toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        })
    }
    const getFileIcon = (fileName: string) => {
        const extension = getFileExtension(fileName);
        return IconMap[extension] || <FileIcon size={16} />;
    };

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
    return (
        <div className='relative'>
            <div className='py-4'>
                {isLoading || isRefetching ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='mx-auto text-center flex flex-col justify-center'>
                        <Spinner />
                    </div>
                ) : (data as Array<unknown>)?.length === 0 ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='mx-auto text-center flex flex-col justify-center'>
                        <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>No files found</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>

                        {(data as Array<File>)?.map((file: File, index: number) => (
                            <Card onClick={() => handleCardClick(file)} title={file.name} key={index}
                                className={`p-4 flex items-center justify-between gap-4 hover:bg-secondary/30 rounded-md ${file.type !== 'folder' ? 'cursor-default' : 'cursor-pointer'}`}>
                                <div className='flex items-center gap-4'>
                                    {
                                        file.type === 'folder' ? (
                                            <Folder fill='currentColor' size={16} />
                                        ) : (
                                            getFileIcon(file.name)
                                        )
                                    }
                                    <p className='text-sm truncate max-w-[10rem]'>{file.name}</p>
                                </div>
                                <CardDropdownContents file={file} />
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListBucketSubfolderContents;
