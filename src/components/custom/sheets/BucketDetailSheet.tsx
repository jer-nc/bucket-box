import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Eye } from "lucide-react"
import { CardDropdownProps } from "../dropdowns/CardDropdown"
import { getBucketDetails } from "@/cli-functions/getBucketDetails"
import { toast } from "@/components/ui/use-toast"
import { useUserSessionStore } from "@/store/useSessionStore"
import { useEffect, useState } from "react"
import SheetSkeleton from "../skeletons/SheetSkeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
                            loading ? (
                                <SheetSkeleton />
                            ) : (
                                <ScrollArea className="h-[80vh] ">
                                    <div className="py-6 pr-4">
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
                                        <p className="text-sm font-semibold mt-3 mb-2">
                                            Bucket Policy
                                        </p>
                                        <SyntaxHighlighter className="rounded-md" language="json" style={vs2015}>
                                            {bucketDetails?.policy ? JSON.stringify(JSON.parse(bucketDetails.policy), null, 2) : 'No policy found'}
                                        </SyntaxHighlighter>


                                        <p className="text-sm font-semibold mt-3 mb-2">
                                            Bucket CORS Rules
                                        </p>
                                        <SyntaxHighlighter className="rounded-md" language="json" style={vs2015}>
                                            {JSON.stringify(bucketDetails?.corsRules, null, 2) || 'No CORS rules found'}
                                        </SyntaxHighlighter>
                                    </div>
                                </ScrollArea>
                            )
                        }
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </>

    )
}

export default BucketDetailSheet