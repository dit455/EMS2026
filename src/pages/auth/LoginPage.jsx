import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components';
import {
  APP_ROUTES,
  DEMO_ADMIN_EMAIL,
  DEMO_OTP,
  DEMO_STUDENT_ACCOUNT,
  ENABLE_DEMO_ACCESS,
  OTP_LENGTH,
} from '../../config/appConfig';
import { institution } from '../../data/portalData';
import { authRoleOptions } from '../../data/referenceData';
import { authService } from '../../services/mockApi';

export default function LoginPage({ onLogin, mode = 'admin' }) {
  const navigate = useNavigate();
  const isStudent = mode === 'student';
  const [registrationNumber, setRegistrationNumber] = useState(ENABLE_DEMO_ACCESS ? DEMO_STUDENT_ACCOUNT.registrationNumber : '');
  const [studentOtp, setStudentOtp] = useState(ENABLE_DEMO_ACCESS ? DEMO_OTP : '');
  const [email, setEmail] = useState(ENABLE_DEMO_ACCESS ? DEMO_ADMIN_EMAIL : '');
  const [otp, setOtp] = useState(ENABLE_DEMO_ACCESS ? DEMO_OTP : '');
  const [role, setRole] = useState(authRoleOptions[0] || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    if (isStudent) {
      const result = await authService.loginStudentWithOtp({ registrationNumber, otp: studentOtp });
      setLoading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      onLogin(result.user);
      navigate(APP_ROUTES.student);
      return;
    }

    const result = await authService.loginWithOtp({ email, otp, role });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onLogin(result.user);
    navigate(APP_ROUTES.dashboard);
  };

  return (
    <div className="ems-login-page">
      <section className="ems-login-card">
        <div className="ems-login-brand">
          <img src="/images/govt_puducherry.png" alt="Government of Puducherry" />
          <div>
            <strong>
              {institution.nameLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </strong>
          </div>
        </div>
        <h1>{isStudent ? 'Student Login' : 'Secure Institution Portal Login'}</h1>
        <p>
          {isStudent
            ? 'Login with registration number and password or OTP to access student registration services.'
            : 'OTP based authentication for authorised college staff, board officials, and Super Admin users.'}
        </p>
        {ENABLE_DEMO_ACCESS && (
          <div className="ems-demo-box">
            <strong>Demo access</strong>
            <span>{isStudent ? `${DEMO_STUDENT_ACCOUNT.registrationNumber} / OTP ${DEMO_OTP}` : `${DEMO_ADMIN_EMAIL} / OTP ${DEMO_OTP}`}</span>
          </div>
        )}
        {error && <div className="ems-form-error ems-form-error--block">{error}</div>}
        <form className="ems-form" onSubmit={handleSubmit}>
          {isStudent ? (
            <>
              <label className="ems-form-field">
                <span>Registration Number *</span>
                <input value={registrationNumber} onChange={(event) => setRegistrationNumber(event.target.value)} required />
              </label>
              <label className="ems-form-field">
                <span>Password / OTP *</span>
                <input
                  type="password"
                  value={studentOtp}
                  onChange={(event) => setStudentOtp(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />
              </label>
            </>
          ) : (
            <>
              <label className="ems-form-field">
                <span>Email ID or Mobile Number *</span>
                <input value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label className="ems-form-field">
                <span>One Time Password *</span>
                <input
                  type="password"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />
              </label>
              <label className="ems-form-field">
                <span>Role Selection *</span>
                <select value={role} onChange={(event) => setRole(event.target.value)} required>
                  {authRoleOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            </>
          )}
          <button className="ems-btn ems-btn-primary ems-btn-full" type="submit" disabled={loading}>
            <Icon name="lock" size={16} /> {loading ? 'Verifying...' : isStudent ? 'Student Login' : 'Admin Login'}
          </button>
        </form>
      </section>
    </div>
  );
}
