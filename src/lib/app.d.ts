export interface File {
    name: string;
    lastModified?: string | null;
    size?: number | null;
    type: string;
}

export interface Bucket {
    Name: string;
    CreationDate?: string;
}

export interface MyFile {
    type: string;
    name: string;
    size: number | null;
    lastModified: string | null;
}