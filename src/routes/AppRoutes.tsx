import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import FolderPage from '../pages/FolderPage';

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="carpeta/*" element={<FolderPage />} />
      </Routes>
  );
}

export default AppRoutes;