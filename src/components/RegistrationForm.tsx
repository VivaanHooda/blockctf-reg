'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle2,
  Plus,
  Trash2,
  Users,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Zap,
  Shield,
  Trophy,
  Clock,
  IdCard,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  registrationSchema,
  type RegistrationFormData,
  YEAR_OPTIONS,
  BRANCH_OPTIONS,
} from '@/lib/validation';
import ShapeGrid from './ShapeGrid';
import Stepper, { Step } from './Stepper';
import Shuffle from './Shuffle';
import './RegistrationForm.css';

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    control,
    trigger,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur',
    defaultValues: {
      teamName: '',
      teamSize: '1',
      members: [
        { name: '', email: '', phone: '', year: '1st', branch: 'ISE', usn: '' },
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'members',
  });

  const teamSize = watch('teamSize');

  // Sync members array with team size
  useEffect(() => {
    const size = parseInt(teamSize);
    if (fields.length > size) {
      // Remove extra members
      const newFields = fields.slice(0, size);
      replace(newFields.map(f => ({
        name: f.name || '',
        email: f.email || '',
        phone: f.phone || '',
        year: f.year || '1st',
        branch: f.branch || 'ISE',
        usn: f.usn || '',
      })));
    }
  }, [teamSize, fields.length, replace]);

  const handleStepValidation = async (step: number) => {
    if (step === 1) {
      const isValid = await trigger(['teamName', 'teamSize']);
      if (!isValid) {
        toast.error('Please correctly fill out Team Info fields.');
        return false;
      }
      
      // Async database check to prevent duplicates
      const toastId = toast.loading('Checking team name availability...');
      try {
        const teamName = watch('teamName');
        const res = await fetch(`/api/check-team?name=${encodeURIComponent(teamName)}`);
        const data = await res.json();
        
        if (!data.available) {
          toast.error('That team name is already taken! Please choose another.', { id: toastId });
          return false;
        }
        toast.success('Team name available!', { id: toastId });
      } catch (error) {
        toast.error('Failed to verify team name.', { id: toastId });
        return false;
      }

      return true;
    }
    if (step === 2) {
      const isValid = await trigger('members');
      if (!isValid) toast.error('Please correct errors in the Members section.');
      return isValid;
    }
    return true;
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      setSubmitted(true);
      toast.success('🔗 Registered for BlockCTF! See you there!');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Registration failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className="spinner" />
          <div className="loading-text">
            <h3>Processing Your Registration</h3>
            <p>
              Sending confirmation emails
              <span className="loading-dots">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="registration-container">
        <div className="bg-grid-layer">
          <ShapeGrid
            direction="down"
            speed={0.3}
            squareSize={30}
            borderColor="rgba(34, 197, 94, 0.08)"
            hoverFillColor="rgba(34, 197, 94, 0.2)"
            shape="square"
            hoverTrailAmount={5}
          />
          <div className="bg-gradient-overlay" />
        </div>

        <div className="success-container" style={{ zIndex: 10, animation: 'fadeInUp 0.5s ease-out' }}>
          <div className="success-card" style={{ background: 'rgba(10, 20, 35, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(34, 197, 94, 0.3)', boxShadow: '0 10px 40px rgba(34, 197, 94, 0.1)', padding: '3rem 2rem', borderRadius: '1rem', textAlign: 'center' }}>
            <CheckCircle2 color="#22c55e" size={64} style={{ margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff', fontFamily: "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>Registration Complete!</h2>
            <p style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>Team <strong style={{ color: '#4ade80' }}>{watch('teamName')}</strong> has been registered for Blockchain CTF.</p>
            <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '2rem' }}>
              Check your email for event details and updates!
            </p>
            <a 
              href="https://chat.whatsapp.com/FF8AugYQwGfLFDhuM9Zupq" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                backgroundColor: '#25d366',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                fontFamily: "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#1fa857';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#25d366';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              Join WhatsApp Community
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      {/* Animated Background */}
      <div className="bg-grid-layer">
        <ShapeGrid
          direction="down"
          speed={0.3}
          squareSize={30}
          borderColor="rgba(34, 197, 94, 0.06)"
          hoverFillColor="rgba(34, 197, 94, 0.15)"
          shape="square"
          hoverTrailAmount={5}
        />
        <div className="bg-gradient-overlay" />
      </div>

      <div className="registration-content">
        <div className="form-header" style={{ marginBottom: "2rem" }}>
          <Image 
            src="/cclogo_v2.png" 
            alt="Coding Club Logo"  
            width={160} 
            height={160} 
            style={{ 
              margin: '0 auto 1.5rem auto', 
              display: 'block', 
              width: 'auto',
              height: 'auto',
              filter: 'drop-shadow(0 4px 20px rgba(34, 197, 94, 0.3))' 
            }} 
            priority
          />
          <Shuffle
            text="Blockchain CTF"
            shuffleDirection="up"
            duration={0.4}
            animationMode="random"
            shuffleTimes={3}
            stagger={0.05}
            triggerOnHover={true}
            tag="h1"
            onShuffleComplete={() => {}}
            colorFrom={undefined}
            colorTo={undefined}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stepper
            onStepChange={(step) => setCurrentStep(step)}
            onNextStepValidation={handleStepValidation}
            disableStepIndicators={true}
            onFinalStepCompleted={() => {
              if (!isSubmitting) {
                handleSubmit(onSubmit)();
              }
            }}
            backButtonText="Back"
            nextButtonText="Next →"
          >
            {/* ===== Step 1: Team Info ===== */}
            <Step>
              <h2>Team Details</h2>
              <p className="step-subtitle">
                Choose your team name and size to get started
              </p>
              <div className="form-fields">
                <div className="form-group">
                  <label>
                    <Users size={14} className="label-icon" />
                    Team Name
                  </label>
                  <input
                    {...register('teamName')}
                    type="text"
                    placeholder="Enter your team name"
                    className={errors.teamName ? 'error' : ''}
                    id="team-name-input"
                    autoComplete="off"
                  />
                  {errors.teamName && (
                    <span className="error-text">
                      {errors.teamName.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    <User size={14} className="label-icon" />
                    Team Size
                  </label>
                  <select
                    {...register('teamSize')}
                    className={errors.teamSize ? 'error' : ''}
                    id="team-size-select"
                  >
                    <option value="1">Solo (1 Member)</option>
                    <option value="2">Duo (2 Members)</option>
                  </select>
                  {errors.teamSize && (
                    <span className="error-text">
                      {errors.teamSize.message}
                    </span>
                  )}
                </div>
              </div>
            </Step>

            {/* ===== Step 2: Team Members ===== */}
            <Step>
              <h2>Team Members</h2>
              <p className="step-subtitle">
                Fill in details for{' '}
                {teamSize === '1' ? 'your member' : 'each team member'}
              </p>
              <div className="form-fields">
                {fields.map((field, index) => (
                  <div key={field.id} className="member-card">
                    <div className="member-header">
                      <h3>
                        <span className="member-badge">{index + 1}</span>
                        Member {index + 1}
                      </h3>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="remove-btn"
                          aria-label="Remove member"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="member-fields">
                      <div className="form-group">
                        <label>
                          <User size={14} className="label-icon" />
                          Full Name
                        </label>
                        <input
                          {...register(`members.${index}.name`)}
                          type="text"
                          placeholder="Enter full name"
                          className={
                            errors.members?.[index]?.name ? 'error' : ''
                          }
                          id={`member-${index}-name`}
                          autoComplete="off"
                        />
                        {errors.members?.[index]?.name && (
                          <span className="error-text">
                            {errors.members[index]?.name?.message}
                          </span>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>
                            <Phone size={14} className="label-icon" />
                            Mobile Number
                          </label>
                          <input
                            {...register(`members.${index}.phone`)}
                            type="tel"
                            placeholder="10-digit number"
                            className={
                              errors.members?.[index]?.phone ? 'error' : ''
                            }
                            id={`member-${index}-phone`}
                            autoComplete="off"
                          />
                          {errors.members?.[index]?.phone && (
                            <span className="error-text">
                              {errors.members[index]?.phone?.message}
                            </span>
                          )}
                        </div>

                        <div className="form-group">
                          <label>
                            <Mail size={14} className="label-icon" />
                            Email
                          </label>
                          <input
                            {...register(`members.${index}.email`)}
                            type="email"
                            placeholder="Email address"
                            className={
                              errors.members?.[index]?.email ? 'error' : ''
                            }
                            id={`member-${index}-email`}
                            autoComplete="off"
                          />
                          {errors.members?.[index]?.email && (
                            <span className="error-text">
                              {errors.members[index]?.email?.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>
                            <GraduationCap size={14} className="label-icon" />
                            Year
                          </label>
                          <select
                            {...register(`members.${index}.year`)}
                            className={
                              errors.members?.[index]?.year ? 'error' : ''
                            }
                            id={`member-${index}-year`}
                          >
                            {YEAR_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {errors.members?.[index]?.year && (
                            <span className="error-text">
                              {errors.members[index]?.year?.message}
                            </span>
                          )}
                        </div>

                        <div className="form-group">
                          <label>
                            <BookOpen size={14} className="label-icon" />
                            Branch
                          </label>
                          <select
                            {...register(`members.${index}.branch`)}
                            className={
                              errors.members?.[index]?.branch ? 'error' : ''
                            }
                            id={`member-${index}-branch`}
                          >
                            {BRANCH_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {errors.members?.[index]?.branch && (
                            <span className="error-text">
                              {errors.members[index]?.branch?.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label>
                          <IdCard size={14} className="label-icon" />
                          University Seat Number (USN)
                        </label>
                        <input
                          {...register(`members.${index}.usn`)}
                          type="text"
                          placeholder="e.g. 1RV24IS152"
                          className={
                            errors.members?.[index]?.usn ? 'error' : ''
                          }
                          id={`member-${index}-usn`}
                          autoComplete="off"
                          style={{ textTransform: 'uppercase' }}
                        />
                        {errors.members?.[index]?.usn && (
                          <span className="error-text">
                            {errors.members[index]?.usn?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Member Button */}
                {fields.length < parseInt(teamSize) && (
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        name: '',
                        email: '',
                        phone: '',
                        year: '1st',
                        branch: 'ISE',
                        usn: '',
                      })
                    }
                    className="add-member-btn"
                  >
                    <Plus size={16} />
                    Add Team Member
                  </button>
                )}
              </div>
            </Step>

            {/* ===== Step 3: Confirmation ===== */}
            <Step>
              <h2>Ready to Go!</h2>
              <p className="step-subtitle">
                Review and submit your registration
              </p>
              <div className="confirmation-content">
                <div className="confirmation-box" style={{ background: 'rgba(15, 25, 50, 0.5)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: 'var(--radius-md)', padding: '2rem', animation: 'fadeInUp 0.35s ease-out', fontFamily: "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontFamily: "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                      Team Name
                    </p>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--green-400)', wordBreak: 'break-word', fontFamily: "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                      {watch('teamName') || 'Your Team'}
                    </h3>
                  </div>
                  
                  <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontFamily: "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                      Team Members ({fields.length})
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {fields.map((field, index) => (
                        <div key={field.id} style={{ padding: '0.875rem', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.15)', borderRadius: 'var(--radius-sm)', fontFamily: "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                          <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500', fontFamily: "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                            {watch(`members.${index}.name`) || `Member ${index + 1}`}
                          </p>
                          {watch(`members.${index}.email`) && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem', fontFamily: "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                              {watch(`members.${index}.email`)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Step>
          </Stepper>
        </form>

        <div className="contact-card" style={{ 
          marginTop: '2.5rem', 
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          maxWidth: '640px',
          padding: '1.5rem', 
          background: 'rgba(15, 25, 50, 0.4)', 
          backdropFilter: 'blur(12px)', 
          border: '1px solid rgba(148, 163, 184, 0.1)', 
          borderRadius: '1rem', 
          textAlign: 'center',
          fontFamily: "'Ubuntu Mono', monospace"
        }}>
          <h3 style={{ color: '#f1f5f9', fontSize: '1.05rem', marginBottom: '1rem', fontWeight: 600, letterSpacing: '0.02em', textAlign: 'left' }}>
            Contact for queries
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start', color: '#94a3b8', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', justifyContent: 'flex-start' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#25D366" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              <span>Vivaan Hooda: <a href="https://wa.me/919845936029" target="_blank" rel="noopener noreferrer" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 500 }}>9845936029</a></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', justifyContent: 'flex-start' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#25D366" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              <span>Sathvic Sharma: <a href="https://wa.me/917204342252" target="_blank" rel="noopener noreferrer" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 500 }}>7204342252</a></span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
