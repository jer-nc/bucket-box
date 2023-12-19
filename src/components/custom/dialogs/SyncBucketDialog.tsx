import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FolderDown } from "lucide-react";
import { open } from '@tauri-apps/api/dialog';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CardDropdownProps } from "../dropdowns/CardDropdown";

const SyncBucketDialog = ({ bucket }: CardDropdownProps) => {
    const [selectedPath, setSelectedPath] = useState<string | null>(null);

    const openDialog = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
        });

        if (selected === null) {
            setSelectedPath(null);
        } else {
            console.log(selected);
            setSelectedPath(selected as string);
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
                        Choose a local folder to sync the contents of <span className="font-semibold">{bucket.Name}</span>. This will download all the files in the bucket to the local folder.
                    </DialogDescription>

                    <Button variant='outline' onClick={openDialog}>
                        Choose Folder
                    </Button>
                    {
                        selectedPath && (
                            <div className="text-xs font-semibold text-muted-foreground">
                                Selected Path: {selectedPath}
                            </div>
                        )
                    }
                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={!selectedPath} >Sync</Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default SyncBucketDialog