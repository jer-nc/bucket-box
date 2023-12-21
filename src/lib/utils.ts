import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const extractBucketAndFolder = (pathname: string) => {
  const pathSegments = pathname.split('/');
  const bucketName = pathSegments[2];
  const folderIndex = pathSegments.indexOf('buckets') + 2;
  const folderSegments = pathSegments.slice(folderIndex);
  const folderPath = folderSegments.join('/');
  return { bucketName, folderPath };
};
