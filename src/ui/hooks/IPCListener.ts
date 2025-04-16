import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function IPCListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigation = (_event: any, path: string) => {
      setTimeout(() => navigate(path), 0);
    };

    window.electron.ipcRenderer.on('navigate-to', handleNavigation);

    return () => {
      window.electron.ipcRenderer.removeAllListeners('navigate-to');
    };
  }, [navigate]);

  return null;
}

export default IPCListener;