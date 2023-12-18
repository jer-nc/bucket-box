import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bucket } from "@/features/list-buckets/ListBuckets";
import { Eye, FolderDown, MoreVertical, PanelTop, Trash2 } from "lucide-react";


export interface CardDropdownProps {
    bucket: Bucket;
}

const CardDropdown = ({ bucket }: CardDropdownProps) => {

    console.log('bucket', bucket)
    return (
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
                        console.log('click')
                    }}
                >
                    {bucket.Name}
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('click')
                    }}
                >
                    <Eye size={16} className="mr-2" />
                    Details
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('click')
                    }}
                >
                    <FolderDown size={16} className="mr-2" />
                    Sync
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('click')
                    }}
                >
                    <PanelTop size={16} className="mr-2" />
                    Open in AWS Console
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive hover:bg-destructive hover:text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('click')
                    }}
                >
                    <Trash2 size={16} className="mr-2" />
                    Delete in AWS Console
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default CardDropdown