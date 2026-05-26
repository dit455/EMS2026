import React, { useState } from 'react';
import { loginUser, registerStudent } from './store';
import { BrandMark, Icon } from './components';
import { DEMO_OTP } from './config/appConfig';

const DEPARTMENTS = [
  'B.Sc. Nursing',
  'B. Pharm',
  'B.P.T (Physiotherapy)',
  'B.Sc. MLT (Medical Laboratory Technology)',
  'B.Sc. MRIT (Medical Radiography & Imaging Technology)',
  'GNM',
  'ANM',
  'DMLT',
  'PG Courses',
];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export function LoginPage({ role, onLogin, onBack, onRegisterSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cfg = {
    title: 'Student Sign In',
    hint: `student@mtpgrihs.ac.in / OTP ${DEMO_OTP}`,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = loginUser(email.trim(), password, role);
      if (user) onLogin(user);
      else setError('Invalid email or password. Please try again.');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="auth-page auth-page--signin">
      <div className="auth-card">
        <button onClick={onBack} className="auth-close-button" aria-label="Back to home">
          <Icon name="x" size={22} />
        </button>

        <div className="auth-logo">
          <BrandMark size="lg" />
          <h2>{cfg.title}</h2>
          <p>Access your registration, document review, and marksheet services.</p>
        </div>

        {cfg.hint && (
          <div className="auth-hint">
            <strong>Demo credentials</strong>
            <span>{cfg.hint}</span>
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email or Phone</label>
            <input id="login-email" type="text" inputMode="email" className="form-input"
              value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="password-field">
              <input id="login-password" type={showPass ? 'text' : 'password'} className="form-input"
                placeholder="Enter your password" value={password}
                onChange={e => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPass(p => !p)} className="password-toggle" aria-label="Toggle password visibility">
                <Icon name="eye" size={16} />
              </button>
            </div>
            <a href="mailto:support@mtpgrihs.ac.in?subject=Password%20reset%20request" className="auth-forgot-link">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <span className="animate-pulse">Signing in...</span> : 'LOGIN'}
          </button>

          <div className="auth-security-row" aria-label="Login security features">
            <span><Icon name="shield" size={13} /> Official portal</span>
            <span><Icon name="lock" size={13} /> Secure access</span>
          </div>

          <div className="auth-switch">
            Not a member?{' '}
            <button type="button" className="auth-link" onClick={onRegisterSwitch}>
              Signup now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function RegisterPage({ onRegister, onBack, onLoginSwitch }) {
  const [form, setForm] = useState({
    name: '', dob: '', email: '', mobile: '', studentId: '',
    fatherName: '', motherName: '',
    address: '', placeOfResidence: '', state: '', pinCode: '',
    department: '', year: '',
    password: '', confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // ── Validation ──
    if (!form.name.trim() || form.name.trim().length < 2)
      return setError('Please enter your full name (minimum 2 characters).');
    if (!form.dob) return setError('Date of Birth is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return setError('Please enter a valid email address.');
    if (!/^[0-9]{10}$/.test(form.mobile))
      return setError('Mobile number must be exactly 10 digits.');
    if (!form.studentId.trim())
      return setError('Student ID is required.');
    if (!form.fatherName.trim())
      return setError('Father\'s name is required.');
    if (!form.motherName.trim())
      return setError('Mother\'s name is required.');
    if (!form.address.trim())
      return setError('Address is required.');
    if (!form.placeOfResidence.trim())
      return setError('Place of Residence is required.');
    if (!form.state.trim())
      return setError('State is required.');
    if (!/^[0-9]{6}$/.test(form.pinCode))
      return setError('Pin Code must be exactly 6 digits.');
    if (!form.department) return setError('Department is required.');
    if (!form.year) return setError('Year is required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');

    setLoading(true);
    setTimeout(() => {
      const { user, error: err } = registerStudent({
        name: form.name.trim(),
        dob: form.dob,
        email: form.email.trim(),
        mobile: form.mobile,
        studentId: form.studentId.trim(),
        fatherName: form.fatherName.trim(),
        motherName: form.motherName.trim(),
        address: form.address.trim(),
        placeOfResidence: form.placeOfResidence.trim(),
        state: form.state.trim(),
        pinCode: form.pinCode,
        department: form.department,
        year: form.year,
        password: form.password,
      });
      if (err) { setError(err); setLoading(false); }
      else onRegister(user);
    }, 700);
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <button onClick={onBack} className="back-button">
          <Icon name="arrowLeft" size={16} /> Back to Home
        </button>

        <div className="auth-logo">
          <BrandMark size="lg" />
          <h2>Student Registration</h2>
          <p>Create your MTPGRIHS academic account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* ── Section: Personal Information ────────────────────── */}
          <div className="reg-section-label">
            <Icon name="user" size={15} />
            <span>Personal Information</span>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Name of Student *</label>
              <input id="reg-name" type="text" className="form-input" placeholder="Full name as per records"
                value={form.name} onChange={e => update('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-dob">Date of Birth *</label>
              <input id="reg-dob" type="date" className="form-input"
                value={form.dob} onChange={e => update('dob', e.target.value)}
                max={new Date().toISOString().split('T')[0]} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">E-Mail ID *</label>
              <input id="reg-email" type="text" inputMode="email" className="form-input" placeholder="your.email@example.com"
                value={form.email} onChange={e => update('email', e.target.value)} required autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-mobile">Mobile Number *</label>
              <input id="reg-mobile" type="tel" className="form-input" placeholder="10-digit mobile number"
                value={form.mobile} onChange={e => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                pattern="[0-9]{10}" maxLength={10} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-studentid">Student ID *</label>
            <input id="reg-studentid" type="text" className="form-input" placeholder="Enter your Student ID / Roll No."
              value={form.studentId} onChange={e => update('studentId', e.target.value)} required />
          </div>

          {/* ── Section: Family Details ──────────────────────────── */}
          <div className="reg-section-label">
            <Icon name="users" size={15} />
            <span>Family Details</span>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-father">Name of Father *</label>
              <input id="reg-father" type="text" className="form-input" placeholder="Father's full name"
                value={form.fatherName} onChange={e => update('fatherName', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-mother">Name of Mother *</label>
              <input id="reg-mother" type="text" className="form-input" placeholder="Mother's full name"
                value={form.motherName} onChange={e => update('motherName', e.target.value)} required />
            </div>
          </div>

          {/* ── Section: Address ─────────────────────────────────── */}
          <div className="reg-section-label">
            <Icon name="home" size={15} />
            <span>Address</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-address">Address *</label>
            <textarea id="reg-address" className="form-input" placeholder="Full door number, street, area"
              rows={2} style={{ resize: 'vertical' }}
              value={form.address} onChange={e => update('address', e.target.value)} required />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-place">Place of Residence *</label>
              <input id="reg-place" type="text" className="form-input" placeholder="City / Town / Village"
                value={form.placeOfResidence} onChange={e => update('placeOfResidence', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-state">State *</label>
              <select id="reg-state" className="form-input" value={form.state} onChange={e => update('state', e.target.value)} required>
                <option value="">Select state</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-pin">Pin Code *</label>
              <input id="reg-pin" type="text" inputMode="numeric" className="form-input" placeholder="6-digit pin"
                value={form.pinCode} onChange={e => update('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                pattern="[0-9]{6}" maxLength={6} required />
            </div>
          </div>

          {/* ── Section: Academic Details ────────────────────────── */}
          <div className="reg-section-label">
            <Icon name="book" size={15} />
            <span>Academic Details</span>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-dept">Department *</label>
              <select id="reg-dept" className="form-input" value={form.department} onChange={e => update('department', e.target.value)} required>
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-year">Year *</label>
              <select id="reg-year" className="form-input" value={form.year} onChange={e => update('year', e.target.value)} required>
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* ── Section: Security ────────────────────────────────── */}
          <div className="reg-section-label">
            <Icon name="shield" size={15} />
            <span>Set Password</span>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-pass">Password *</label>
              <input id="reg-pass" type="password" className="form-input" placeholder="Min 6 characters"
                value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password *</label>
              <input id="reg-confirm" type="password" className="form-input" placeholder="Re-enter password"
                value={form.confirm} onChange={e => update('confirm', e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <span className="animate-pulse">Registering...</span> : 'Create Account'}
          </button>
          <div className="auth-switch">
            <span className="text-sm text-muted">Already have an account? </span>
            <button type="button" className="auth-link" onClick={onLoginSwitch}>Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
}
