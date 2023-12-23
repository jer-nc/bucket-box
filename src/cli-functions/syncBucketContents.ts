import { Command } from '@tauri-apps/api/shell';

export async function syncBucketContents(localPath: string, bucketName: string, profile: string, region: string, isFolder: boolean, updateLogCallback: (log: string) => void) {
    try {

        // Si la región es 'us-east-1', se usa el valor predeterminado
        if (region === null) {
            region = 'us-east-1';
        }

        let syncCommand = ''

        if (isFolder) {
            syncCommand = 'sync'
        } else {
            syncCommand = 'cp'
        }


        const command = new Command('aws-cli', ["s3", syncCommand, `s3://${bucketName}`, localPath, "--region", region, "--profile", profile]);

        console.log('command', command);
        let errorOutput = '';

        command.stderr.on('data', data => {
            errorOutput += data.toString();
        });

        command.stdout.on('data', data => {
            // Esta línea se ejecutará cada vez que el comando escriba algo en su salida estándar
            console.log('Archivo descargado:', data.toString());
            const message = data.toString();
            console.log('Archivo descargado:', message);
            updateLogCallback(message); // Enviar el mensaje al callback
        });

        const child = await command.execute();

        if (child.code !== 0) {
            throw new Error(`Command failed with code ${child.code}. Error: ${errorOutput}`);
        }
        console.log('child', child);

        const str = child.stdout.toString();


        return str;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    }
}
