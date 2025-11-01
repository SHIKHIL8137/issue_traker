import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import Loader from '../components/ui/Loader.jsx';

export default function ProtectedRoute() {
  const { user, loading, checkAuth } = useAuth();
  const location = useLocation();
  const [authLoading, setAuthLoading] = useState(false);
  
  useEffect(() => {
    const verifyAuth = async () => {
      if (!user && !loading) {
        setAuthLoading(true);
        try {
          await checkAuth();
        } catch (error) {
        } finally {
          setAuthLoading(false);
        }
      }
    };
    
    verifyAuth();
  }, [user, loading, checkAuth]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
}