import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Link2 } from "lucide-react"
import { CardDropdownProps } from "../dropdowns/CardDropdownContents";
import { useMutation } from "@tanstack/react-query";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { generatePresignedUrl } from "@/cli-functions/generatePresignedUrl";
import CodeBlock from "../codeblock/CodeBlock";

interface PresignedUrlDialogProps {
    file: CardDropdownProps['file'];
    bucketName: string;
    folderPath: string;
    currentProfile: string;
}

const PresignedUrlDialog = ({ file, bucketName, folderPath, currentProfile }: PresignedUrlDialogProps) => {
    const [expirationTime, setExpirationTime] = useState('')
    const [url, setUrl] = useState('')
    
    const generateUrlMutation = useMutation({
        mutationFn: async () => {
            const awsResponse = await generatePresignedUrl({ bucketName, folderPath, fileName: file.name, currentProfile, expiration: expirationTime });
          // console.log('awsResponse', awsResponse)
            const res = { res: awsResponse };
            return res;
        },
        onSuccess: async ({ res }) => {
            if (res) {
                setUrl(res)
                toast({
                    title: "Success",
                    description: `Successfully generated presigned url for ${file.name}`,
                    variant: "default",
                });
            }
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
        generateUrlMutation.mutate();
    }


    return (
        <Dialog>
            <DialogTrigger className="flex items-center w-full cursor-default">
                <div className="flex items-center w-full">
                    <Link2 size={16} className="mr-2" />
                    Presigned Url
                </div>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Generate Presigned Url</DialogTitle>
                    <DialogDescription className="py-4">
                        Generate presigned url for <span className="font-semibold text-emerald-500">
                            {file.name}
                        </span> {file.type === 'file' ? 'file' : 'folder'}. This url will be valid for the selected expiration time.
                    </DialogDescription>

                    <div>
                        <Select onValueChange={(value) => { setExpirationTime(value) }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Expiration Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Expiration Time</SelectLabel>
                                    <SelectItem value="300">5 Minutes</SelectItem>
                                    <SelectItem value="1200">20 minutes</SelectItem>
                                    <SelectItem value="3600">1 Hour</SelectItem>
                                    <SelectItem value="28800">8 Hours</SelectItem>
                                    <SelectItem value="86400">24 Hours</SelectItem>
                                    <SelectItem value="604800">1 Week</SelectItem>
                                </SelectGroup>
                            </SelectContent>

                        </Select>
                    </div>
                    {
                        url.length > 0 && (

                            <div className="py-4 max-w-[29rem]">
                                <p className="text-sm font-semibold mb-2">
                                    Presigned Url:
                                </p>
                                <CodeBlock language="json" data={url} />
                            </div>
                        )
                    }

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={generateUrlMutation.status === 'pending' || !expirationTime} onClick={handleSubmit}>
                            {
                                generateUrlMutation.status === 'pending' ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'currentColor' }}></div>
                                        Generating...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Link2 size={16} className="mr-2" />
                                        Generate Url
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

export default PresignedUrlDialog