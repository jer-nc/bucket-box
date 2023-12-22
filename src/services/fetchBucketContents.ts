import { getBucketContents } from '@/cli-functions';

export const fetchBucketContents = async (folderName: string, profile: string, region: string) => {
  try {
    const response = await getBucketContents(folderName, profile, region);
    return response || [];
  } catch (error) {
    console.error(error);
    throw error; 
  }
};
