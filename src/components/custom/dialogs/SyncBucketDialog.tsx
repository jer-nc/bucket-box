import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FolderDown } from "lucide-react";

const SyncBucketDialog = () => {


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
                    <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default SyncBucketDialog