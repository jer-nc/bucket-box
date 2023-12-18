import { getBucketContents } from '@/cli-functions/getBucketContents'
import { getBucketRegion } from '@/cli-functions/getBucketRegion'
import Spinner from '@/components/custom/loaders/Spinner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUserSessionStore } from '@/store/useSessionStore'
import { ChevronLeft, File, Folder, RefreshCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const FolderPage = () => {
  const { pathname: currentPathname } = useLocation()
  const { profiles, currentProfile } = useUserSessionStore();
  const [loading, setLoading] = useState(false);
  const [bucketContents, setBucketContents] = useState<File[]>([]);
  const navigate = useNavigate();

  interface File {
    Key: string;
    LastModified?: string;
    Size?: number;
  }

  interface TopLevelItems {
    [key: string]: File;
  }

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
      if (response.Contents) {
        const topLevelItems: TopLevelItems = {};

        response.Contents.forEach((item: File) => {
          const keySegments = item.Key.split('/');
          const topLevelFolder = keySegments[0];

          if (!topLevelItems[topLevelFolder]) {
            topLevelItems[topLevelFolder] = {
              ...item,
              Key: topLevelFolder, // Reemplaza la clave completa por el nombre de la carpeta principal
              Size: keySegments.length > 1 ? 0 : item.Size, // Si tiene más de un segmento, es una carpeta, por lo que el tamaño es 0
            };
          }
        });

        const contents = Object.values(topLevelItems);
        setBucketContents(contents);
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

  console.log('bucketContents', bucketContents)

  useEffect(() => {
    if (profiles.length > 0 && currentPathname !== '/') {
      // getBucketContents(currentPathname, '', currentProfile)
      handleGetBucketContents(); // Ejecutar al montar el componente si hay perfiles
    }
  }, [profiles, currentProfile]);

  const handleNavigate = () => {
    navigate('/');
  }

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Button onClick={handleNavigate} size='icon' variant='ghost' >
            <ChevronLeft size={18} />
          </Button>
          <p className='font-semibold'>
            {currentPathname.split('/').pop()}
            <span className='text-muted-foreground text-sm ml-2'>(Folder)</span>
          </p>
        </div>
        <Button size='icon' variant='ghost' >
          <RefreshCcw onClick={handleGetBucketContents} size={18} />
        </Button>
      </div>
      <Separator className='my-2' />

      <div className='py-12'>
        {loading ? (
          <div className='flex items-center justify-center py-8'>
            <Spinner />
          </div>
        ) : bucketContents.length === 0 ? (
          <div className='mx-auto text-center flex flex-col justify-center'>
            <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>No files found</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>

            {bucketContents.map((file: File, index: number) => (
              <div title={file.Key} key={index} className='w-44 mx-auto p-4 flex flex-col gap-4 hover:bg-secondary rounded-md cursor-pointer'>
                {
                  file.Size === 0 ? (
                    <Folder fill='currentColor' width={24} height={24} className='mx-auto' size={24} />
                  ) : (
                    <File fill='currentColor' width={24} height={24} className='mx-auto' size={24} />
                  )
                }
                <p className='text-sm truncate mx-auto max-w-[10rem]'>{file.Key}</p>
                {/* <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>{file.LastModified}</p>
                <p className='text-sm truncate mx-auto max-w-[10rem] text-muted-foreground'>{file.Size}</p> */}
              </div>
            ))}
          </div>

        )}

      </div>
    </div>
  )
}

export default FolderPage