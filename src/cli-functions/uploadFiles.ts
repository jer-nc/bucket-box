import { Command } from "@tauri-apps/api/shell";
import { FileOrDirectory } from "@/lib/app";

export async function uploadFiles({ bucketName, folderPath, profile, files }: { bucketName: string, folderPath?: string, profile: string, files: FileOrDirectory[] }) {
    const results = [];
    for (const file of files) {
        let command;
        
        const s3Path = folderPath ? `s3://${bucketName}/${folderPath}/${file.filename}` : `s3://${bucketName}/${file.filename}`;
        if (file.type === 'directory') {
            command = new Command('aws-cli', ['s3', 'sync', file.path, s3Path, '--profile', profile]);
        } else {
            command = new Command('aws-cli', ['s3', 'cp', file.path, s3Path, '--profile', profile]);
        }
        let errorOutput = '';

        // console.log(command)

        command.stderr.on('data', data => {
            errorOutput += data.toString();
        });
        try {
            const child = await command.execute();
            const str = child.stdout.toString();
            // console.log(str);
            // const strParse = JSON.parse(str);
            results.push(child);
        } catch (error) {
            throw new Error(`Command failed with error: ${errorOutput}`);
        }
    }
    return results;
}
