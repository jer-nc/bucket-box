import { Command } from '@tauri-apps/api/shell';

export async function uploadFilesFromDialog(localPath: string, bucketName: string, folderPath: string, profile: string, region: string, isFolder: boolean, updateLogCallback: (log: string) => void) {
    try {
        const fileNameFromPath = localPath.split('\\').pop()?.split('/').pop();
        
        const s3Path = folderPath ? `s3://${bucketName}/${folderPath}/${fileNameFromPath}` : `s3://${bucketName}/${fileNameFromPath}`;
        if (region === null) {
            region = 'us-east-1';
        }

        let syncCommand = ''

        if (isFolder) {
            syncCommand = 'sync'
        } else {
            syncCommand = 'cp'
        }


        const command = new Command('aws-cli', ["s3", syncCommand, localPath, s3Path, "--region", region, "--profile", profile]);

        let errorOutput = '';

        command.stderr.on('data', data => {
            errorOutput += data.toString();
        });

        command.stdout.on('data', data => {
            const message = data.toString();
          // console.log('Files Downloaded:', message);
            updateLogCallback(message);
        });

        const child = await command.execute();

        if (child.code !== 0) {
            throw new Error(`Command failed with code ${child.code}. Error: ${errorOutput}`);
        }

        const str = child.stdout.toString();


        return str;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    }
}
