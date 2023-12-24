import * as z from "zod"


export const folderBucketSchema = z.object({
    name: z.string().refine(name => !name.includes('/') && !name.includes('\\'), {
        message: "Folder name cannot contain '/' or '\\'",
      }),
})
