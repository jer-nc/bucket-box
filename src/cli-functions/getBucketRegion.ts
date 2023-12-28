import { Command } from '@tauri-apps/api/shell';

export async function getBucketRegion(bucket: string, profile: string) {
    try {
        const command = new Command('aws-cli', ["s3api", "get-bucket-location", '--bucket', bucket, "--output", "json", "--profile", profile]);

      // console.log('command', command);
        let errorOutput = '';

        command.stderr.on('data', data => {
            errorOutput += data.toString();
        });

        const child = await command.execute();

        if (child.code !== 0) {
            throw new Error(`Command failed with code ${child.code}. Error: ${errorOutput}`);
        }
      // console.log('child', child);

        const str = child.stdout.toString();
      // console.log('str', str);
        const strParse = JSON.parse(str);

      // console.log('strParse', strParse);
        if (!str.length) {
            throw new Error('No buckets found');
        }

        return strParse.LocationConstraint;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    }
}
