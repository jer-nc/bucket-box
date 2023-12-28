import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { CardDropdownProps } from "../dropdowns/CardDropdownContents"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteObject } from "@/cli-functions/deleteObject"
import { toast } from "@/components/ui/use-toast"
import { useLocation } from "react-router-dom"

interface DeleteObjectsDialogProps {
    file: CardDropdownProps['file'];
    bucketName: string;
    folderPath: string;
    currentProfile: string;
}

const DeleteObjectsDialog = ({ file, bucketName, folderPath, currentProfile }: DeleteObjectsDialogProps) => {
    const { pathname: currentPathname } = useLocation()
    const queryClient = useQueryClient()

    const splitedPath = currentPathname.split('/');

    const deleteObjectMutation = useMutation({
        mutationFn: async () => {
            const awsResponse = await deleteObject({ bucketName, folderPath, fileName: file.name, currentProfile, type: file.type });
            // console.log('awsResponse', awsResponse)
            const res = { res: awsResponse };
            return res;
        },
        onSuccess: async ({ res }) => {
            if (res) {
                toast({
                    title: "Success",
                    description: `Successfully deleted ${file.name}`,
                    variant: "default",
                });
            }
            if (splitedPath.length === 3) {
                await queryClient.refetchQueries({
                    queryKey: ['bucketData', currentProfile, bucketName],
                });
            } else {
                await queryClient.refetchQueries({
                    queryKey: ['bucketDataSubfolder', currentProfile, folderPath],
                });
            }
            document.getElementById('closeDialog')?.click();
        },
        onError: async (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "default",
            });
        },

    })


    const handleSubmit = () => {
        // console.log('delete')
        deleteObjectMutation.mutate();
    }


    return (
        <Dialog>
            <DialogTrigger className="flex items-center w-full cursor-default">
                <div className="flex items-center w-full">
                    <Trash2 size={16} className="mr-2" />
                    Delete {file.type === 'file' ? 'File' : 'Folder'}
                </div>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Delete s3 Objects</DialogTitle>
                    <DialogDescription className="py-4">
                        Delete s3  <span className="font-semibold text-emerald-500">
                            {file.name}
                        </span> {file.type === 'file' ? 'file' : 'folder'}.
                    </DialogDescription>

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant='destructive' disabled={deleteObjectMutation.status === 'pending'} onClick={handleSubmit}>
                            {
                                deleteObjectMutation.status === 'pending' ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'currentColor' }}></div>
                                        Deleting...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Trash2 size={16} className="mr-2" />
                                        Delete
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

export default DeleteObjectsDialog