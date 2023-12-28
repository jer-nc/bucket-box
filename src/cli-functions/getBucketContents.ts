import { Command } from '@tauri-apps/api/shell';
import { getBucketRegion } from '.';

export async function getBucketContents(bucket: string, profile: string, region?: string, prefix?: string) {
    try {
        let regionFn: string;

        if (region) {
            regionFn = region;
        } else {
            regionFn = await getBucketRegion(bucket, profile) || 'us-east-1';
        }

        // if (regionFn === null) {
        //     regionFn = 'us-east-1';
        // }

        let bucketPath = 's3://' + bucket;

        if (prefix) {
            bucketPath += '/' + prefix + '/';
        }

        const command = new Command('aws-cli', ["s3", "ls", bucketPath, "--region", regionFn, "--output", "json", "--profile", profile]);

        let errorOutput = '';

        command.stderr.on('data', data => {
            errorOutput += data.toString();
        });

        const child = await command.execute();

        if (child.code !== 0) {
            throw new Error(`Command failed with code ${child.code}. Error: ${errorOutput}`);
        }

        const str = child.stdout.toString();
        const lines = str.trim().split('\n');
        const processedLines = lines.map(line => line.trim().split(/\s+/));

        const contents = processedLines.map((elements: string[]) => {

            if (elements.length === 2 && elements[0] === 'PRE') {
                return {
                    type: 'folder',
                    name: elements[1].slice(0, -1),
                    size: null,
                    lastModified: null,
                };
            } else if (elements.length >= 4) {
                const isFile = elements[0].match(/^\d{4}-\d{2}-\d{2}$/) !== null;
                const sizeIndex = isFile ? 2 : 3;
                const lastIndex = elements.length - 1;

                const name = elements.slice(sizeIndex + 1).join(' ');
                const size = isFile ? parseInt(elements[sizeIndex]) : null;

                const dateTimeInfo = elements.slice(0, lastIndex - (isFile ? 1 : 0));
                const lastModified = dateTimeInfo.join(' ');

                return {
                    type: isFile ? 'file' : 'folder',
                    name: isFile ? name : elements[lastIndex],
                    size,
                    lastModified: isFile ? lastModified : null,
                };
            } else {
                return null;
            }
        }).filter(Boolean);

        return contents;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    }
}