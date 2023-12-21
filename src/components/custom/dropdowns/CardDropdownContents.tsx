import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, PanelTop } from "lucide-react";
import { open } from '@tauri-apps/api/shell';
import { getBucketRegion } from "@/cli-functions/getBucketRegion";
import { useUserSessionStore } from "@/store/useSessionStore";
import ObjectDetailSheet from "../sheets/ObjectDetailSheet";
import SyncBucketObjectsDialog from "../dialogs/SyncBucketObjectsDialog";
import { File } from "@/lib/app";
import { extractBucketAndFolder } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export interface CardDropdownProps {
    file: File;
}

const CardDropdownContents = ({ file }: CardDropdownProps) => {
    const { currentProfile } = useUserSessionStore();
    const { pathname: currentPathname } = useLocation();

    console.log('file t', file)
    const { bucketName, folderPath } = extractBucketAndFolder(currentPathname);

    console.log('bucketName', bucketName)
    console.log('folderPath', folderPath)

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
                            let bucketRegion = await getBucketRegion(bucketName, currentProfile);
                            console.log('bucketRegion', bucketRegion)
                            if (bucketRegion === null) {
                                bucketRegion = 'us-east-1';
                            }
                            // replace backslashes with %5C for the url
                            const slashFilename =  file.name.replace(/\\/g, '%5C');

                            if (file.type === 'folder') {
                                if (folderPath !== '') {
                                    open("https://console.aws.amazon.com/s3/buckets/" + `${bucketName}` + "/?region=" + `${bucketRegion}` + `&prefix=${folderPath}/${slashFilename}/`)
                                } else {
                                    open("https://console.aws.amazon.com/s3/buckets/" + `${bucketName}` + "/?region=" + `${bucketRegion}` + `&prefix=${slashFilename}/`)
                                }
                            } else {
                                if (folderPath !== '') {
                                    open("https://console.aws.amazon.com/s3/buckets/" + `${bucketName}` + "/?region=" + `${bucketRegion}` + `&prefix=${folderPath}/${slashFilename}`)
                                } else {
                                    open("https://console.aws.amazon.com/s3/buckets/" + `${bucketName}` + "/?region=" + `${bucketRegion}` + `&prefix=${slashFilename}`)
                                }
                            }
                        }}
                    >
                        <PanelTop size={16} className="mr-2" />
                        Open in AWS Console
                    </DropdownMenuItem>
                   
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CardDropdownContents