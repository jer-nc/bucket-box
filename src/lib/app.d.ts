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


export type FileOrDirectory = {
    filename: string;
    path: string;
    type: 'file' | 'directory' | 'unknown';

}


export interface FileDropEvent {
    event: string;
    windowLabel: string;
    payload: string[];
    id: number;
}

export interface UploadFilesProps {
    bucketName: string
    folderPath?: string
    profile: string
    currentPathname: string
}
