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
