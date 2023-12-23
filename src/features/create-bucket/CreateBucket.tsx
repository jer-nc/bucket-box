import * as z from "zod"
import { bucketSchema } from "@/schemas/bucket-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import RegionCombobox from "@/components/custom/combobox/RegionCombobox"

const CreateBucket = () => {
    // 1. Define your form.
    const form = useForm<z.infer<typeof bucketSchema>>({
        resolver: zodResolver(bucketSchema),
        defaultValues: {
            bucketName: "",
            region: "us-east-1",
            objectOwnership: {
                control: "DISABLE_ACL",
                aclOptions: {
                    acl: false,
                    otherAccount: "",
                },
            },
            publicAccessBlock: {
                blockAll: false,
                blockSettings: {
                    blockAcls: false,
                    blockPublicPolicy: false,
                    ignorePublicAcls: false,
                    restrictPublicBuckets: false,
                },
            },
            versioning: false,
            tags: [],
            defaultEncryption: {
                encryptionType: "S3_MANAGED",
                kmsKey: "",
            },
            objectLock: {
                enable: false,
                retainUntilDate: "",
                retainForDays: 0,
            },
        },
    })

    // 2. Define a submit handler.
    function onSubmit() {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const values = form.getValues()
        console.log(values)
    }


    return (
        <>
            <div className="py-4">
                <h2 className="text-2xl font-semibold">Create S3 Bucket</h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-8 items-center">
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
                    <div className="w-full flex justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default CreateBucket