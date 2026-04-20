'use client';

import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';
import './admin-wrapper.css';

interface AdminWrapperProps {
  children: React.ReactNode;
}

export default function AdminWrapper({ children }: AdminWrapperProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleAdminLogin = (token: string) => {
    setIsAdminLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
  };

  if (!isMounted) return <>{children}</>;

  if (isAdminLoggedIn) {
    return <AdminPanel onLogout={handleAdminLogout} />;
  }

  return (
    <>
      {children}
      <button
        className="admin-access-button"
        onClick={() => setIsLoginOpen(true)}
        title="Admin Panel"
      >
        <Shield size={16} />
      </button>
      <AdminLogin isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleAdminLogin} />
    </>
  );
}
