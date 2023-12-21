import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import FolderPage from '../pages/FolderPage';
import BucketContentsLayout from '@/components/custom/layouts/BucketContentsLayout';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="buckets/*" element={<FolderPage />} /> */}
      <Route path="/buckets/*" element={<BucketContentsLayout> <FolderPage /> </BucketContentsLayout>} />
    </Routes>
  );
}

export default AppRoutes;