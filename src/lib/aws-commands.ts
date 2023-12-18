export const AWS_CLI_COMMANDS = (profile: string, bucket?: string, prefix?: string) => ({
    S3_LIST_BUCKETS_BY_NAME: ["s3api", "list-buckets", "--query", "Buckets[].Name", "--output", "json", "--profile", profile],
    S3_GET_BUCKET_CONTENTS: ["s3api", "list-objects-v2", '--bucket', `${bucket}`, "--prefix", `${prefix}`, "--output", "json", "--profile", profile],
    S3_GET_MAIN_BUCKET_CONTENTS: ["s3api", "list-objects-v2", '--bucket', bucket, "--output", "json", "--profile", profile],
    AWS_GET_PROFILE: ["configure", "list", "--profile", profile],
    AWS_LIST_PROFILES: ["configure", "list-profiles", "--output", "json"],
});