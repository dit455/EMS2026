import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  FileCheck2,
  FileSpreadsheet,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  PenLine,
  ShieldCheck,
  Smartphone,
  UserRoundCheck,
  Megaphone,
  Download,
  HelpCircle,
  Clock,
  ArrowRight,
  Shield,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLoginPanel from '../components/home/AdminLoginPanel';
import DownloadsQuickLinks from '../components/home/DownloadsQuickLinks';
import HomeCarousel from '../components/home/HomeCarousel';
import PublicFooter from '../components/home/PublicFooter';
import PublicHeader from '../components/home/PublicHeader';
import PublicNavbar from '../components/home/PublicNavbar';
import StatsSection from '../components/home/StatsSection';
import PublicTopBar from '../components/home/PublicTopBar';
import StudentStatusTracker from '../components/home/StudentStatusTracker';
import { Icon } from '../components';
import { useToast } from '../components/Toast';
import { portalStats } from '../data/portalData';
import { portalService } from '../services/api';
import { registrationService } from '../services/mockApi';
import { downloadExamSchedule, downloadGuidelines, downloadStudentTemplate, scrollToSection } from '../utils/actions';

const workflowSteps = [
  ['Student Registration', 'Create student profile with personal details', PenLine],
  ['Education Details', 'Add qualification and board marks information', BookOpenCheck],
  ['Document Upload', 'Attach proof of ID, address, and certificates', FileSpreadsheet],
  ['Verification', 'College Checker reviews and verifies submitted records', ShieldCheck],
  ['Approval', 'Board Approver final review and signature record lock', UserRoundCheck],
  ['Registration ID Issued', 'Durable student registration number generated', BadgeCheck],
];

const studentServices = [
  ['New Registration', 'Guided student profile creation and reference number generation.', 'user', 'register'],
  ['Student Verification', 'Track verification stage progress in real-time.', 'shield', 'status'],
  ['Downloads', 'Templates, guidelines, and document checklists.', 'download', 'template'],
  ['Examination Schedule', 'Download published institutional exam tables.', 'calendar', 'schedule'],
  ['Notifications', 'Read latest announcements for student intake.', 'megaphone', 'notifications'],
  ['Helpdesk', 'Get login, registration, and system verification help.', 'message', 'helpdesk'],
];

const announcements = [
  {
    title: 'Student registration window open for 2026 academic intake.',
    detail: 'Submit profile and mandatory documents before institutional verification dates.',
    tag: 'Registration',
    status: 'Urgent',
    Icon: Megaphone,
  },
  {
    title: 'Education details template updated.',
    detail: 'Use the latest Excel template before uploading qualification records to prevent parser mismatches.',
    tag: 'Template',
    status: 'Updated',
    Icon: FileSpreadsheet,
  },
  {
    title: 'Examination schedule download available.',
    detail: 'Students may download the published schedule from the downloads section.',
    tag: 'Schedule',
    status: 'Available',
    Icon: Download,
  },
];

const dashboardPreview = [
  ['Draft profile', 'Autosaved student registration progress'],
  ['Document status', 'Missing, submitted, verified, or sent back indicators'],
  ['Registration status', 'Draft, submitted, verified, approved tracking flags'],
  ['Downloads', 'Templates, guidelines, schedules, and official notices'],
];

const dashboardQueue = [
  ['Profile completion', '72%', 'In progress'],
  ['Proof documents', '3 / 4', 'One pending'],
  ['Checker review', '2 days', 'SLA target'],
];

const governanceFlow = [
  ['Maker', 'Student submits registration request and uploads document set.', PenLine],
  ['Checker', 'Authorized college verifier checks record quality.', FileCheck2],
  ['Approver', 'Final board official approval locks the registration.', BadgeCheck],
];

const trustIndicators = [
  ['Secure Registration', LockKeyhole],
  ['OTP Verification', Smartphone],
  ['Government Approved Workflow', ShieldCheck],
  ['Digitally Verified System', Fingerprint],
];

const commandActions = [
  ['Start Registration', 'Create a new student profile and save progress.', UserRoundCheck, 'register'],
  ['Track Verification', 'Check checker review, document status, and approval.', FileCheck2, 'status'],
  ['Download Template', 'Get the latest Excel registration template.', Download, 'template'],
  ['Exam Schedule', 'Download the published examination schedule.', Clock, 'schedule'],
];

