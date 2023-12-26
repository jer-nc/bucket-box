import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { listen } from '@tauri-apps/api/event'
import { useState, useEffect } from 'react'

interface FileDropEvent {
    event: string;
    windowLabel: string;
    payload: string[];
    id: number;
}

interface UploadFilesProps {
    bucketName: string
    folderPath: string
    profile: string
}

const UploadFiles = ({ bucketName, folderPath, profile }: UploadFilesProps) => {
    const [files, setFiles] = useState<string[]>([])
    const [open, setOpen] = useState(false)

    listen('tauri://file-drop', (event: FileDropEvent) => {
        const fileNames = event.payload.map(filePath => {
            const segments = filePath.split(/[\\/]+/)
            return segments.pop()
        }).filter((fileName): fileName is string => Boolean(fileName))
        setFiles(fileNames)
    })

    useEffect(() => {
        if (files.length > 0) {
            setOpen(true)
        }
    }, [files])

    const handleClose = () => {
        setFiles([])
        setOpen(!open)
    }

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
                                    <div key={index}>{file}</div>
                                ))}
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UploadFiles
