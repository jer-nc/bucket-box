import * as z from "zod"
import { bucketSchema } from "@/schemas/bucket-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import RegionCombobox from "@/components/custom/combobox/RegionCombobox"
import { Checkbox } from "@/components/ui/checkbox"
import { useUserSessionStore } from "@/store/useSessionStore"
import { createBucket } from "@/cli-functions/createBucket"
import { toast } from "@/components/ui/use-toast"


const CreateBucket = () => {
    const { currentProfile } = useUserSessionStore()

    const form = useForm<z.infer<typeof bucketSchema>>({
        resolver: zodResolver(bucketSchema),
        defaultValues: {
            bucketName: "",
            region: "us-east-1",
            publicAccessBlock: {
                blockAll: true,
            },
            versioning: false,
        },
    })

    async function onSubmit() {
        const values = form.getValues()
        console.log(values)
        const { bucketName, region } = values
        try {
            const res = await createBucket({ bucketName, region, profile: currentProfile })
            console.log(res)
            if (res && res.Location.includes(bucketName)) {
                toast({
                    title: "Success",
                    description: `Successfully created bucket ${bucketName}`,
                    variant: "default",
                })
            }
        } catch (error) {
            console.error(error)
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: `Failed to create bucket ${bucketName} - ${error.message}`,
                    variant: "destructive",
                })
            }
        }
    }

    return (
        <div>
            <div className="py-4">
                <h2 className="text-2xl font-semibold">Create S3 Bucket</h2>
                <p className="text-muted-foreground text-sm mt-2">
                    This form allows you to create a new S3 bucket. For advanced options, please use the AWS console or AWS CLI.
                </p>
            </div>
            <div className="max-w-[800px] mx-auto h-[80vh] my-auto flex flex-col mt-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="pt-2 space-y-4">
                        <div className="grid grid-cols-1 gap-8 items-center">
                            <FormField
                                control={form.control}
                                name="bucketName"
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
                            <RegionCombobox form={form} />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="publicAccessBlock.blockAll"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormControl>
                                            <Checkbox
                                                className="mt-2"
                                                disabled={true}
                                                id={field.name}
                                                defaultChecked={true}
                                            />
                                        </FormControl>
                                        <FormLabel>Block all public access</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="versioning"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormControl>
                                            <Checkbox
                                                className="mt-2"
                                                id={field.name}
                                                defaultChecked={field.value as boolean}
                                                value={typeof field.value === 'boolean' ? field.value.toString() : field.value}
                                                onCheckedChange={(e) => {
                                                    field.onChange(e);
                                                    console.log(e)
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel>Enable Versioning</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full flex justify-end">
                            <Button type="submit">Create Bucket</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CreateBucket