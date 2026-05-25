import React from 'react';
import {
  Accessibility,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Headphones,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { institution } from '../../data/portalData';
import { downloadExamSchedule, downloadGuidelines, downloadStudentTemplate, downloadTextFile, scrollToSection } from '../../utils/actions';

const quickLinks = [
  ['Student Registration', UserPlus, () => scrollToSection('register-now')],
  ['Verification Tracker', ClipboardCheck, () => scrollToSection('student-verification-tracker')],
  ['Student Template', Download, downloadStudentTemplate],
  ['Exam Schedule', CalendarDays, downloadExamSchedule],
];

const policyLinks = [
  ['Guidelines', FileText, downloadGuidelines],
  ['Privacy', ShieldCheck, () => downloadTextFile('MTPG_RIHS_Privacy_Policy.txt', 'Privacy Policy: Student data is used only for registration, verification, and official academic services.')],
  ['Terms', CheckCircle2, () => downloadTextFile('MTPG_RIHS_Terms_Of_Use.txt', 'Terms of Use: Use this portal only for valid student registration and official academic services.')],
  ['Accessibility', Accessibility, () => downloadTextFile('MTPG_RIHS_Accessibility_Statement.txt', 'Accessibility: This portal supports keyboard navigation, visible focus states, and readable contrast modes.')],
];

const statusItems = [
  ['Portal uptime', '99.9%'],
  ['Security mode', 'OTP ready'],
  ['Workflow', 'Maker-checker'],
  ['Audit trail', 'Enabled'],
];

export default function PublicFooter() {
  return (
    <footer className="portal-footer mt-10 bg-[linear-gradient(135deg,#061527_0%,#0b2d55_54%,#0f766e_100%)] text-slate-300 select-none" id="contact">
      <div className="h-1 bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8">
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-cyan-200/20 bg-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cyan-300/15 text-cyan-100">
              <Headphones size={18} />
            </span>
            <div>
              <strong className="block text-base font-black text-white">Student emergency support</strong>
              <span className="block text-sm font-semibold text-slate-300">Registration, OTP, document upload, and verification assistance during office hours.</span>
            </div>
          </div>
          <a href="tel:04130000000" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-black text-[#0b2d55] no-underline transition hover:bg-cyan-50">
            <Phone size={15} /> Call helpdesk
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.8fr_0.95fr_1fr] gap-6 lg:gap-8">
          <section className="min-w-0">
            <div className="flex items-start gap-3">
              <div className="grid grid-cols-2 gap-2 shrink-0">
                <span className="h-12 w-12 rounded-lg bg-white p-1.5 grid place-items-center">
                  <img src="/images/govt_puducherry.png" alt="Government of Puducherry" className="max-h-full max-w-full object-contain" />
                </span>
                <span className="h-12 w-12 rounded-lg bg-white p-1.5 grid place-items-center">
                  <img src="/images/institute_seal.png" alt="Institute seal" className="max-h-full max-w-full object-contain" />
                </span>
              </div>
              <div className="min-w-0">
                <strong className="text-white font-display text-base font-black leading-tight block">
                  {institution.shortName}
                </strong>
                <span className="text-cyan-100/75 text-xs font-bold uppercase tracking-wider block mt-1">Government of Puducherry Institution</span>
              </div>
            </div>
            <p className="text-slate-300/80 text-sm leading-relaxed mt-4 max-w-xl">
              Official student services gateway for registration, document verification, examination schedules, academic downloads, and institutional workflow tracking.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-100">
                <ShieldCheck size={12} /> Secure portal
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-100">
                <CheckCircle2 size={12} /> Verified workflow
              </span>
            </div>
          </section>

          <section>
            <h2 className="text-white text-xs font-black uppercase tracking-[0.14em] border-b border-white/10 pb-3 mb-3">Quick Services</h2>
            <div className="grid gap-2">
              {quickLinks.map(([label, LinkIcon, action]) => (
                <button
                  key={label}
                  type="button"
                  className="group flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs font-bold text-slate-200 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                  onClick={action}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-white/[0.08] text-cyan-200 group-hover:text-amber-200">
                    <LinkIcon size={14} />
                  </span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </section>

          <section id="helpdesk">
            <h2 className="text-white text-xs font-black uppercase tracking-[0.14em] border-b border-white/10 pb-3 mb-3">Helpdesk</h2>
            <div className="grid gap-2.5">
              <div className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <Phone size={16} className="text-cyan-200 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-xs font-black block">0413-0000000</strong>
                  <span className="text-slate-400 text-[11px] font-semibold">Student support desk</span>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <Mail size={16} className="text-cyan-200 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <strong className="text-white text-xs font-black block truncate">helpdesk@mtpgrihs.py.gov.in</strong>
                  <span className="text-slate-400 text-[11px] font-semibold">Registration and verification help</span>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <MapPin size={16} className="text-cyan-200 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-xs font-semibold leading-relaxed">{institution.address}</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white text-xs font-black uppercase tracking-[0.14em] border-b border-white/10 pb-3 mb-3">Portal Status</h2>
            <div className="grid grid-cols-2 gap-2">
              {statusItems.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{label}</span>
                  <strong className="text-white text-xs font-black block mt-1">{value}</strong>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-emerald-100">
              <Headphones size={14} />
              <span className="text-xs font-black">Support hours: 10:00 AM to 5:00 PM</span>
            </div>
          </section>
        </div>

        <div className="mt-7 border-t border-white/10 pt-4 flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {policyLinks.map(([label, LinkIcon, action]) => (
              <button
                key={label}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                onClick={action}
              >
                <LinkIcon size={12} /> {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-black tracking-wider text-slate-400">
            <span>&copy; 2026 MTPG & RIHS. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-slate-300">
              <ClockIcon /> NIC-style secure interface
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ClockIcon() {
  return <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.75)]" aria-hidden="true" />;
}
