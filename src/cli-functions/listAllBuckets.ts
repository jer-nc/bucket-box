import { Command } from '@tauri-apps/api/shell';
import { AWS_CLI_COMMANDS } from '@/lib/aws-commands';

export async function listAllBuckets(profile: string) {
    try {
        const command = new Command('aws-cli', AWS_CLI_COMMANDS(profile).S3_LIST_BUCKETS_BY_NAME);

        let errorOutput = '';

        command.stderr.on('data', data => {
            errorOutput += data.toString();
        });

        const child = await command.execute();

        console.log('child', child)

        if (child.code !== 0) {
            throw new Error(`Command failed with code ${child.code}. Error: ${errorOutput}`);
        }

        const str = child.stdout.toString();
        const strParse = JSON.parse(str);
        console.log('strParse', strParse)

        // if (!strParse.length) {
        //     throw new Error('No buckets found');
        // }

        return strParse;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    }
}