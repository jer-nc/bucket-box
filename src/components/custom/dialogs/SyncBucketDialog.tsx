import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FolderDown } from "lucide-react";
import { open } from '@tauri-apps/api/dialog';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CardDropdownProps } from "../dropdowns/CardDropdown";
import { syncBucketContents } from "@/cli-functions/syncBucketContents";
import { useUserSessionStore } from "@/store/useSessionStore";
import { getBucketRegion } from "@/cli-functions/getBucketRegion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

const SyncBucketDialog = ({ bucket }: CardDropdownProps) => {
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [responseLog, setResponseLog] = useState<string>(); 
    const { currentProfile } = useUserSessionStore();
    const [loading, setLoading] = useState(false);

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
            const region = await getBucketRegion(bucket.Name, currentProfile);
            const response = await syncBucketContents(selectedPath!, bucket.Name, currentProfile, region, true);
            if (response && response?.length > 0) {
                toast({
                    title: 'Success',
                    description: 'Files downloaded successfully',
                    variant: 'default',
                    className: 'text-xs',
                });
                setResponseLog(response);
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
                    <DialogTitle>Sync Bucket Contents Locally</DialogTitle>
                    <DialogDescription className="py-4">
                        Choose a local folder to sync the contents of <span className="font-semibold text-emerald-500">{bucket.Name}</span> bucket. 
                        This will download all the files in the bucket to the local folder.
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
                            <div>
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

export default SyncBucketDialog