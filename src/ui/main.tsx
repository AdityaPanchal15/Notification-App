import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.tsx';
import IPCListener from './hooks/IPCListener.ts';
import Home from './pages/Home.tsx';
import Preferences from './pages/Preferences.tsx';
import Notifications from './pages/Notifications.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <IPCListener />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      <Route element={<PrivateRoute />}>
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
    </Routes>
  </HashRouter>
)
