import { Command } from '@tauri-apps/api/shell';

export async function getBucketDetails(bucket: string, profile: string) {
    try {
        const locationCommand = new Command('aws-cli', ["s3api", "get-bucket-location", '--bucket', bucket, "--output", "json", "--profile", profile]);
        const locationChild = await locationCommand.execute();
        const location = JSON.parse(locationChild.stdout.toString()).LocationConstraint;

        const policyCommand = new Command('aws-cli', ["s3api", "get-bucket-policy", '--bucket', bucket, "--output", "json", "--profile", profile]);
        const policyChild = await policyCommand.execute();
        let policy;
        if (policyChild.stdout.length > 0) {
            policy = JSON.parse(policyChild.stdout).Policy;
        } else {
            policy = undefined;
        }

        const corsCommand = new Command('aws-cli', ["s3api", "get-bucket-cors", '--bucket', bucket, "--output", "json", "--profile", profile]);
        const corsChild = await corsCommand.execute();
        let corsRules;
        if (corsChild.stdout.length > 0) {
            corsRules = JSON.parse(corsChild.stdout.toString()).CORSRules;
        } else {
            corsRules = undefined;
        }

        
        const bucketArn = `arn:aws:s3:::${bucket}`;


        return {
            location,
            bucketArn,
            policy,
            corsRules
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    }
}
