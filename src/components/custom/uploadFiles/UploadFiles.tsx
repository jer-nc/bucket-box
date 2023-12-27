import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { listen } from '@tauri-apps/api/event'
import { useState, useEffect } from 'react'
import { FileDropEvent, FileOrDirectory, UploadFilesProps } from '@/lib/app';
import { isFileOrDirectory } from '@/lib/isFileOrDir';
import { uploadFiles } from '@/cli-functions/uploadFiles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

const UploadFiles = ({ bucketName, folderPath, profile, currentPathname }: UploadFilesProps) => {
    const queryClient = useQueryClient()

    const [files, setFiles] = useState<FileOrDirectory[]>([])
    const [open, setOpen] = useState(false)
    const splitedPath = currentPathname.split('/');

    listen('tauri://file-drop', async (event: FileDropEvent) => {
        const fileObjects = await Promise.all(event.payload.map(async filePath => {
            return await isFileOrDirectory(filePath)
        }))
        setFiles(fileObjects as FileOrDirectory[])
    })

    console.log('files', files)

    useEffect(() => {
        if (files.length > 0) {
            setOpen(true)
        }
    }, [files])

    const handleClose = () => {
        setFiles([])
        setOpen(!open)
    }

    const handleSubmit = async () => {
        console.log('submit')
        uploadFilesMutation.mutate({ bucketName, folderPath, files, profile });
    }


    const uploadFilesMutation = useMutation<
        { res: unknown; variables: { bucketName: string; folderPath: string | undefined; files: FileOrDirectory[], profile: string } },
        Error,
        { bucketName: string; folderPath: string | undefined; files: FileOrDirectory[], profile: string }
    >({
        mutationFn: async ({ bucketName, folderPath, files, profile }) => {
            const res = await uploadFiles({ bucketName, folderPath, files, profile });
            return { res, variables: { bucketName, folderPath, files, profile } };
        },
        onSuccess: async ({ res, variables }) => {
            const { bucketName } = variables;
            if (res) {
                toast({
                    title: "Success",
                    description: `Successfully uploaded files to ${bucketName}`,
                    variant: "default",
                });
            }
            if (splitedPath.length === 3) {
                await queryClient.refetchQueries({
                    queryKey: ['bucketData', profile, bucketName],
                });
            } else {
                await queryClient.refetchQueries({
                    queryKey: ['bucketDataSubfolder', profile, folderPath],
                });
            }
            setOpen(false)
        },
        onError: (error, variables) => {
            const { bucketName } = variables;
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: `Failed to upload files to ${bucketName} - ${error.message}`,
                    variant: "destructive",
                });
            }
        },
    });

    return (
        <div>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Files</DialogTitle>
                        <DialogDescription className="py-4">
                            Upload files to the current bucket path.
                        </DialogDescription>
                        <div>
                            <p className='font-semibold'>Files to upload</p>
                            <div className='py-4 text-muted-foreground'>
                                {files.map((file, index) => (
                                    <div key={index}>{file.filename}</div>
                                ))}
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" onClick={handleSubmit} disabled={uploadFilesMutation.status === 'pending'}>
                                {
                                    uploadFilesMutation.status === 'pending' ? (
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
        </div>
    )
}

export default UploadFiles
