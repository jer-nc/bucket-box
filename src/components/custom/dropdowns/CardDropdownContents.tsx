import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, PanelTop, Trash2 } from "lucide-react";
import { open } from '@tauri-apps/api/shell';
import { getBucketRegion } from "@/cli-functions/getBucketRegion";
import { useUserSessionStore } from "@/store/useSessionStore";
import { File } from "@/features/list-bucket-contents/ListBucketContents";
import ObjectDetailSheet from "../sheets/ObjectDetailSheet";
import SyncBucketObjectsDialog from "../dialogs/SyncBucketObjectsDialog";

export interface CardDropdownProps {
    file: File;
}

const CardDropdownContents = ({ file }: CardDropdownProps) => {
    const { currentProfile } = useUserSessionStore();

    console.log('file', file)
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size='icon'
                        variant='ghost'
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('click')
                        }}
                    >
                        <MoreVertical size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <div className="text-xs p-2 font-semibold flex items-center "
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {file.name}
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log('click')
                        }}
                    >
                        <ObjectDetailSheet file={file} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <SyncBucketObjectsDialog file={file} />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={async (e) => {
                            e.stopPropagation();
                            let bucketRegion = await getBucketRegion(file.name, currentProfile);
                            console.log('bucketRegion', bucketRegion)
                            if (bucketRegion === null) {
                                bucketRegion = 'us-east-1';
                            }
                            open("https://console.aws.amazon.com/s3/buckets/" + `${file.name}` + "/?region=" + `${bucketRegion}` + "&tab=overview")
                        }}
                    >
                        <PanelTop size={16} className="mr-2" />
                        Open in AWS Console
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive"
                        onClick={async (e) => {
                            e.stopPropagation();
                            let bucketRegion = await getBucketRegion(file.name, currentProfile);
                            console.log('bucketRegion', bucketRegion)
                            if (bucketRegion === null) {
                                bucketRegion = 'us-east-1';
                            }
                            open("https://console.aws.amazon.com/s3/bucket/" + `${file.name}` + "/delete?region=" + `${bucketRegion}`)
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

export default CardDropdownContents