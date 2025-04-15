// PrivateRoute.tsx
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const status = await window.electron.getAuthStatus();
      setIsAuthed(status);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // or a spinner
  }

  return isAuthed ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
