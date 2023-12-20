import { Skeleton } from "@/components/ui/skeleton"

const SheetSkeleton = () => {
    return (
        <div className="py-8">
            <div className="space-y-2">
                <Skeleton className="h-4 w-[350px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[350px]" />
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-4 w-[350px]" />
                <Skeleton className="h-[300px] w-full" />
            </div>
        </div>
    )
}

export default SheetSkeleton