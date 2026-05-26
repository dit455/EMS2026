import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  BadgeCheck,
  ShieldAlert,
  Loader2,
  PenLine,
  BookOpenCheck,
  FileSpreadsheet,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';
import { STORAGE_KEYS } from '../../config/appConfig';
import { downloadTextFile } from '../../utils/actions';

const steps = [
  { label: 'Registration', desc: 'Profile created', icon: PenLine },
  { label: 'Education', desc: 'Qualifications added', icon: BookOpenCheck },
  { label: 'Documents', desc: 'Proofs uploaded', icon: FileSpreadsheet },
  { label: 'Verification', desc: 'Checker reviewed', icon: ShieldCheck },
  { label: 'Approval', desc: 'Approver approved', icon: UserRoundCheck },
  { label: 'Active', desc: 'Number generated', icon: BadgeCheck },
];

const demoApplications = {
  'MTPG-REG-2026-DRAFT': {
    id: 'MTPG-REG-2026-DRAFT',
    studentName: 'Aravind Swamy',
    courseName: 'B.Sc. Nursing',
    currentStep: 1, // Registration done, currently on Education details
    statusText: 'Draft Registration',
    lastUpdated: 'May 20, 2026 - 10:15 AM',
    nextAction: 'Please complete your Education Details and upload required documents.',
    alertType: 'warning',
  },
  'MTPG-REG-2026-SUBMIT': {
    id: 'MTPG-REG-2026-SUBMIT',
    studentName: 'Priyanjali Sen',
    courseName: 'Bachelor of Pharmacy (B.Pharm)',
    currentStep: 3, // Documents uploaded, pending Checker
    statusText: 'Submitted - Pending Verification',
    lastUpdated: 'May 19, 2026 - 02:30 PM',
    nextAction: 'Your application is in queue for Verification by the College/Board Checker.',
    alertType: 'info',
  },
  'MTPG-REG-2026-VERIFY': {
    id: 'MTPG-REG-2026-VERIFY',
    studentName: 'Mohamed Rafiq',
    courseName: 'M.Sc. Medical Physics',
    currentStep: 4, // Verification done, pending Approver
    statusText: 'Verified - Pending Approver Signature',
    lastUpdated: 'May 21, 2026 - 09:00 AM',
    nextAction: 'Approved by Board Checker. Awaiting final digital signature from Board Approver.',
    alertType: 'info',
  },
  'MTPG-REG-2026-APPROVE': {
    id: 'MTPG-REG-2026-APPROVE',
    studentName: 'Subhashree Balakrishnan',
    courseName: 'B.Sc. MLT (Medical Lab Technology)',
    currentStep: 6, // Approved and Registration Number Generated
    statusText: 'Approved & Registered',
    lastUpdated: 'May 21, 2026 - 11:45 AM',
    nextAction: 'Registration complete. Your Registration Number is MTPG-STU-2026-042.',
    regNumber: 'MTPG-STU-2026-042',
    certificateAvailable: true,
    alertType: 'success',
  },
};