function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
      <div className="w-full bg-slate-900 h-10 animate-pulse" />
      <div className="w-full bg-white h-20 border-b border-slate-200 animate-pulse" />
      <div className="portal-content-shell py-12 flex-1 flex flex-col gap-8">
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-48 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-48 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="w-full bg-slate-900 h-64 animate-pulse" />
    </div>
  );
}

function PortalServicesModules({ activeTab, onTabChange, onRegister, onStatus, onAction }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className="home-service-hub portal-content-shell my-8 p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl select-none" 
      id="student-services"
    >
      <div className="border-l-4 border-teal-500 pl-4 mb-5">
        <span className="text-teal-600 text-xs font-black uppercase tracking-wider block">Portal Services</span>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-blue-950 mt-1">Student Services Hub</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl font-medium">
          Access all public student-facing services, checklists, guidelines, and tracking mechanisms from a single unified panel.
        </p>
      </div>

      {/* Tabs selector */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl w-full mb-5 border border-slate-200 overflow-x-auto" role="tablist" aria-label="Portal services tabs">
        {['Student Services', 'Registration Workflow', 'Student Dashboard Overview'].map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`flex-1 min-w-[120px] text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab 
                ? 'bg-blue-950 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Student Services Grid */}
        {activeTab === 'Student Services' && (
          <motion.div 
            key="services"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {studentServices.map(([title, detail, icon, action]) => (
              <motion.button 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.15 }}
                type="button" 
                onClick={() => onAction(action)} 
                key={title}
                className="home-service-card group min-h-[132px] bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer text-left flex gap-3 items-start focus:ring-4 focus:ring-blue-100 focus:outline-none"
              >
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 shrink-0">
                  <Icon name={icon} size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-slate-900 font-extrabold text-sm tracking-wide mb-1 uppercase font-display">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{detail}</p>
                </div>
                <ArrowRight size={14} className="mt-1 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-teal-600" aria-hidden="true" />
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Tab 2: Workflow Timeline */}
        {activeTab === 'Registration Workflow' && (
          <motion.div 
            key="workflow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {workflowSteps.map(([step, detail, StepIcon], index) => (
              <article key={step} className="min-h-[132px] bg-white border border-slate-200/70 rounded-xl p-4 shadow-sm flex gap-3 items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full z-0 flex justify-end items-start p-3">
                  <span className="text-3xl font-black text-slate-100 font-display select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 shrink-0 z-10 relative">
                  <StepIcon size={18} aria-hidden="true" />
                </div>
                <div className="z-10 relative pr-6">
                  <h3 className="text-slate-900 font-extrabold text-sm tracking-wide mb-1 uppercase font-display">{step}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{detail}</p>
                </div>
              </article>
            ))}
          </motion.div>
        )}

        {/* Tab 3: Dashboard Preview details */}
        {activeTab === 'Student Dashboard Overview' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="student-dashboard-preview-shell bg-gradient-to-br from-white via-slate-50 to-cyan-50/70 border border-blue-900/10 rounded-xl p-5 sm:p-6 shadow-sm grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-6 items-stretch overflow-hidden"
          >
            <div className="min-w-0 flex flex-col justify-between gap-5">
              <div>
                <span className="text-teal-600 text-[10px] font-black uppercase tracking-wider">Student Workspace</span>
                <h3 className="text-blue-950 font-black text-xl sm:text-2xl tracking-tight font-display mt-1">A cleaner student dashboard session</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium mt-2 max-w-xl">
                  Students land on one calm workspace with progress, pending requirements, verification status, and official downloads in view.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dashboardPreview.map(([title, detail]) => (
                  <div key={title} className="flex gap-2.5 items-start rounded-lg border border-slate-200/80 bg-white/85 p-3 shadow-sm">
                    <CheckCircle2 size={16} className="text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <strong className="text-blue-950 text-xs font-black block">{title}</strong>
                      <span className="text-slate-500 text-[11px] font-semibold block mt-0.5 leading-relaxed">{detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  type="button" 
                  onClick={onRegister}
                  className="bg-blue-900 hover:bg-blue-950 text-white font-black text-xs uppercase tracking-wider py-3 px-5 rounded-lg shadow-sm transition-all cursor-pointer border-none flex items-center gap-2"
                >
                  <UserRoundCheck size={15} />
                  Start Registration
                </button>
                <button 
                  type="button" 
                  onClick={onStatus}
                  className="bg-white hover:bg-blue-50 text-blue-950 font-black text-xs uppercase tracking-wider py-3 px-5 rounded-lg transition-all cursor-pointer border border-blue-900/10 flex items-center gap-2"
                >
                  <FileCheck2 size={15} />
                  Track Status
                </button>
              </div>
            </div>

            <div className="min-w-0 w-full rounded-xl border border-blue-900/10 bg-white/90 p-3 sm:p-4 shadow-xl shadow-blue-950/5">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">Live overview</span>
                    <strong className="block text-blue-950 text-sm font-black">Student Dashboard</strong>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-3">
                  {dashboardQueue.map(([label, value, state]) => (
                    <div key={label} className="rounded-lg border border-slate-200 bg-white p-3">
                      <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</span>
                      <strong className="mt-1 block text-lg font-black text-blue-950 leading-none">{value}</strong>
                      <small className="mt-1 block text-[11px] font-bold text-slate-500">{state}</small>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black text-blue-950">Registration readiness</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">72%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-teal-500 via-blue-700 to-blue-950" />
                  </div>
                </div>

                <div className="mt-3 grid gap-2">
                  {[
                    ['Draft saved', 'Profile auto-save completed', CheckCircle2],
                    ['Document review', 'Address proof pending upload', Clock],
                    ['Official downloads', 'Templates and schedule ready', Download],
                  ].map(([title, detail, RowIcon]) => (
                    <div key={title} className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <span className="grid h-7 w-7 place-items-center rounded-md bg-teal-50 text-teal-700">
                        <RowIcon size={14} />
                      </span>
                      <div className="min-w-0">
                        <strong className="block text-xs font-black text-slate-900 truncate">{title}</strong>
                        <span className="block text-[11px] font-semibold text-slate-500 truncate">{detail}</span>
                      </div>
                      <ArrowRight size={14} className="text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function RegisterNowSection({ onRegister, onTemplate, onGuidelines }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.55 }}
      className="portal-content-shell py-8 select-none" 
      id="register-now"
    >
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border border-blue-900/40">
        {/* Glow rings in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl z-0" />

        {/* Content */}
        <div className="lg:col-span-7 flex flex-col justify-center z-10 relative">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs block mb-2">Student Registration</span>
          <h2 className="text-2xl sm:text-3xl font-black font-display leading-tight mb-3 tracking-tight">
            Apply through a secure official workflow
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4 font-medium max-w-xl">
            Start a student registration request, complete education details, upload mandatory documents, and track verification status until your registration number is generated.
          </p>

          <div className="flex flex-wrap gap-y-2 gap-x-3 mb-5">
            {trustIndicators.map(([label, TrustIcon]) => (
              <span key={label} className="text-xs text-slate-300 flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <TrustIcon size={13} className="text-teal-400 shrink-0" aria-hidden="true" /> 
                {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(220px,282px)_minmax(260px,300px)] items-stretch gap-3 max-w-2xl">
            <button 
              type="button" 
              onClick={onRegister}
              className="h-12 bg-amber-500 hover:bg-amber-600 text-blue-950 font-black text-xs tracking-wider uppercase px-6 rounded-xl transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 cursor-pointer border-none flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <UserRoundCheck size={16} /> Register Now
            </button>
            <button 
              type="button" 
              onClick={onTemplate}
              className="registration-download-button h-12 bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-wide px-5 rounded-xl border border-white/25 hover:border-white/40 backdrop-blur-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm"
            >
              <Download size={15} />
              <span>Download Excel Template</span>
            </button>
          </div>
        </div>

        {/* Graphics element */}
        <div className="lg:col-span-5 flex justify-center z-10 relative">
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* Rotating border rings */}
            <div className="absolute inset-0 border border-slate-500/20 rounded-full animate-spin-slow" />
            <div className="absolute inset-4 border border-teal-500/30 rounded-full animate-reverse-spin" />
            
            {/* Center card mockup */}
            <div className="w-40 h-40 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md p-5 flex flex-col justify-between shadow-2xl relative">
              <div className="flex justify-between items-center">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <Shield size={24} className="text-teal-400" />
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="h-3 bg-white/20 rounded w-2/3" />
                <div className="h-2 bg-white/10 rounded w-full" />
                <div className="h-2 bg-white/10 rounded w-5/6" />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2 border-t border-white/10">
                <span>Verification System</span>
                <span className="text-teal-400">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function StudentWorkflowSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className="portal-content-shell py-8 select-none" 
      id="student-workflow"
    >
      <div className="border-l-4 border-teal-500 pl-4 mb-5">
        <span className="text-teal-600 text-xs font-black uppercase tracking-wider block">Registration Timeline</span>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-blue-950 mt-1">Student Registration Journey</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl font-medium">
          Every student registration request follows a traceable, step-by-step regulatory sequence from profile generation to approved credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 relative">
        {workflowSteps.map(([step, detail, StepIcon], index) => {
          return (
            <div key={step} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm relative z-10 flex flex-col justify-between min-h-[142px]">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 shrink-0">
                    <StepIcon size={16} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black text-slate-300 font-display select-none">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="text-slate-900 font-extrabold text-xs tracking-wide mb-1 uppercase font-display">{step}</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

function DprWorkflowSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className="portal-content-shell py-8 select-none" 
      id="governance-workflow"
    >
      <div className="border-l-4 border-teal-500 pl-4 mb-5">
        <span className="text-teal-600 text-xs font-black uppercase tracking-wider block">Security & Compliance</span>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-blue-950 mt-1">Maker-Checker-Approver Workflow</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl font-medium">
          Institutional controls protect student record integrity. Public panels only represent processing stages, while operational dashboard consoles remain private.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Side: Roles flow */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl z-0" />
          <h3 className="text-teal-400 font-black text-xs tracking-wider uppercase block mb-6 z-10 relative">Operational Processing Path</h3>
          
          <div className="flex flex-col gap-5 z-10 relative">
            {governanceFlow.map(([title, detail, DprIcon], idx) => (
              <div key={title} className="flex gap-4 items-start relative">
                <div className="p-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                  <DprIcon size={18} aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-white text-xs font-black uppercase tracking-wider mb-0.5">{title}</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-semibold">{detail}</p>
                </div>
                {idx < 2 && (
                  <div className="absolute left-6 top-12 h-6 w-0.5 bg-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Security integrations */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <article className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 w-fit mb-3">
              <KeyRound size={16} aria-hidden="true" />
            </div>
            <div>
              <strong className="text-slate-900 text-xs font-black uppercase tracking-wider block">OTP Authentication</strong>
              <p className="text-slate-500 text-[11px] leading-relaxed font-semibold mt-1">
                Official check-ins and edits trigger standard OTP verification to prevent unauthorized activity logs.
              </p>
            </div>
          </article>
          
          <article className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="p-3 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 w-fit mb-3">
              <ShieldCheck size={16} aria-hidden="true" />
            </div>
            <div>
              <strong className="text-slate-900 text-xs font-black uppercase tracking-wider block">Digital Verification</strong>
              <p className="text-slate-500 text-[11px] leading-relaxed font-semibold mt-1">
                Approved registration records generate audit records ready for digitally signed downstream marksheet downloads.
              </p>
            </div>
          </article>

          <article className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 w-fit mb-3">
              <FileCheck2 size={16} aria-hidden="true" />
            </div>
            <div>
              <strong className="text-slate-900 text-xs font-black uppercase tracking-wider block">National Integrations</strong>
              <p className="text-slate-500 text-[11px] leading-relaxed font-semibold mt-1">
                Data structures align with standard templates to support potential DigiLocker verification channels.
              </p>
            </div>
          </article>

          <article className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="p-3 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100 w-fit mb-3">
              <Fingerprint size={16} aria-hidden="true" />
            </div>
            <div>
              <strong className="text-slate-900 text-xs font-black uppercase tracking-wider block">Immutable Audit Trail</strong>
              <p className="text-slate-500 text-[11px] leading-relaxed font-semibold mt-1">
                All status amendments, checker queries, and approvals maintain full staff identity records.
              </p>
            </div>
          </article>
        </div>
      </div>
    </motion.section>
  );
}

function NotificationsSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4 }}
      className="portal-content-shell pt-4 pb-2 select-none" 
      id="notifications"
    >
      <div className="student-announcement-bar student-announcement-bar--premium mx-auto max-w-6xl">
        <div className="student-announcement-head">
          <div className="student-announcement-kicker">
            <span className="student-announcement-kicker__icon" aria-hidden="true">
              <Megaphone size={16} />
            </span>
            <span>Student Announcements</span>
          </div>
          <strong>Latest Notices</strong>
          <p>Important registration, template, and schedule updates for the current student intake.</p>
          <div className="student-announcement-meta" aria-label="Announcement summary">
            <span>{announcements.length} Active Notices</span>
            <span>2026 Intake</span>
          </div>
        </div>

        <div className="student-announcement-list">
          {announcements.map(({ title, detail, tag, status, Icon: NoticeIcon }, idx) => (
            <article 
              key={title} 
              className={`student-notice-card ${idx === 0 ? 'is-priority' : ''}`}
            >
              <div className="student-notice-card__top">
                <span className="student-notice-card__icon" aria-hidden="true">
                  <NoticeIcon size={15} />
                </span>
                <span className="student-notice-card__tag">{tag}</span>
                <span className="student-notice-card__status">{status}</span>
              </div>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function HomeCommandBand({ onAction }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4 }}
      className="home-command-band portal-content-shell py-4 select-none"
      aria-label="Priority student services"
    >
      <div className="rounded-2xl border border-blue-900/10 bg-white/95 p-3 sm:p-4 shadow-xl shadow-slate-200/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {commandActions.map(([title, detail, CommandIcon, action]) => (
            <button
              key={title}
              type="button"
              onClick={() => onAction(action)}
              className="home-command-card group min-h-[104px] rounded-xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 transition-colors group-hover:bg-teal-50 group-hover:text-teal-700">
                  <CommandIcon size={17} aria-hidden="true" />
                </span>
                <ArrowRight size={14} className="mt-1 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-teal-600" aria-hidden="true" />
              </div>
              <strong className="mt-3 block text-sm font-black uppercase tracking-wide text-blue-950 font-display">{title}</strong>
              <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">{detail}</p>
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function RegistrationStatusModal({ status, onClose, onRegister }) {
  if (!status) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm select-none" role="dialog" aria-modal="true" aria-label="Registration status">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        <button 
          type="button" 
          className="absolute top-4 right-4 p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors border-none" 
          onClick={onClose} 
          aria-label="Close status"
        >
          x
        </button>

        <span className="text-teal-600 text-[10px] font-black uppercase tracking-wider block mb-1">Live Registration Status</span>
        <h2 className="text-blue-950 font-black text-lg sm:text-xl font-display uppercase tracking-tight">{status.status}</h2>
        <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-2">{status.nextStep}</p>
        
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col gap-3 my-6 text-left">
          <div>
            <strong className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Reference Number</strong>
            <span className="text-slate-800 text-sm font-black tracking-wide block mt-0.5">{status.referenceNumber}</span>
          </div>
          {status.applicantName && (
            <div>
              <strong className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Student Applicant</strong>
              <span className="text-slate-800 text-sm font-bold block mt-0.5">{status.applicantName}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button 
            type="button" 
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-lg cursor-pointer transition-colors border-none shadow-sm"
            onClick={onRegister}
          >
            Open Registration
          </button>
          <button 
            type="button" 
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-lg cursor-pointer transition-colors border border-slate-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function MobileBottomActions({ onRegister, onLogin, onHelpdesk }) {
  return (
    <nav className="mtpg-mobile-actions fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/60 shadow-lg px-4 py-3 flex md:hidden justify-around select-none" aria-label="Mobile student actions">
      <button 
        type="button" 
        onClick={onRegister}
        className="flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-950 cursor-pointer border-none bg-transparent"
      >
        <UserRoundCheck size={16} className="text-teal-600" />
        <span>Register</span>
      </button>
      <button 
        type="button" 
        onClick={onLogin}
        className="flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-950 cursor-pointer border-none bg-transparent"
      >
        <KeyRound size={16} className="text-blue-800" />
        <span>Login</span>
      </button>
      <button 
        type="button" 
        onClick={onHelpdesk}
        className="flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-950 cursor-pointer border-none bg-transparent"
      >
        <HelpCircle size={16} className="text-slate-500" />
        <span>Helpdesk</span>
      </button>
    </nav>
  );
}

export default function Home({ onLogin }) {
  const [data, setData] = useState(null);
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const [activeLogin, setActiveLogin] = useState('student');
  const [activeTab, setActiveTab] = useState('Student Services');
  const [statusModal, setStatusModal] = useState(null);
  const loginRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    portalService.getHomeData().then(setData);
  }, []);

  const revealLogin = (mode = 'student') => {
    setActiveLogin(mode);
    setShowLoginPanel(true);
    window.requestAnimationFrame(() => {
      loginRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const navigatePublic = (target) => {
    scrollToSection(target);
  };

  const openRegistration = () => {
    navigate('/student');
  };

  const openTemplate = () => {
    downloadStudentTemplate();
    showToast('Student Excel template download started.', 'success');
  };

  const openGuidelines = () => {
    downloadGuidelines();
    showToast('Student guidelines download started.', 'success');
  };

  const openSchedule = () => {
    downloadExamSchedule();
    showToast('Examination schedule download started.', 'success');
  };

  const openStatus = async () => {
    const status = await registrationService.getRegistrationStatus();
    setStatusModal(status);
  };

  const handleServiceAction = (action) => {
    if (action === 'register') openRegistration();
    if (action === 'status') openStatus();
    if (action === 'template') openTemplate();
    if (action === 'schedule') openSchedule();
    if (action === 'notifications') navigatePublic('notifications');
    if (action === 'helpdesk') navigatePublic('helpdesk');
  };

  const handleLogin = (user) => {
    onLogin(user);
    navigate('/dashboard');
  };

  const handleStudentLogin = (user) => {
    onLogin(user);
    navigate('/student');
  };

  if (!data) return <HomeSkeleton />;

  return (
    <div className="mtpg-home min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <PublicTopBar onAdminLogin={() => revealLogin('admin')} onNavigate={navigatePublic} />
      <PublicHeader onRegister={openRegistration} onStudentLogin={() => revealLogin('student')} />
      <PublicNavbar onNavigate={navigatePublic} />
      <HomeCarousel
        slides={data.carouselSlides}
        onLoginRequest={revealLogin}
        onRegister={openRegistration}
        onStatus={openStatus}
        onHelpdesk={() => navigatePublic('helpdesk')}
      />
      <main className="flex-1 pb-16 md:pb-0">
        <NotificationsSection />

        <HomeCommandBand onAction={handleServiceAction} />

        <div className="portal-content-shell pt-6 select-none" aria-label="Breadcrumb">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <button type="button" onClick={() => navigatePublic('home')} className="hover:text-blue-900 cursor-pointer border-none bg-transparent font-black">Home</button>
            <span>/</span>
            <strong className="text-slate-600">Student Services</strong>
          </div>
        </div>
        
        <PortalServicesModules
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRegister={openRegistration}
          onStatus={openStatus}
          onAction={handleServiceAction}
        />
        
        <StudentStatusTracker />
        
        <RegisterNowSection onRegister={openRegistration} onTemplate={openTemplate} onGuidelines={openGuidelines} />
        
        <StatsSection stats={portalStats} />
        
        <StudentWorkflowSection />
        
        <DprWorkflowSection />
        
        <DownloadsQuickLinks links={data.downloadLinks} />
        
        <div ref={loginRef} />
        {showLoginPanel && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AdminLoginPanel
              activeMode={activeLogin}
              onModeChange={setActiveLogin}
              onLogin={handleLogin}
              onStudentLogin={handleStudentLogin}
              onRegister={openRegistration}
              onHelpdesk={() => navigatePublic('helpdesk')}
            />
          </motion.div>
        )}
      </main>
      <RegistrationStatusModal status={statusModal} onClose={() => setStatusModal(null)} onRegister={openRegistration} />
      <MobileBottomActions onRegister={openRegistration} onLogin={() => revealLogin('student')} onHelpdesk={() => navigatePublic('helpdesk')} />
      <PublicFooter />
    </div>
  );
}
