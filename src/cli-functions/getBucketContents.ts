import { Command } from '@tauri-apps/api/shell';

export async function getBucketContents(bucket: string, profile: string, region: string) {
    try {

        console.log('region', region);
        // Si la región es 'us-east-1', se usa el valor predeterminado
        if (region === null) {
            region = 'us-east-1';
        }

        console.log('region 2', region);

        const command = new Command('aws-cli', ["s3api", "list-objects-v2", '--bucket', bucket, "--region", region, "--output", "json", "--profile", profile]);

        console.log('command', command);
        let errorOutput = '';

        command.stderr.on('data', data => {
            errorOutput += data.toString();
        });

        const child = await command.execute();

        if (child.code !== 0) {
            throw new Error(`Command failed with code ${child.code}. Error: ${errorOutput}`);
        }
        console.log('child', child);

        const str = child.stdout.toString();
        console.log('str', str);
        const strParse = JSON.parse(str);

        console.log('strParse', strParse);
        if (!str.length) {
            throw new Error('No buckets found');
        }

        return strParse;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    }
}