import { Braces, FileArchive, FileCode2, FileText, Image, PenTool, Sheet } from 'lucide-react';

const iconMap: { [key: string]: JSX.Element } = {
    html: <FileCode2 size={16} />,
    css: <FileCode2 size={16} />,
    js: <FileCode2 size={16} />,
    svg: <PenTool size={16} />,
    pdf: <FileText size={16} />,
    png: <Image size={16}  />,
    jpg: <Image size={16} />,
    jpeg: <Image size={16} />,
    gif: <Image size={16} />,
    ico: <Image size={16} />,
    webp: <Image size={16} />,
    avif: <Image size={16} />,
    bmp: <Image size={16} />,
    tiff: <Image size={16} />,
    csv: <Sheet size={16} />,
    json: <Braces size={16} />,
    txt: <FileText size={16} />,
    zip: <FileArchive size={16} />,
    rar: <FileArchive size={16} />,
    gz: <FileArchive size={16} />,
    tar: <FileArchive size={16} />,

};

export default iconMap;
