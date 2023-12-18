export const AWS_CLI_COMMANDS = (profile: string) => ({
    S3_LIST_BUCKETS_BY_NAME: ["s3api", "list-buckets", "--query", "Buckets[].Name", "--output", "json", "--profile", profile],
    AWS_GET_PROFILE: ["configure", "list", "--profile", profile],
    AWS_LIST_PROFILES: ["configure", "list-profiles", "--output", "json"],
});