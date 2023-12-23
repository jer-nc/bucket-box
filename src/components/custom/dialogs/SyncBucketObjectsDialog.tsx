import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FolderDown } from "lucide-react";
import { open } from '@tauri-apps/api/dialog';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { syncBucketContents } from "@/cli-functions/syncBucketContents";
import { useUserSessionStore } from "@/store/useSessionStore";
import { getBucketRegion } from "@/cli-functions/getBucketRegion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import { File } from "@/lib/app";
import { getBucketName } from "@/lib/utils";

interface SyncBucketDialogProps {
  file: File;
}

const SyncBucketObjectsDialog = ({ file }: SyncBucketDialogProps) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [responseLog, setResponseLog] = useState<React.ReactNode[] | string>();
  const { currentProfile } = useUserSessionStore();
  const [loading, setLoading] = useState(false);
  const { pathname: currentPathname } = useLocation()


  const openDialog = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
    });

    if (selected === null) {
      setSelectedPath(null);
      setResponseLog("")
    } else {
      console.log(selected);
      setSelectedPath(selected as string);
    }
  }

  const handleSync = async () => {
    setLoading(true);

    try {
      const bucketname = getBucketName(currentPathname);
      const bucketPath = currentPathname.split('/').slice(2).join('/');
      const fullPath = bucketPath + '/' + file.name;
      const region = await getBucketRegion(bucketname!, currentProfile);
      let isFolder = false;
      if (file.type === 'folder') {
        isFolder = true;
      } else {
        isFolder = false;
      }
      const response = await syncBucketContents(selectedPath!, fullPath, currentProfile, region, isFolder,
        (log: string) => {
          // Actualiza el responseLog dividiendo los mensajes por saltos de línea
          setResponseLog(prevLog =>
            prevLog ? prevLog + '\n' + log : log
          );
        }
      );
      if (response && response?.length > 0) {
        toast({
          title: 'Success',
          description: 'Files downloaded successfully',
          variant: 'default',
          className: 'text-xs',
        });
        const responseMessages = response.split('\n').map((message, index) => (
          <p key={index} className="text-xs text-muted-foreground font-normal">
            {message}
          </p>
        ));
    
        setResponseLog(responseMessages);
      } else {
        setResponseLog("No files downloaded.");
      }
    } catch (error) {
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

  return (
    <Dialog>
      <DialogTrigger className="flex items-center w-full cursor-default">
        <div className="flex items-center w-full">
          <FolderDown size={16} className="mr-2" />
          Sync
        </div>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Sync Bucket Object Locally</DialogTitle>
          <DialogDescription className="py-4">
            {
              file.type === 'folder' ? (
                <>
                  Choose a local folder to sync <span className="font-semibold text-emerald-500">{file.name}</span> folder.
                  This will download all the files in the folder to the local folder.
                </>
              ) : (
                <>
                  Choose a local folder to sync <span className="font-semibold text-emerald-500">{file.name}</span> object.
                  This will download the file to the local folder.
                </>
              )
            }

          </DialogDescription>

          <Button variant='outline' onClick={openDialog}>
            Choose Folder
          </Button>
          {
            selectedPath && (
              <div className="text-xs font-semibold text-muted-foreground">
                Selected Path: <span className="font-normal">{selectedPath}</span>
              </div>
            )
          }
          {responseLog &&
            <ScrollArea className="w-full max-h-[300px] py-6">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-normal">{responseLog}</p>
              </div>
            </ScrollArea>
          }
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={!selectedPath || loading} onClick={handleSync}>
              {
                loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'currentColor' }}></div>
                    Syncing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FolderDown size={16} className="mr-2" />
                    Sync
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

export default SyncBucketObjectsDialog