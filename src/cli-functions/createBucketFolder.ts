import { Command } from "@tauri-apps/api/shell";
import { getBucketRegion } from ".";

type CreateBucketFolderParams = {
    bucketName: string,
    folderName: string,
    profile: string
    folderPath: string
}

type FolderResponse = {
    ETag: string;
    ServerSideEncryption: string;
}

export async function createBucketFolder({ bucketName, folderPath, folderName, profile }: CreateBucketFolderParams): Promise<FolderResponse> {
    const region = await getBucketRegion(bucketName, profile);
    const command = new Command('aws-cli', ["s3api", "put-object", "--bucket", bucketName, "--key", folderPath + '/' + folderName + '/', "--profile", profile, '--region', region, '--output', 'json']);
    let errorOutput = '';
    console.log('command', command);
    command.stderr.on('data', data => {
        errorOutput += data.toString();
    });

    try {
        const child = await command.execute();
        const str = child.stdout.toString();
        console.log('str', str);
        const strParse = JSON.parse(str);
        return strParse;
    } catch (error) {
        throw new Error(`Command failed with error: ${errorOutput}`);
    }
}