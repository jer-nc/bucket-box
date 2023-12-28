import { Command } from "@tauri-apps/api/shell";
import { getBucketRegion } from ".";

interface GeneratePresignedUrlProps {
    bucketName: string;
    folderPath?: string;
    fileName: string;
    currentProfile: string;
    expiration: string;
}

export async function generatePresignedUrl({ bucketName, folderPath, fileName, currentProfile, expiration }: GeneratePresignedUrlProps) {

    try {
        let region = await getBucketRegion(bucketName, currentProfile);
        if (region === null) {
            region = 'us-east-1';
        }

        let command: Command | null = null;

        if (!folderPath) {
            command = new Command('aws-cli', ['s3', 'presign', `s3://${bucketName}/${fileName}`, '--expires-in', expiration, '--region', region]);
        } else {
            command = new Command('aws-cli', ['s3', 'presign', `s3://${bucketName}/${folderPath}/${fileName}`, '--expires-in', expiration, '--region', region]);
        }

        const result = await command.execute();
        const resultString = result.stdout.toString();

        return resultString;

    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}