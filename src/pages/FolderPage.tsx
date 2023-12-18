import { getBucketContents } from '@/cli-functions/getBucketContents'
import Spinner from '@/components/custom/loaders/Spinner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUserSessionStore } from '@/store/useSessionStore'
import { ChevronLeft, RefreshCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const FolderPage = () => {
  const { pathname: currentPathname } = useLocation()
  const { profiles, currentProfile } = useUserSessionStore();
  const [loading, setLoading] = useState(false);
  const [bucketContents, setBucketContents] = useState([]);

  interface File {
    Key: string;
    LastModified?: string;
    Size?: number;
  }

  console.log('currentPathname', currentPathname)

  const handleGetBucketContents = async () => {
    try {
      setLoading(true);
      const profile = localStorage.getItem('aws-profile') || '';
      const folderName = currentPathname.replace('/buckets/', '');
      const response = await getBucketContents(folderName, profile);
      console.log('bucketContents', response)
      // setBucketContents(bucketContents);
      if (response.Contents) {
        // Filter folders and files from main bucket folder
        // EX: /blender-renders-bucket/
        // All folders and items from blender-renders-bucket/ will be filtered
        const topLevelItems = response.Contents.filter((item: File) => {
          const keyParts = item.Key.split('/');
          // Filtrar los elementos en el directorio raíz
          return keyParts.length === 1 || (keyParts.length === 2 && keyParts[1] === '');
        });
        console.log('topLevelItems', topLevelItems);
        setBucketContents(topLevelItems);
      } else {
        setBucketContents([]);
      }
    } catch (error) {
      console.error(error);
      setBucketContents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (profiles.length > 0 && currentPathname !== '/') {
      // getBucketContents(currentPathname, '', currentProfile)
      handleGetBucketContents(); // Ejecutar al montar el componente si hay perfiles
    }
  }, [profiles, currentProfile]);

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Button size='icon' variant='ghost' >
            <ChevronLeft size={18} />
          </Button>
          <p className='font-semibold'>
            {currentPathname.split('/').pop()}
            <span className='text-muted-foreground text-sm ml-2'>(Folder)</span>
          </p>
        </div>
        <Button size='icon' variant='ghost' >
          <RefreshCcw size={18} />
        </Button>
      </div>
      <Separator className='my-2' />

      <div>
        {loading ? (
          <div className='flex items-center justify-center py-8'>
            <Spinner />
          </div>
        ) : bucketContents.length === 0 ? (
          <div className='mx-auto text-center flex flex-col justify-center'>
            <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>No files found</p>
          </div>
        ) : (
          bucketContents.map((file: File, index: number) => (
            <div key={index} className='flex items-center justify-between py-2 px-4'>
              <p className='text-sm truncate mx-auto max-w-[10rem]'>{file.Key}</p>
              <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>{file.LastModified}</p>
              <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>{file.Size}</p>
            </div>
          ))

        )}

      </div>
    </div>
  )
}

export default FolderPage