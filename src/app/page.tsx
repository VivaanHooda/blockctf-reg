'use client';

import { useState, useEffect } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import ShapeGrid from '@/components/ShapeGrid';

export default function Home() {
  const [registrationsOpen, setRegistrationsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        console.log('Registration status fetched:', data);
        setRegistrationsOpen(data.registrationsOpen);
      } catch (error) {
        console.error('Failed to fetch registration status:', error);
        setRegistrationsOpen(true); // Default to open if fetch fails
      }
    };

    fetchStatus();
  }, []);

  if (registrationsOpen === null) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(5, 10, 21, 0.9) 0%, rgba(5, 15, 35, 0.9) 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(34, 197, 94, 0.2)',
            borderTop: '3px solid #22c55e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!registrationsOpen) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 1,
      }}>
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}>
          <ShapeGrid
            direction="down"
            speed={0.3}
            squareSize={30}
            borderColor="rgba(34, 197, 94, 0.08)"
            hoverFillColor="rgba(34, 197, 94, 0.2)"
            shape="square"
            hoverTrailAmount={5}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(14, 165, 233, 0.04) 0%, transparent 70%), linear-gradient(180deg, rgba(5, 10, 21, 0.3) 0%, rgba(5, 10, 21, 0.8) 100%)',
            pointerEvents: 'none',
          }} />
        </div>

        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          padding: '2rem',
        }}>
          <div style={{
            padding: '3rem 2rem',
            background: 'rgba(10, 20, 35, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '1rem',
            boxShadow: '0 10px 40px rgba(239, 68, 68, 0.1)',
            animation: 'fadeInUp 0.5s ease-out',
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1.5rem',
            }}>
              🔒
            </div>
            <h1 style={{
              fontSize: '2rem',
              marginBottom: '0.5rem',
              color: '#fff',
              fontFamily: "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}>
              Registrations Closed
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#e2e8f0',
              marginBottom: '1rem',
            }}>
              Thank you for your interest in Blockchain CTF!
            </p>
            <p style={{
              fontSize: '1rem',
              color: '#94a3b8',
              lineHeight: '1.6',
            }}>
              Registration window has ended. Please stay tuned for future events and announcements.
            </p>
            <div style={{
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(239, 68, 68, 0.2)',
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: '#94a3b8',
                marginBottom: '1rem',
              }}>
                For any queries, reach out to us:
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                alignItems: 'center',
                fontSize: '0.9rem',
              }}>
                <a href="https://wa.me/919845936029" target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', textDecoration: 'none' }}>
                  💬 Vivaan Hooda: 9845936029
                </a>
                <a href="https://wa.me/917204342252" target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', textDecoration: 'none' }}>
                  💬 Sathvic Sharma: 7204342252
                </a>
                <a href="https://wa.me/919742978916" target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', textDecoration: 'none' }}>
                  💬 Dia Arora: 9742978916
                </a>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  return <RegistrationForm />;
}
