import UploadFiles from '@/components/custom/uploadFiles/UploadFiles';
import ListBucketSubfolderContents from '@/features/list-bucket-subfolder-contents/ListBucketSubfolderContents'
import { extractBucketAndFolder } from '@/lib/utils';
import { useUserSessionStore } from '@/store/useSessionStore';
import { useLocation } from 'react-router-dom';

const SubFolderPage = () => {
    const { pathname: currentPathname } = useLocation()
    const { currentProfile } = useUserSessionStore()
    const { folderPath, bucketName } = extractBucketAndFolder(currentPathname);
    return (
        <>
            <UploadFiles bucketName={bucketName} folderPath={folderPath} profile={currentProfile} currentPathname={currentPathname} />
            <ListBucketSubfolderContents  bucketName={bucketName} folderPath={folderPath} profile={currentProfile} currentPathname={currentPathname} />
        </>
    )
}

export default SubFolderPage