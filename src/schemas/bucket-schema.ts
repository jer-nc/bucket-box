import * as z from "zod"

const TagSchema = z.object({
    key: z.string(),
    value: z.string(),
})

export const bucketSchema = z.object({
    bucketName: z.string().min(2).max(50),
    region: z.string().min(2).max(50),
    // region: z.enum(["us-east-1", "us-east-2", "us-west-1", "us-west-2", "ap-south-1", "ap-northeast-1", "ap-northeast-2", "ap-southeast-1", "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3", "eu-north-1", "sa-east-1"]),
    copySettingsFromBucket: z.string().optional(),
    objectOwnership: z.object({
        control: z.enum(["DISABLE_ACL", "ENABLE_ACL"]),
        aclOptions: z.object({
            acl: z.boolean().optional(),
            otherAccount: z.string().optional(),
        }).optional(),
    }),
    publicAccessBlock: z.object({
        blockAll: z.boolean(),
        blockSettings: z.object({
            blockAcls: z.boolean(),
            blockPublicPolicy: z.boolean(),
            ignorePublicAcls: z.boolean(),
            restrictPublicBuckets: z.boolean(),
        }),
    }),
    versioning: z.boolean(),
    tags: z.array(TagSchema).optional(),
    defaultEncryption: z.object({
        encryptionType: z.enum(["S3_MANAGED", "KMS"]),
        kmsKey: z.string().optional(),
    }),
    objectLock: z.object({
        enable: z.boolean(),
        retainUntilDate: z.string().optional(),
        retainForDays: z.number().optional(),
    }).optional(),
})
