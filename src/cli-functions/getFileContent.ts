import { Command } from '@tauri-apps/api/shell';
import { getBucketRegion } from '.';

// get presignet url for contents of file with aws cli v2 command
export async function getFileContent({ bucketName, folderPath, fileName, currentProfile }: { bucketName: string, folderPath: string, fileName: string, currentProfile: string }) {

    let region = await getBucketRegion(bucketName, currentProfile);
    if (region === null) {
        region = 'us-east-1';
    } 
    let command;
    if (!folderPath) {
        command = new Command('aws-cli', ['s3', 'presign', `s3://${bucketName}/${fileName}`, '--region', region]);
    } else {
        command = new Command('aws-cli', ['s3', 'presign', `s3://${bucketName}/${folderPath}/${fileName}`, '--region', region]);
    }

  // console.log(command)
    try {
        const result = await command.execute();
      // console.log(result);
        const resultString = result.stdout.toString();
        return resultString
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            console.error(error.message);
        }
        return null;
    }


}