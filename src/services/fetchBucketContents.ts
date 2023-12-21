import { getBucketContents, getBucketRegion } from '@/cli-functions';

export const fetchBucketContents = async (folderName: string, profile: string) => {
  try {
    const bucketLocation = await getBucketRegion(folderName, profile);
    const response = await getBucketContents(folderName, profile, bucketLocation);
    return response || [];
  } catch (error) {
    console.error(error);
    throw error; 
  }
};
