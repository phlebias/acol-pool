import AdminPage from './components/AdminPage';
import { Navigate } from 'react-router-dom';

// Only export admin routes if not in production
const adminRoutes = process.env.NODE_ENV !== 'production' ? [
  { path: '/login', element: <AdminPage /> },
  { path: '/admin', element: <AdminPage /> }
] : [
  { path: '/login', element: <Navigate to="/main" replace /> },
  { path: '/admin', element: <Navigate to="/main" replace /> }
];

export default adminRoutes;