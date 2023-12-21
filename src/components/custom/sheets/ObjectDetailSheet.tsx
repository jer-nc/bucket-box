import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Eye } from "lucide-react"
import SheetSkeleton from "../skeletons/SheetSkeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { File } from "@/lib/app"


interface ObjectDetail {
    file: File;
}

const ObjectDetailSheet = ({ file }: ObjectDetail) => {

    const [loading, setLoading] = useState(false);

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
                        <SheetTitle>{file.name}</SheetTitle>
                        <p className="text-sm font-semibold">
                            Type:
                            <span className="ml-2 font-normal text-muted-foreground">
                                {file.type.toUpperCase()}
                            </span>
                        </p>
                        {
                            file.type === 'file' && (
                                <>
                                    <p className="text-sm font-semibold">
                                        Last Modified:
                                        <span className="ml-2 font-normal text-muted-foreground">
                                            {file.lastModified}
                                        </span>
                                    </p>
                                    <p className="text-sm font-semibold">
                                        Size:
                                        <span className="ml-2 font-normal text-muted-foreground">
                                            {file.size}
                                        </span>
                                    </p>
                                </>
                            )
                        }
                        {
                            loading ? (
                                <SheetSkeleton />
                            ) : (
                                <ScrollArea className="h-[90vh] ">
                                    {/* <div className="py-6 pr-4">
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
                                    </div> */}
                                </ScrollArea>
                            )
                        }
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default ObjectDetailSheet