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


export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts[parts.length - 1].toLowerCase();
};

const getPathSegments = (pathname: string) => {
  // Eliminar el primer '/' y luego dividir la cadena por '/'
  return pathname.substring(1).split('/');
};

export const getBucketName = (pathname: string) => {
  const segments = getPathSegments(pathname);
  if (segments.length >= 2) {
    // El bucketname sería el segundo segmento después de "buckets"
    return segments[1];
  } else {
    return null; // Manejar casos donde no haya suficientes segmentos en la ruta
  }
};
