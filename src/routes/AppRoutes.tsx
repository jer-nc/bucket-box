import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import FolderPage from '../pages/FolderPage';
import BucketContentsLayout from '@/components/custom/layouts/BucketContentsLayout';
import SubFolderPage from '@/pages/SubFolderPage';
import CreateBucketPage from '@/pages/CreateBucketPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create-bucket" element={<CreateBucketPage />} />
      <Route path="/buckets/:bucketId" element={<BucketContentsLayout />}>
        <Route index element={<FolderPage />} />
        <Route path="*" element={<SubFolderPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;