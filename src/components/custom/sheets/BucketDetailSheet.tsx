import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Eye } from "lucide-react"
import { CardDropdownProps } from "../dropdowns/CardDropdown"
import { getBucketDetails } from "@/cli-functions/getBucketDetails"
import { toast } from "@/components/ui/use-toast"
import { useUserSessionStore } from "@/store/useSessionStore"
import SheetSkeleton from "../skeletons/SheetSkeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from "@tanstack/react-query"
import CodeBlock from "../codeblock/CodeBlock"
import { useState } from "react"


const BucketDetailSheet = ({ bucket }: CardDropdownProps) => {
    const { currentProfile } = useUserSessionStore();
    const [isClicked, setIsClicked] = useState(false);


    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['bucketDetail', bucket.Name, currentProfile],
        queryFn: () => getBucketDetails(bucket.Name, currentProfile),
        retry: 1,
        enabled: isClicked,
    });

    if (isError) {
        toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        })
    }

    console.log('data', data)


    return (
        <>
            <Sheet>
                <SheetTrigger className="flex items-center w-full cursor-default">
                    <div className="flex items-center w-full" onClick={() => setIsClicked(true)}>
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
                            isLoading ? (
                                <SheetSkeleton />
                            ) : (
                                <ScrollArea className="h-[80vh] ">
                                    <div className="py-6 pr-4">
                                        <p className="text-sm font-semibold">
                                            Region:
                                            <span className="ml-2 font-normal text-muted-foreground">
                                                {data?.location || 'us-east-1'}
                                            </span>
                                        </p>
                                        <p className="text-sm font-semibold">
                                            Bucket ARN:
                                            <span className="ml-2 font-normal text-muted-foreground">
                                                {data?.bucketArn}
                                            </span>
                                        </p>
                                        <p className="text-sm font-semibold mt-3 mb-2">Bucket Policy</p>
                                        <CodeBlock language="json" data={data?.policy ? JSON.stringify(JSON.parse(data.policy), null, 2) : 'No policy found'} />
                                        <p className="text-sm font-semibold mt-3 mb-2">Bucket CORS Rules</p>
                                        <CodeBlock language="json" data={data?.corsRules ? JSON.stringify(data.corsRules, null, 2) : 'No CORS rules found'} />
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