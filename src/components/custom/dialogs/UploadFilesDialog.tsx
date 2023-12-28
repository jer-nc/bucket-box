import { getBucketRegion } from '@/cli-functions'
import { uploadFilesFromDialog } from '@/cli-functions/uploadFilesFromDialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/use-toast'
import { useUserSessionStore } from '@/store/useSessionStore'
import { useQueryClient } from '@tanstack/react-query'
import { open } from '@tauri-apps/api/dialog'
import { UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

interface UploadFilesDialogProps {
  bucketName: string
  folderPath: string
  profile: string
}

const UploadFilesDialog = ({ bucketName, folderPath }: UploadFilesDialogProps) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [responseLog, setResponseLog] = useState<React.ReactNode[] | string>();
  const { currentProfile } = useUserSessionStore();
  const [loading, setLoading] = useState(false);
  const [isFolder, setIsFolder] = useState(false);
  const { pathname: currentPathname } = useLocation()
  const queryClient = useQueryClient()
  const splitedPath = currentPathname.split('/');


  const openDialog = async (type: string) => {

    if (type === 'file') {
      setIsFolder(false);
      // Dialog for selecting files
      const selected = await open({
        directory: false,
        multiple: false,
      });

      if (selected === null) {
        setSelectedPath(null);
        setResponseLog("");
      } else {
        // console.log(selected);
        setSelectedPath(selected as string);
      }
    } else {
      setIsFolder(true);
      // Dialog for selecting directories
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected === null) {
        setSelectedPath(null);
        setResponseLog("");
      } else {
        setSelectedPath(selected as string);
      }
    }
  }

  const onSubmit = async () => {
    setLoading(true);

    try {
      const region = await getBucketRegion(bucketName, currentProfile);
      const response = await uploadFilesFromDialog(selectedPath!, bucketName, folderPath, currentProfile, region, isFolder,
        (log: string) => {
          setResponseLog(prevLog =>
            prevLog ? prevLog + '\n' + log : log
          );
        }
      );
      if (response && response?.length > 0) {
        setSelectedPath(null);
        toast({
          title: 'Success',
          description: 'Files uploaded successfully',
          variant: 'default',
        });
        const responseMessages = response.split('\n').map((message, index) => (
          <p key={index} className="text-xs text-muted-foreground font-normal">
            {message}
          </p>
        ));

        setResponseLog(responseMessages);
        if (splitedPath.length === 3) {
          await queryClient.refetchQueries({
            queryKey: ['bucketData', currentProfile, bucketName],
          });
        } else {
          await queryClient.refetchQueries({
            queryKey: ['bucketDataSubfolder', currentProfile, folderPath],
          });
        }
        setResponseLog("");
        document.getElementById('closeDialog')?.click();
      } else {
        setResponseLog("No files uploaded.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
      setSelectedPath(null);
    }
  }



  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <UploadCloud size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription className="py-4">
            Upload Files in <span className="font-semibold text-emerald-500">{bucketName && folderPath.length > 0 ? bucketName + '/' + folderPath + '/' : bucketName + '/' + folderPath}</span> path.
          </DialogDescription>
          <div className='grid grid-cols-2 gap-2'>
            <Button variant='outline' onClick={() => openDialog('folder')}>
              Choose Folder
            </Button>
            <Button variant='outline' onClick={() => openDialog('file')}>
              Choose File
            </Button>
          </div>
          {
            selectedPath && (
              <div className="text-xs font-semibold text-muted-foreground">
                Selected Path: <span className="font-normal">{selectedPath}</span>
              </div>
            )
          }
          {responseLog &&
            <ScrollArea className="w-full max-h-[300px] py-6">
              <div>
                <p className="text-xs text-muted-foreground font-normal">{responseLog}</p>
              </div>
            </ScrollArea>
          }

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!selectedPath || loading} onClick={onSubmit}>
              {
                loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'currentColor' }}></div>
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Upload Files
                  </div>
                )
              }
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default UploadFilesDialog