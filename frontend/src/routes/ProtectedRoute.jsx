import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState } from 'react';

export default function ProtectedRoute() {
  const { user, loading, checkAuth } = useAuth();
  const location = useLocation();
  const [authLoading, setAuthLoading] = useState(false);
  
  useEffect(() => {
    const verifyAuth = async () => {
      // If we don't have user data and not already loading, check auth
      if (!user && !loading) {
        setAuthLoading(true);
        try {
          await checkAuth();
        } catch (error) {
          // Auth check failed, user will be redirected by the logic below
        } finally {
          setAuthLoading(false);
        }
      }
    };
    
    verifyAuth();
  }, [user, loading, checkAuth]);

  // Show loading while checking auth
  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If no user after auth check, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
}