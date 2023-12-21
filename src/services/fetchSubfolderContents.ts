// bucketService.js
import { getBucketContents, getBucketRegion } from '@/cli-functions';

export const fetchSubfolderContents = async (bucketName: string, folderPath: string, profile: string) => {
    try {
        const bucketLocation = await getBucketRegion(bucketName, profile);
        const response = await getBucketContents(bucketName, profile, bucketLocation, folderPath);
        return response || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
};
