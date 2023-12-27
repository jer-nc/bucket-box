import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Eye } from "lucide-react"
import SheetSkeleton from "../skeletons/SheetSkeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { File } from "@/lib/app"
import { toast } from "@/components/ui/use-toast"
import { getFileContent } from "@/cli-functions/getFileContent"
import CodeBlock from "../codeblock/CodeBlock"
import { useUserSessionStore } from "@/store/useSessionStore"
import { http } from '@tauri-apps/api';
import { codeExtensions } from "@/lib/code-extensions"
import { useQuery } from "@tanstack/react-query"

interface ObjectDetail {
    file: File;
    bucketName: string;
    folderPath: string;
}

const ObjectDetailSheet = ({ file, bucketName, folderPath }: ObjectDetail) => {
    const [content, setContent] = useState('')
    const [fileText, setFileText] = useState('')
    const { currentProfile } = useUserSessionStore();
    const isImageFile = /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file.name);
    const isCodeFile = codeExtensions.some(ext => file.name.endsWith(ext));


    const { data, isLoading, isError, error, isSuccess } = useQuery({
        queryKey: ['fileContentDetail', bucketName, folderPath, file.name, currentProfile],
        queryFn: () => getFileContent({ bucketName, folderPath, fileName: file.name, currentProfile }),
    });

    if (isError) {
        toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
            className: 'text-xs',
        })
    }


    useEffect(() => {
        if (isSuccess) {
            const fetchData = async () => {
                const response = await http.fetch(data!, {
                    method: 'GET',
                    body: http.Body.json({}),
                    responseType: http.ResponseType.Text,
                });
                const textCode = await response.data;
                setFileText(textCode as string);
            };

            if (isCodeFile) {
                fetchData();
            } else if (isImageFile) {
                setContent(data as string);
            }
        }
    }, [isSuccess, data, isCodeFile, isImageFile]);



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
                            isLoading ? (
                                <SheetSkeleton />
                            ) : (
                                <ScrollArea className="h-[75vh] pt-2">
                                    <div>
                                        <p className="font-semibold mb-4">
                                            Preview Content
                                        </p>
                                        {/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file.name) ? (
                                            /* Si la extensión es de una imagen */
                                            <div className="w-full flex justify-center object-contain ">
                                                <img className="rounded-md" src={content} alt={file.name} />
                                            </div>
                                        ) : codeExtensions.some(ext => file.name.endsWith(ext)) ? (
                                            /* Si la extensión coincide con una de lenguaje de programación */
                                            <CodeBlock data={fileText} language={file.name.split('.').pop()!} />
                                        ) :
                                            (
                                                fileText ? (
                                                    <p className="text-sm font-normal text-muted-foreground">
                                                        {fileText}
                                                    </p>
                                                ) :
                                                    (
                                                        <p className="text-sm font-normal text-muted-foreground">
                                                            No preview available
                                                        </p>
                                                    )
                                            )
                                        }
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

export default ObjectDetailSheet