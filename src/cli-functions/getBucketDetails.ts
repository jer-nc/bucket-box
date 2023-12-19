import { Command } from '@tauri-apps/api/shell';

export async function getBucketDetails(bucket: string, profile: string) {
    try {
        // Obtener la ubicación del bucket
        const locationCommand = new Command('aws-cli', ["s3api", "get-bucket-location", '--bucket', bucket, "--output", "json", "--profile", profile]);
        const locationChild = await locationCommand.execute();
        const location = JSON.parse(locationChild.stdout.toString()).LocationConstraint;

        // Obtener la política del bucket
        const policyCommand = new Command('aws-cli', ["s3api", "get-bucket-policy", '--bucket', bucket, "--output", "json", "--profile", profile]);
        const policyChild = await policyCommand.execute();
        let policy;
        if (policyChild.stdout.length > 0) {
            policy = JSON.parse(policyChild.stdout.toString()).Policy;
        } else {
            policy = 'No policy found';
        }
        // const policy = JSON.parse(policyChild.stdout.toString()).Policy;

        // Obtener las reglas CORS del bucket
        const corsCommand = new Command('aws-cli', ["s3api", "get-bucket-cors", '--bucket', bucket, "--output", "json", "--profile", profile]);
        const corsChild = await corsCommand.execute();
        let corsRules;
        if (corsChild.stdout.length > 0) {
            corsRules = JSON.parse(corsChild.stdout.toString()).CORSRules;
        } else {
            corsRules = undefined;
        }

        // El ARN del bucket se puede construir a partir del nombre del bucket
        const bucketArn = `arn:aws:s3:::${bucket}`;

        // AWS CLI no proporciona un comando para obtener el ID o el propietario del bucket directamente

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
