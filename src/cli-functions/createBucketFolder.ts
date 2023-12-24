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
   let regionFn = ''
   
    const region = await getBucketRegion(bucketName, profile);

    if (region !== null) {
        regionFn = region;
    } else {
        regionFn = 'us-east-1';
    }

    const commandArgs = ["s3api", "put-object", "--bucket", bucketName, "--profile", profile, '--region', regionFn, '--output', 'json'];

    if (folderPath !== '') {
        commandArgs.push("--key", `${folderPath}/${folderName}/`);
    } else {
        commandArgs.push("--key", `${folderName}/`);
    }

    const command = new Command('aws-cli', commandArgs);
    
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