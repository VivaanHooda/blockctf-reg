'use client';

import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { toast } from 'sonner';
import './AdminLogin.css';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (token: string) => void;
}

export default function AdminLogin({ isOpen, onClose, onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send credentials to server for validation
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('adminToken', token);
        toast.success('Admin login successful!');
        onLogin(token);
        setUsername('');
        setPassword('');
        onClose();
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        <div className="admin-login-header">
          <div className="admin-login-title">
            <Lock size={20} />
            <h2>Admin Login</h2>
          </div>
          <button className="admin-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isLoading}
              autoComplete="off"
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
              autoComplete="off"
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
