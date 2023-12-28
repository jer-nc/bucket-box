import { Command } from "@tauri-apps/api/shell";
import { getBucketRegion } from ".";

export async function deleteObject({ bucketName, folderPath, fileName, currentProfile, type }:
    { bucketName: string, folderPath: string, fileName: string, currentProfile: string, type: string }
) {
    let region = await getBucketRegion(bucketName, currentProfile);
    if (region === null) {
        region = 'us-east-1';
    }

    let command: Command | null = null;

    if (type === 'file') {
        if (!folderPath) {
            command = new Command('aws-cli', ['s3', 'rm', `s3://${bucketName}/${fileName}`, '--region', region]);
        } else {
            command = new Command('aws-cli', ['s3', 'rm', `s3://${bucketName}/${folderPath}/${fileName}`, '--region', region]);
        }
    } else if (type === 'folder') {
        if (!folderPath) {
            command = new Command('aws-cli', ['s3', 'rm', `s3://${bucketName}/${fileName}/`, '--recursive', '--region', region]);
        } else {
            command = new Command('aws-cli', ['s3', 'rm', `s3://${bucketName}/${folderPath}/${fileName}/`, '--recursive', '--region', region]);
        }
    } else {
        console.error("Tipo no válido. Debe ser 'file' o 'folder'.");
        return null;
    }

    console.log('Comando: ' + command)

    if (command) {
        console.log(command);
        try {
            const result = await command.execute();
            console.log(result);
            const resultString = result.stdout.toString();
            return resultString;
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                console.error(error.message);
            }
            return null;
        }
    } else {
        console.error("No se pudo crear el comando.");
        return null;
    }
}
