import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, PanelTop, Trash2 } from "lucide-react";
import { open } from '@tauri-apps/api/shell';
import { getBucketRegion } from "@/cli-functions";
import { useUserSessionStore } from "@/store/useSessionStore";
import SyncBucketDialog from "../dialogs/SyncBucketDialog";
import BucketDetailSheet from "../sheets/BucketDetailSheet";
import { Bucket } from "@/lib/app";

export interface CardDropdownProps {
    bucket: Bucket;
}

const CardDropdown = ({ bucket }: CardDropdownProps) => {
    const { currentProfile } = useUserSessionStore();

    // console.log('bucket', bucket)
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size='icon'
                        variant='ghost'
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <MoreVertical size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <div className="text-xs p-2 font-semibold flex items-center "
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        {bucket.Name}
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <BucketDetailSheet bucket={bucket} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <SyncBucketDialog bucket={bucket} />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={async (e) => {
                            e.stopPropagation();
                            let bucketRegion = await getBucketRegion(bucket.Name, currentProfile);
                          // console.log('bucketRegion', bucketRegion)
                            if (bucketRegion === null) {
                                bucketRegion = 'us-east-1';
                            }
                            open("https://console.aws.amazon.com/s3/buckets/" + `${bucket.Name}` + "/?region=" + `${bucketRegion}` + "&tab=overview")
                        }}
                    >
                        <PanelTop size={16} className="mr-2" />
                        Open in AWS Console
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="bg-destructive/40 hover:bg-destructive focus:bg-destructive text-white"
                        onClick={async (e) => {
                            e.stopPropagation();
                            let bucketRegion = await getBucketRegion(bucket.Name, currentProfile);
                            if (bucketRegion === null) {
                                bucketRegion = 'us-east-1';
                            }
                            open("https://console.aws.amazon.com/s3/bucket/" + `${bucket.Name}` + "/delete?region=" + `${bucketRegion}`)
                        }}
                    >
                        <Trash2 size={16} className="mr-2" />
                        Delete in AWS Console
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CardDropdown