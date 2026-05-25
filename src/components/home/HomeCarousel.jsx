import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  FileCheck2,
  Headphones,
  KeyRound,
  ListChecks,
  ScrollText,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { APP_ROUTES } from '../../config/appConfig';
import { institution } from '../../data/portalData';
import { downloadStudentTemplate, scrollToSection } from '../../utils/actions';

const navigateTo = (path) => globalThis.location.assign(path);

const quickActions = [
  ['Register Now', UserPlus, 'register', 'bg-amber-500/10 text-amber-300 hover:bg-amber-500 hover:text-blue-950 border border-amber-500/20'],
  ['Download Template', Download, 'download', 'bg-blue-500/10 text-blue-300 hover:bg-blue-500 hover:text-white border border-blue-500/20'],
  ['Track Registration Status', FileCheck2, 'status', 'bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500 hover:text-white border border-indigo-500/20'],
  ['Student Login', KeyRound, 'login', 'bg-teal-500/10 text-teal-300 hover:bg-teal-500 hover:text-blue-950 border border-teal-500/20'],
];

const heroProofPoints = [
  ['6-Step', 'Registration', ListChecks, 'student-workflow'],
  ['OTP', 'Verification', ShieldCheck, 'register-now'],
  ['Workflow', 'Audit Trail', ScrollText, 'governance-workflow'],
];

export default function HomeCarousel({ slides, onLoginRequest, onRegister, onStatus, onHelpdesk }) {
  const [index, setIndex] = useState(0);
  const displaySlides = slides.slice(0, 3);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % displaySlides.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [displaySlides.length]);

  const move = (direction) => {
    setIndex((current) => (current + direction + displaySlides.length) % displaySlides.length);
  };

  const runQuickAction = (action) => {
    if (action === 'register') onRegister?.();
    if (action === 'download') downloadStudentTemplate();
    if (action === 'status') onStatus?.();
    if (action === 'login') onLoginRequest?.('student');
  };

  return (
    <section className="relative overflow-hidden bg-blue-950 text-white min-h-[470px] lg:min-h-[520px] flex items-center select-none" id="home" aria-label="Portal highlights">
      {/* Background slide with AnimatePresence */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to right, rgba(8, 18, 38, 0.96) 30%, rgba(13, 50, 89, 0.82) 60%, rgba(15, 118, 110, 0.40)), url(${displaySlides[index].image})` 
            }}
          />
        </AnimatePresence>
      </div>

      {/* Hero Content Inner container */}
      <div className="portal-content-shell relative z-10 py-7 sm:py-9 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
        {/* Left Side: Slide Details */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          <span className="w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-teal-300 font-black uppercase tracking-wider text-[10px] md:text-xs mb-3 shadow-sm backdrop-blur-sm">
            {institution.shortName} Official Student Portal
          </span>
          
          <div className="min-h-[132px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <h2 className="font-display text-3xl sm:text-4xl md:text-[3.35rem] font-black tracking-tight leading-[0.98] mb-3 sm:mb-4 max-w-2xl">
                  {displaySlides[index].title}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed mb-4 sm:mb-5 font-medium">
                  {displaySlides[index].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Primary Strong CTA Button: Register Now */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 max-w-md">
            <button
              type="button"
              className="h-12 bg-amber-500 hover:bg-amber-600 text-blue-950 font-black text-xs tracking-wider uppercase px-5 rounded-lg active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-2 group border-none"
              onClick={onRegister || (() => navigateTo(APP_ROUTES.student))}
            >
              <UserPlus size={18} className="transition-transform group-hover:scale-110" />
              <span>Register Now</span>
            </button>
            <button
              type="button"
              className="h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs tracking-wider uppercase px-5 rounded-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              onClick={() => scrollToSection('student-verification-tracker')}
            >
              <span>Track Verification</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Hero proof actions */}
          <div className="hero-proof-strip mt-5 sm:mt-7 border-t border-slate-700/40 pt-4 sm:pt-5 max-w-xl">
            {heroProofPoints.map(([lead, label, ProofIcon, target]) => (
              <button
                key={`${lead}-${label}`}
                type="button"
                className="hero-proof-chip group"
                onClick={() => scrollToSection(target)}
                aria-label={`View ${lead} ${label}`}
              >
                <span className="hero-proof-chip__icon" aria-hidden="true">
                  <ProofIcon size={15} />
                </span>
                <span className="hero-proof-chip__copy">
                  <strong>{lead}</strong>
                  <span>{label}</span>
                </span>
                <ArrowRight size={13} className="hero-proof-chip__arrow" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Actions Card */}
        <aside className="home-quick-panel lg:col-span-5 w-full lg:max-w-[430px] xl:max-w-[450px] lg:justify-self-end bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between" aria-label="Quick student actions">
          <div>
            <div className="border-b border-white/10 pb-2.5 mb-3 select-none flex items-start justify-between gap-3">
              <div>
                <span className="text-teal-400 text-[10px] font-black uppercase tracking-wider block">Student Dashboard Services</span>
                <h3 className="text-base font-black font-display text-white mt-0.5">Quick Actions</h3>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-300">
                Live
              </span>
            </div>

            <div className="grid gap-2">
              {quickActions.map(([label, Icon, action, styleClass]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => runQuickAction(action)}
                  className={`group w-full h-10 sm:h-11 flex items-center justify-between px-3.5 rounded-lg text-xs sm:text-[13px] font-black tracking-wide transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5 ${styleClass}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="shrink-0" aria-hidden="true" />
                    <span>{label}</span>
                  </div>
                  <ArrowRight size={13} className="opacity-60 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <button 
            type="button" 
            className="mt-3 h-10 border border-teal-500/20 hover:border-teal-500/40 bg-teal-500/5 hover:bg-teal-500/10 text-teal-300 font-black text-[11px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            onClick={onHelpdesk || (() => scrollToSection('helpdesk'))}
          >
            <Headphones size={14} aria-hidden="true" />
            Student Helpdesk Support
          </button>
        </aside>
      </div>

      {/* Navigation Arrows */}
      <button 
        type="button" 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/40 border border-white/10 flex items-center justify-center text-white hover:bg-slate-900/80 transition-all cursor-pointer"
        onClick={() => move(-1)} 
        aria-label="Previous banner"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        type="button" 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/40 border border-white/10 flex items-center justify-center text-white hover:bg-slate-900/80 transition-all cursor-pointer"
        onClick={() => move(1)} 
        aria-label="Next banner"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide dots indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="tablist" aria-label="Banner slides">
        {displaySlides.map((slide, slideIndex) => (
          <button
            key={slide.id}
            type="button"
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${slideIndex === index ? 'bg-amber-400 w-6' : 'bg-white/40 hover:bg-white/60'}`}
            onClick={() => setIndex(slideIndex)}
            aria-label={`Show slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
