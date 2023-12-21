import { getBucketContents } from '@/cli-functions/getBucketContents'
import { getBucketRegion } from '@/cli-functions/getBucketRegion'
import CardDropdownContents from '@/components/custom/dropdowns/CardDropdownContents'
import Spinner from '@/components/custom/loaders/Spinner'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { useUserSessionStore } from '@/store/useSessionStore'
import { File, Folder } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'


export interface File {
  name: string;
  lastModified?: string;
  size?: number;
  type: string;
}

const ListBucketContents = () => {
  const { pathname: currentPathname } = useLocation()
  const { profiles, currentProfile } = useUserSessionStore();
  const [loading, setLoading] = useState(true);
  const [bucketContents, setBucketContents] = useState<File[]>([]);
  const navigate = useNavigate();


  console.log('currentPathname', currentPathname)

  const handleGetBucketContents = async () => {
    try {
      setLoading(true);
      const profile = localStorage.getItem('aws-profile') || '';
      const folderName = currentPathname.replace('/buckets/', '');
      const bucketLocation = await getBucketRegion(folderName, profile);

      console.log('bucketLocation', bucketLocation)
      const response = await getBucketContents(folderName, profile, bucketLocation);
      console.log('bucketContents', response)
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
  }

  console.log('bucketContents', bucketContents)

  useEffect(() => {
    if (profiles.length > 0 && currentPathname !== '/') {
      // getBucketContents(currentPathname, '', currentProfile)
      handleGetBucketContents(); // Ejecutar al montar el componente si hay perfiles
    }
  }, [profiles, currentProfile, currentPathname]);

  const handleNavigate = (prefix: string) => {
    // navigate(`/buckets/${bucket}`);
    console.log('prefix', prefix)
    const folderName = currentPathname.replace('/buckets/', '');
    const newPathname = `/buckets/${folderName}/${prefix}`
    console.log('newPathname', newPathname)
    navigate(newPathname);
  };

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
              <Card onClick={() => handleNavigate(file.name)} title={file.name} key={index} className='p-4 flex items-center justify-between gap-4 hover:bg-secondary/30 rounded-md cursor-pointer'>
                <div className='flex items-center gap-4'>
                  {
                    file.type === 'folder' ? (
                      <Folder fill='currentColor' size={24} />
                    ) : (
                      <File fill='currentColor' size={24} />
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