import UploadFiles from "@/components/custom/uploadFiles/UploadFiles"
import ListBucketContents from "@/features/list-bucket-contents/ListBucketContents"
import { extractBucketAndFolder } from "@/lib/utils"
import { useUserSessionStore } from "@/store/useSessionStore"
import { useLocation } from "react-router-dom"

const FolderPage = () => {
  const { pathname: currentPathname } = useLocation()
  const { currentProfile } = useUserSessionStore()
  const { bucketName } = extractBucketAndFolder(currentPathname);

  return (
    <>
      <UploadFiles bucketName={bucketName} profile={currentProfile} currentPathname={currentPathname} />
      <ListBucketContents bucketName={bucketName} profile={currentProfile} />
    </>
  )
}

export default FolderPage