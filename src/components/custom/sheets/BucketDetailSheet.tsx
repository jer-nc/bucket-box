import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Eye } from "lucide-react"
import { CardDropdownProps } from "../dropdowns/CardDropdown"
import { getBucketDetails } from "@/cli-functions/getBucketDetails"
import { toast } from "@/components/ui/use-toast"
import { useUserSessionStore } from "@/store/useSessionStore"
import { useEffect, useState } from "react"
import Spinner from "../loaders/Spinner"


interface BucketDetail {
    location: string;
    bucketArn: string;
    policy: string;
    corsRules: string;
}

const BucketDetailSheet = ({ bucket }: CardDropdownProps) => {
    const { currentProfile } = useUserSessionStore();
    const [bucketDetails, setBucketDetails] = useState<BucketDetail>({} as BucketDetail);
    const [loading, setLoading] = useState(false);

    const handleBucketDetail = async () => {
        try {
            setLoading(true);
            const response = await getBucketDetails(bucket.Name, currentProfile);
            console.log(response);
            setBucketDetails(response as BucketDetail);
        } catch (error) {
            setLoading(false);
            console.error(error);
            if (error instanceof Error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                    className: 'text-xs',
                });
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleBucketDetail();
    }, []);

    return (
        <>
            <Sheet>
                <SheetTrigger className="flex items-center w-full cursor-default">
                    <div className="flex items-center w-full">
                        <Eye size={16} className="mr-2" />
                        Details
                    </div>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{bucket.Name} <span className="text-muted-foreground">(Bucket)</span></SheetTitle>
                        <p className="text-sm font-semibold">
                            Creation Date:
                            <span className="ml-2 font-normal text-muted-foreground">
                                {bucket.CreationDate}
                            </span>
                        </p>

                        {
                            loading ? (<Spinner />) : (
                                <div className="py-4">
                                    <div>
                                        <p className="text-sm font-semibold">
                                            Region:
                                            <span className="ml-2 font-normal text-muted-foreground">
                                                {bucketDetails?.location || 'us-east-1'}
                                            </span>
                                        </p>
                                        <p className="text-sm font-semibold">
                                            Bucket ARN:
                                            <span className="ml-2 font-normal text-muted-foreground">
                                                {bucketDetails?.bucketArn}
                                            </span>
                                        </p>
                                        <p className="text-sm font-semibold mt-3">
                                            Bucket Policy:
                                            <br />
                                            <span className="font-normal text-muted-foreground">
                                                <code>
                                                    {bucketDetails?.policy || 'No policy found'}
                                                </code>
                                            </span>
                                        </p>
                                        <p className="text-sm font-semibold mt-3">
                                            Bucket CORS Rules:
                                            <br />
                                            <span className="font-normal text-muted-foreground">
                                                <code>
                                                    {JSON.stringify(bucketDetails?.corsRules) || 'No CORS rules found'}
                                                </code>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </>

    )
}

export default BucketDetailSheet