export default function StudentStatusTracker() {
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (idToSearch) => {
    const query = (idToSearch || searchId).trim().toUpperCase();
    if (!query) {
      setErrorMsg('Please enter a valid Application ID or Reference Number.');
      setResult(null);
      return;
    }

    setErrorMsg('');
    setLoading(true);

    // Simulate 800ms database lookup latency
    setTimeout(() => {
      setLoading(false);
      
      // 1. Check demo applications
      if (demoApplications[query]) {
        setResult(demoApplications[query]);
        return;
      }

      // 2. Check localStorage for user-submitted registration
      const savedStatus = localStorage.getItem(STORAGE_KEYS.studentStatus);
      if (savedStatus) {
        try {
          const parsed = JSON.parse(savedStatus);
          if (parsed.referenceNumber && parsed.referenceNumber.trim().toUpperCase() === query) {
            setResult({
              id: parsed.referenceNumber,
              studentName: parsed.applicantName || 'Student Applicant',
              courseName: 'Health Sciences Stream',
              currentStep: parsed.status === 'Submitted' ? 3 : 1,
              statusText: parsed.status === 'Submitted' ? 'Submitted - Pending Verification' : parsed.status,
              lastUpdated: parsed.submittedAt ? new Date(parsed.submittedAt).toLocaleString() : 'Just now',
              nextAction: parsed.nextStep || 'Awaiting status update.',
              alertType: parsed.status === 'Submitted' ? 'info' : 'warning',
            });
            return;
          }
        } catch {
          localStorage.removeItem(STORAGE_KEYS.studentStatus);
        }
      }

      // 3. Not found
      setErrorMsg(`No records found for ID "${query}". Ensure it is correct or select a demo ID below.`);
      setResult(null);
    }, 800);
  };

  const handleDemoClick = (demoKey) => {
    setSearchId(demoKey);
    handleSearch(demoKey);
  };

  return (
    <section className="portal-content-shell py-8 select-none" id="student-verification-tracker">
      {/* Title block */}
      <div className="border-l-4 border-teal-500 pl-4 mb-5">
        <span className="text-teal-600 text-xs font-black uppercase tracking-wider block">Application Status</span>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-blue-950 mt-1">Student Verification & Tracking</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl font-medium">
          Verify registration progress in real-time. Enter your Application Reference ID to trace progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left column: Search Input & Demo Quick Links */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-5 shadow-md shadow-slate-200/60 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="ref-id-input" className="text-xs font-black uppercase tracking-wider text-slate-500">
              Application Reference ID
            </label>
            <div className="relative flex items-center">
              <input
                id="ref-id-input"
                type="text"
                placeholder="e.g. MTPG-REG-2026-SUBMIT"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading}
                className="absolute right-2 p-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                aria-label="Track Status Button"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              </button>
            </div>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs text-red-600 font-bold mt-1"
              >
                <ShieldAlert size={14} className="shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </div>

          {/* Demo shortcuts */}
            <div className="border-t border-slate-100 pt-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-3">
              Click a Demo ID to test different tracking stages:
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.keys(demoApplications).map((key) => {
                let badgeColor = 'bg-slate-50 border-slate-200 text-slate-600';
                if (key.includes('DRAFT')) badgeColor = 'bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100/50';
                if (key.includes('SUBMIT')) badgeColor = 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100/50';
                if (key.includes('VERIFY')) badgeColor = 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100/50';
                if (key.includes('APPROVE')) badgeColor = 'bg-teal-50 border-teal-100 text-teal-700 hover:bg-teal-100/50';

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleDemoClick(key)}
                    className={`border px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold tracking-wider transition-all uppercase cursor-pointer active:scale-95 shadow-sm hover:-translate-y-0.5 ${badgeColor}`}
                  >
                    {key.replace('MTPG-REG-2026-', '')} State
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Results & Interactive Timeline with Animation */}
        <div className="lg:col-span-7 min-h-[280px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* 1. Loading Skeleton state */}
            {loading && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-md shadow-slate-200/60 w-full animate-pulse flex flex-col gap-4"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div className="flex flex-col gap-2 w-2/3">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-24" />
                </div>
                {/* Horizontal flow line skeleton */}
                <div className="flex justify-between items-center px-4 py-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 relative">
                      <div className="w-8 h-8 bg-slate-200 rounded-full" />
                      <div className="h-3 bg-slate-200 rounded w-2/3" />
                      {i < 6 && <div className="absolute top-4 left-1/2 w-full h-0.5 bg-slate-200 z-0" />}
                    </div>
                  ))}
                </div>
                <div className="h-10 bg-slate-200 rounded w-full mt-2" />
              </motion.div>
            )}

            {/* 2. Success Status Result state */}
            {!loading && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-md shadow-slate-200/60 w-full flex flex-col gap-4"
              >
                {/* Header Information block */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-display font-black text-blue-950 text-lg flex items-center gap-2">
                      <span>{result.studentName}</span>
                      <span className="text-xs text-slate-400 font-bold font-sans">({result.id})</span>
                    </h3>
                    <p className="text-slate-500 text-xs font-semibold mt-1">
                      Applied Course: <strong className="text-slate-700">{result.courseName}</strong> | Last Updated: {result.lastUpdated}
                    </p>
                  </div>
                  
                  {/* Status chip */}
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${
                    result.alertType === 'success' ? 'bg-teal-50 border-teal-200 text-teal-700' :
                    result.alertType === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                    {result.statusText}
                  </span>
                </div>

                {/* Vertical / Responsive Interactive Progress Timeline */}
                <div className="relative py-3 flex flex-col gap-4">
                  {/* Vertical bar on the left */}
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 z-0" />
                  
                  {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < result.currentStep || (result.currentStep === 6);
                    const isActive = stepNumber === result.currentStep && result.currentStep !== 6;
                    const isPending = stepNumber > result.currentStep && result.currentStep !== 6;
                    
                    const StepIcon = step.icon;

                    let circleStyle = 'bg-slate-50 text-slate-400 border-slate-200';
                    let textStyle = 'text-slate-400';
                    if (isCompleted) {
                      circleStyle = 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/10';
                      textStyle = 'text-slate-800';
                    } else if (isActive) {
                      circleStyle = 'bg-blue-800 text-white border-blue-800 ring-4 ring-blue-100 shadow-lg';
                      textStyle = 'text-blue-950 font-extrabold';
                    }

                    return (
                      <div key={step.label} className="flex gap-3 items-start relative z-10">
                        {/* Step Circle */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${circleStyle}`}>
                          {isCompleted ? <CheckCircle2 size={16} /> : <StepIcon size={15} />}
                        </div>
                        {/* Step details */}
                        <div className="flex-1 pt-1.5">
                          <h4 className={`text-xs uppercase tracking-wider font-black ${textStyle}`}>
                            Step {stepNumber}: {step.label}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{step.desc}</p>
                        </div>
                        
                        {/* Step active status detail tag */}
                        {isActive && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 animate-pulse mt-1 shrink-0">
                            Current Stage
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Warning/Action banner */}
                <div className={`p-4 rounded-xl border flex gap-3 items-start ${
                  result.alertType === 'success' ? 'bg-teal-50/50 border-teal-100 text-teal-800' :
                  result.alertType === 'warning' ? 'bg-amber-50/50 border-amber-100 text-amber-800' :
                  'bg-blue-50/50 border-blue-100 text-blue-800'
                }`}>
                  {result.alertType === 'success' ? <CheckCircle2 size={18} className="text-teal-600 shrink-0 mt-0.5" /> : 
                   result.alertType === 'warning' ? <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" /> :
                   <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider mb-0.5">Next Action Required</h4>
                    <p className="text-[11px] font-semibold leading-relaxed">{result.nextAction}</p>
                  </div>
                </div>

                {/* Fully Approved Download Certificate Action */}
                {result.certificateAvailable && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors border-none"
                    onClick={() => downloadTextFile(
                      `${result.regNumber}-registration-certificate.txt`,
                      [
                        'MTPG & RIHS Registration Certificate',
                        `Registration Number: ${result.regNumber}`,
                        `Student Name: ${result.studentName}`,
                        `Course: ${result.courseName}`,
                        `Status: ${result.statusText}`,
                      ].join('\n'),
                    )}
                  >
                    <FileText size={14} /> Download Registration Certificate
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* 3. Empty state (No searched ID yet) */}
            {!loading && !result && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 w-full"
              >
                <div className="p-3 bg-white border border-slate-200 rounded-full text-slate-400 shadow-sm">
                  <Search size={24} />
                </div>
                <h3 className="font-display font-black text-slate-800 text-sm uppercase tracking-wider">Awaiting Inquiry</h3>
                <p className="text-slate-500 text-xs font-medium max-w-sm leading-relaxed">
                  Enter your Application ID in the search field to retrieve live checker verification stamps and timelines.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
