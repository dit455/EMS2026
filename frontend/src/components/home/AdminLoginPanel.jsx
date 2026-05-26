import React, { useEffect, useState } from 'react';
import { CircleHelp, GraduationCap, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import {
  DEMO_ADMIN_EMAIL,
  DEMO_OTP,
  DEMO_STUDENT_ACCOUNT,
  ENABLE_DEMO_ACCESS,
  OTP_LENGTH,
} from '../../config/appConfig';
import { authQuickLogins, authRoleOptions } from '../../data/referenceData';
import { authService } from '../../services/mockApi';

export default function AdminLoginPanel({ activeMode = 'student', onModeChange, onLogin, onStudentLogin, onRegister, onHelpdesk }) {
  const [mode, setMode] = useState(activeMode);
  const [registrationNumber, setRegistrationNumber] = useState(ENABLE_DEMO_ACCESS ? DEMO_STUDENT_ACCOUNT.registrationNumber : '');
  const [studentOtp, setStudentOtp] = useState(ENABLE_DEMO_ACCESS ? DEMO_OTP : '');
  const [identifier, setIdentifier] = useState(ENABLE_DEMO_ACCESS ? DEMO_ADMIN_EMAIL : '');
  const [otp, setOtp] = useState(ENABLE_DEMO_ACCESS ? DEMO_OTP : '');
  const [role, setRole] = useState(authRoleOptions[0] || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(activeMode);
  }, [activeMode]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    onModeChange?.(nextMode);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const result = await authService.loginWithOtp({ email: identifier, otp, role });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onLogin(result.user);
  };

  const submitStudent = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const result = await authService.loginStudentWithOtp({ registrationNumber, otp: studentOtp });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onStudentLogin(result.user);
  };

  return (
    <section className="portal-content-shell py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start select-none" id="student-login">
      {/* Intro info panel */}
      <div className="lg:col-span-5 flex flex-col justify-center text-left">
        <span className="text-teal-600 text-xs font-black uppercase tracking-wider block">Secure Portal Access</span>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-blue-950 mt-1 mb-4">
          {mode === 'student' ? 'Student Portal Login' : 'Official Portal Login'}
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
          {mode === 'student'
            ? 'Students can sign in using their unique Registration Number and password or OTP code to track application stages, print forms, and review schedules.'
            : 'Authorized institutional makers, checkers, and administrative officials can access internal governance controls via secure email/mobile OTP verification.'}
        </p>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-80 mb-6 border border-slate-200" role="tablist" aria-label="Login type">
          <button 
            type="button" 
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'student' 
                ? 'bg-white text-blue-950 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`} 
            onClick={() => switchMode('student')}
          >
            <GraduationCap size={15} /> Student
          </button>
          <button 
            type="button" 
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'admin' 
                ? 'bg-white text-blue-950 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`} 
            onClick={() => switchMode('admin')}
          >
            <ShieldCheck size={15} /> Admin
          </button>
        </div>

        {/* Admin Quick Login Shortcut buttons */}
        {mode === 'admin' && ENABLE_DEMO_ACCESS && (
          <div className="flex flex-col gap-2">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block mb-1">
              Demo Credentials Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-2">
              {authQuickLogins.map(({ label, role: nextRole, email }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setRole(nextRole);
                    setIdentifier(email);
                    setOtp(DEMO_OTP);
                  }}
                  className="bg-slate-50 border border-slate-200 hover:border-blue-500/50 hover:bg-blue-50/20 text-slate-700 hover:text-blue-950 px-3 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <ShieldCheck size={12} className="text-teal-500" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Card Grid */}
      <div className="lg:col-span-7 w-full flex justify-center">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {mode === 'student' && (
            <form className="flex flex-col gap-4" onSubmit={submitStudent}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-2">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-700 shrink-0">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <strong className="text-slate-900 text-base font-black block">Student Login</strong>
                  <span className="text-slate-400 text-xs font-semibold block mt-0.5">Access your active registration profile</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Registration Number</span>
                <input 
                  value={registrationNumber} 
                  onChange={(event) => setRegistrationNumber(event.target.value)} 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all shadow-inner font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Password / OTP</span>
                <input 
                  type="password"
                  value={studentOtp} 
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  onChange={(event) => setStudentOtp(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))} 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all shadow-inner font-semibold"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-800 hover:bg-blue-900 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <KeyRound size={14} /> {loading ? 'Verifying Access...' : 'Student Login'}
              </button>

              <button 
                type="button" 
                className="text-slate-500 hover:text-blue-900 text-xs font-bold py-1 transition-all cursor-pointer block text-center" 
                onClick={onRegister}
              >
                <span className="text-teal-600 font-extrabold mr-1">+</span> Create New Student Registration
              </button>

              <p className="text-[10px] text-slate-400 text-center leading-normal border-t border-slate-100 pt-3">
                Note: Standard credential tracking is linked to Puducherry medical verification databases. Do not share credentials.
              </p>
            </form>
          )}

          {mode === 'admin' && (
            <form className="flex flex-col gap-4" id="admin-login" onSubmit={submit}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-2">
                <div className="p-3 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <strong className="text-slate-900 text-base font-black block">Official Access</strong>
                  <span className="text-slate-400 text-xs font-semibold block mt-0.5">Use OTP-based administrative sign-in</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Official Mobile / Email</span>
                <input 
                  value={identifier} 
                  onChange={(event) => setIdentifier(event.target.value)} 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all shadow-inner font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">OTP Code</span>
                <input 
                  value={otp} 
                  type="password"
                  inputMode="numeric" 
                  autoComplete="one-time-code"
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))} 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all shadow-inner font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Staff Role</span>
                <select 
                  value={role} 
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all shadow-inner font-bold"
                >
                  {authRoleOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-800 hover:bg-blue-900 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <ShieldCheck size={14} /> {loading ? 'Authorizing Access...' : 'Admin Login'}
              </button>

              <button 
                type="button" 
                className="text-slate-500 hover:text-blue-900 text-xs font-bold py-1 transition-all cursor-pointer block text-center" 
                onClick={onHelpdesk}
              >
                <CircleHelp size={14} className="inline mr-1" /> Forgot admin access credentials?
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
