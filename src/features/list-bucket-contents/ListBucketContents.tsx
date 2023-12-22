import { getBucketContents } from '@/cli-functions';
import CardDropdownContents from '@/components/custom/dropdowns/CardDropdownContents'
import IconMap from '@/components/custom/icons/IconMap';
import Spinner from '@/components/custom/loaders/Spinner'
import { Card } from '@/components/ui/card'
import { File } from '@/lib/app'
import { getFileExtension } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { File as FileIcon, Folder } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'


const ListBucketContents = () => {
  const { pathname: currentPathname } = useLocation();
  const navigate = useNavigate();
  const profile = localStorage.getItem('aws-profile') || '';
  const bucketName = currentPathname.replace('/buckets/', '');

  const { data, isLoading } = useQuery({
    queryKey: ['bucketData', bucketName, profile],
    queryFn: () => getBucketContents(bucketName, profile)
  });

  console.log('data', data)

  const handleNavigate = (prefix: string) => {
    console.log('prefix', prefix)
    const bucketName = currentPathname.replace('/buckets/', '');
    const newPathname = `/buckets/${bucketName}/${prefix}`
    console.log('newPathname', newPathname)
    navigate(newPathname);
  };

  const handleCardClick = (file: File) => {
    if (file.type === 'folder') {
      handleNavigate(file.name);
    } else {
      return;
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = getFileExtension(fileName);
    return IconMap[extension] || <FileIcon size={16} />;
  };


  return (
    <div className='relative'>
      <div className='py-4'>
        {isLoading ? (
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
              <Card onClick={() => handleCardClick(file)}
                title={file.name} key={index}
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
  )
}

export default ListBucketContents