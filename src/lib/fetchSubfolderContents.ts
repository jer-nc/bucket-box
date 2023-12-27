import { getBucketContents } from '@/cli-functions';

export const fetchSubfolderContents = async (bucketName: string, folderPath: string, profile: string, region: string) => {
    try {
        const response = await getBucketContents(bucketName, profile, region, folderPath);
        return response || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
};
