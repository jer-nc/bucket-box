import * as z from "zod"


export const bucketSchema = z.object({
    bucketName: z.string().min(2).max(50),
    region: z.string().min(2).max(50),
    publicAccessBlock: z.object({
        blockAll: z.boolean(),
    }),
    versioning: z.boolean(),
})
