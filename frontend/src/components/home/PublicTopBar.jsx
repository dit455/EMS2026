import React from 'react';
import { Accessibility, Languages, Phone, ShieldCheck, Type } from 'lucide-react';
import { APP_ROUTES } from '../../config/appConfig';
import { institution } from '../../data/portalData';

export default function PublicTopBar({ onAdminLogin, onNavigate }) {
  const toggleAccessibility = () => {
    document.body.classList.toggle('mtpg-accessible-mode');
  };

  return (
    <div className="bg-blue-950 text-slate-300 border-b border-blue-900/40 text-xs py-2 px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 select-none" aria-label="Government utility bar">
      <div className="flex items-center gap-3 font-medium tracking-wide">
        <span className="opacity-75 text-slate-400">Government of Puducherry</span>
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 hidden sm:inline-block"></span>
        <strong className="text-slate-200">{institution.shortName}</strong>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <button 
          type="button" 
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
          onClick={() => (onNavigate ? onNavigate('helpdesk') : globalThis.location.assign(`${APP_ROUTES.home}#helpdesk`))}
        >
          Student Helpdesk
        </button>
        <button 
          type="button" 
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
          onClick={() => (onNavigate ? onNavigate('contact') : globalThis.location.assign(`${APP_ROUTES.home}#contact`))}
        >
          <Phone size={12} className="text-teal-400" aria-hidden="true" /> Contact
        </button>
        <button 
          type="button" 
          aria-label="Accessibility controls" 
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
          onClick={toggleAccessibility}
        >
          <Accessibility size={12} className="text-teal-400" /> Accessibility
        </button>
        <span className="flex items-center gap-1 text-slate-400 font-semibold" aria-label="Font size controls">
          <Type size={12} /> A- A+
        </span>
        <button 
          type="button" 
          aria-label="Language selector" 
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
          onClick={() => document.documentElement.setAttribute('lang', 'en-IN')}
        >
          <Languages size={12} className="text-teal-400" /> English
        </button>
        <button 
          type="button" 
          className="bg-blue-900/60 text-slate-300 hover:text-amber-300 hover:bg-blue-900 px-2 py-0.5 rounded border border-blue-800/80 transition-all flex items-center gap-1 cursor-pointer font-semibold shadow-sm" 
          onClick={onAdminLogin}
        >
          <ShieldCheck size={12} className="text-amber-400" /> Admin Access
        </button>
      </div>
    </div>
  );
}
