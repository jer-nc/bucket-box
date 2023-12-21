import CardDropdownContents from '@/components/custom/dropdowns/CardDropdownContents';
import Spinner from '@/components/custom/loaders/Spinner';
import { Card } from '@/components/ui/card';
import { File as FileIcon, Folder } from 'lucide-react';
import { File } from '@/lib/app';
import useSubfolderContents from '@/store/useSubfolderContents';


const ListBucketSubfolderContents = () => {
    const { loading, bucketContents, handleCardClick } = useSubfolderContents();


    return (
        <div className='relative'>
            <div className='py-4'>
                {loading ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='mx-auto text-center flex flex-col justify-center'>
                        <Spinner />
                    </div>
                ) : bucketContents.length === 0 ? (
                    <div style={{ height: 'calc(100vh - 14.5rem)' }} className='mx-auto text-center flex flex-col justify-center'>
                        <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>No files found</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>

                        {bucketContents.map((file: File, index: number) => (
                            <Card onClick={() => handleCardClick(file)} title={file.name} key={index}
                                className={`p-4 flex items-center justify-between gap-4 hover:bg-secondary/30 rounded-md ${file.type !== 'folder' ? 'cursor-default' : 'cursor-pointer'}`}>
                                <div className='flex items-center gap-4'>
                                    {
                                        file.type === 'folder' ? (
                                            <Folder fill='currentColor' size={16} />
                                        ) : (
                                            <FileIcon size={16} />
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
