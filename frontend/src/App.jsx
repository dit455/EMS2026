import React, { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { STORAGE_KEYS } from './config/appConfig';

function readSavedSession() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEYS.session);
    return saved ? JSON.parse(saved) : null;
  } catch {
    sessionStorage.removeItem(STORAGE_KEYS.session);
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(() => readSavedSession());

  useEffect(() => {
    setUser(readSavedSession());
  }, []);

  const handleLogin = (nextUser) => {
    sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEYS.session);
    setUser(null);
  };

  return <AppRoutes user={user} onLogin={handleLogin} onLogout={handleLogout} />;
}
