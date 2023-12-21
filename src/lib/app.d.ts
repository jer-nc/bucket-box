export interface File {
    name: string;
    lastModified?: string;
    size?: number;
    type: string;
}

export interface Bucket {
    Name: string;
    CreationDate?: string;
}
