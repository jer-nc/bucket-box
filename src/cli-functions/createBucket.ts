import { BucketResponse } from "@/lib/app";
import { Command } from "@tauri-apps/api/shell";

type CreateBucketParams = {
    bucketName: string,
    region: string,
    profile: string
}


export async function createBucket({ bucketName, region, profile }: CreateBucketParams): Promise<BucketResponse> {
    const command = new Command('aws-cli', ["s3api", "create-bucket", "--bucket", bucketName, "--region", region, "--profile", profile, '--output', 'json']);
    let errorOutput = '';

    command.stderr.on('data', data => {
        errorOutput += data.toString();
    });

    try {
        const childProcess = await command.execute();
        const stdoutString = childProcess.stdout.toString();
        const parsedStdout = JSON.parse(stdoutString);
        return parsedStdout;
    } catch (error) {
        throw new Error(`Command failed with error: ${errorOutput}`);
    }
}
