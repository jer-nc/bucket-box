import * as z from "zod"


export const folderBucketSchema = z.object({
  name: z.string(),
})
