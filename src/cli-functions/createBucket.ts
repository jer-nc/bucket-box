import { Command } from "@tauri-apps/api/shell";

type CreateBucketParams = {
    bucketName: string,
    region: string,
    profile: string
}

interface BucketResponse {
    Location: string;
}


export async function createBucket({ bucketName, region, profile }: CreateBucketParams): Promise<BucketResponse> {
    const command = new Command('aws-cli', ["s3api", "create-bucket", "--bucket", bucketName, "--region", region, "--profile", profile, '--output', 'json']);
    let errorOutput = '';

    command.stderr.on('data', data => {
        errorOutput += data.toString();
    });

    try {
        const child = await command.execute();
        const str = child.stdout.toString();
        const strParse = JSON.parse(str);
        return strParse;
    } catch (error) {
        throw new Error(`Command failed with error: ${errorOutput}`);
    }
}
