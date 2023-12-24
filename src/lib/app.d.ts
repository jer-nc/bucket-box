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

export interface BucketResponse {
    Location: string;
}

export interface BucketValues {
    bucketName: string;
    region: string;
    publicAccessBlock: {
        blockAll: boolean;
    };
}

export interface FolderResponse {
    ETag: string;
    ServerSideEncryption: string;
}