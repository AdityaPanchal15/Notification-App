// PrivateRoute.tsx
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking auth...');
      const timeout = setTimeout(() => {
        console.warn('Auth check taking too long...');
      }, 3000);

      try {
        const auth = await window.electron.getAuth();
        clearTimeout(timeout);
        console.log('Auth result:', auth);
        setIsAuthed(!!auth?.accessToken);
      } catch (err) {
        console.error('Error checking auth:', err);
        setIsAuthed(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // or a spinner
  }

  return isAuthed ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
