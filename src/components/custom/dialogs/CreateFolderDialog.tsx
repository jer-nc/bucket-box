import { createBucketFolder } from "@/cli-functions/createBucketFolder"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { FolderResponse } from "@/lib/app"
import { folderBucketSchema } from "@/schemas/folder-bucket-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FolderPlus } from "lucide-react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { useLocation } from "react-router-dom"
import { z } from "zod"

interface CreateFolderDialogProps {
    bucketName: string
    folderPath: string
    profile: string
}

const CreateFolderDialog = ({ bucketName, folderPath, profile }: CreateFolderDialogProps) => {
    const { pathname: currentPathname } = useLocation()
    const queryClient = useQueryClient()

    const splitedPath = currentPathname.split('/');

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
        onSuccess: async ({ res, variables }) => {
            const { name } = variables;
            form.reset();
            if (res) {
                toast({
                    title: "Success",
                    description: `Successfully created folder ${name}`,
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
            document.getElementById('closeDialog')?.click();
        },
        onError: (error) => {
            form.reset();
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
        const { name } = data as { name: string };
        createBucketMutation.mutate({ name });
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size='icon' variant='ghost'>
                    <FolderPlus size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Create Folder</DialogTitle>
                    <DialogDescription className="py-4">
                        Create a new folder in <span className="font-semibold text-emerald-500">{bucketName && folderPath.length > 0 ? bucketName + '/' + folderPath + '/' : bucketName + '/' + folderPath}</span> path.
                    </DialogDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="pt-2 space-y-4">
                            <div className="grid grid-cols-1 gap-8 items-center">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Folder Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter folder name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className="pt-4">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={createBucketMutation.status === 'pending'}>
                                    {
                                        createBucketMutation.status === 'pending' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: 'currentColor' }}></div>
                                                Creating...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                Create Folder
                                            </div>
                                        )
                                    }
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>

                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CreateFolderDialog