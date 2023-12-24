import { createBucketFolder } from "@/cli-functions/createBucketFolder"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { folderBucketSchema } from "@/schemas/folder-bucket-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { FolderPlus } from "lucide-react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

interface CreateFolderDialogProps {
    bucketName: string
    folderPath: string
    profile: string
}

interface Folder {
    name: string
}

type FolderResponse = {
    ETag: string;
    ServerSideEncryption: string;
}

const CreateFolderDialog = ({ bucketName, folderPath, profile }: CreateFolderDialogProps) => {

    const form = useForm<z.infer<typeof folderBucketSchema>>({
        resolver: zodResolver(folderBucketSchema),
        defaultValues: {
            name: "",
        },
    })

    const createBucketMutation = useMutation<
        { res: FolderResponse; variables: { name: string } },
        Error,
        { name: string }
    >({
        mutationFn: async ({ name }) => {
            const folderResponse = await createBucketFolder({ bucketName, folderPath, folderName: name, profile });
            const res = { res: folderResponse, variables: { name } };
            return res;
        },
        onSuccess: ({ res, variables }) => {
            const { name } = variables;
            if (res) {
                toast({
                    title: "Success",
                    description: `Successfully created folder ${name}`,
                    variant: "default",
                });
            }
        },
        onError: (error) => {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: `Failed to create folder ${name} - ${error.message}`,
                    variant: "destructive",
                });
            }
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        const { name } = data as Folder;
        createBucketMutation.mutate({ name });
    };


    return (
        <Dialog>
            <DialogTrigger>
                <Button size='icon' variant='ghost'>
                    <FolderPlus size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Create Folder</DialogTitle>
                    <DialogDescription className="py-4">
                        Create a new folder in <span className="font-semibold text-emerald-500">{bucketName && folderPath.length > 0 ? bucketName + '/' + folderPath + '/' : bucketName + '/' + folderPath}</span> bucket.
                    </DialogDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="pt-2 space-y-4">
                            <div className="grid grid-cols-1 gap-8 items-center">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bucket Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="my-bucket-name" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Bucket names must be unique across all existing bucket names in Amazon S3.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="w-full flex justify-end">
                                <Button type="submit" disabled={createBucketMutation.status === 'pending'}>
                                    {
                                        createBucketMutation.status === 'pending' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'currentColor' }}></div>
                                                Creating...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                Create Bucket
                                            </div>
                                        )
                                    }
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button >
                            Create Folder
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CreateFolderDialog