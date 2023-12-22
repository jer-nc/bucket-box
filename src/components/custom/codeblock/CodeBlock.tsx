import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { writeText } from '@tauri-apps/api/clipboard';
import { Button } from '@/components/ui/button';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Props {
    data: string;
    language: string;
}

const CodeBlock = ({ data, language }: Props) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await writeText(data);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (err: unknown) {
            console.error('Failed to copy text: ', err);
            if (err instanceof Error) {
                toast({
                    title: 'Error',
                    description: err.message,
                    variant: 'destructive',
                })
            }
        }
    }

    return (
        <div className='relative'>
            <Button onClick={copyToClipboard} size='iconSm' variant='ghost' className='absolute top-2 right-2'>
                {isCopied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
            </Button>
            <SyntaxHighlighter className="rounded-md" language={language} style={vs2015}>
                {data}
            </SyntaxHighlighter>
        </div>
    )
}

export default CodeBlock
