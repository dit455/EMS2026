import React from 'react';
import { LogIn, Search, UserPlus } from 'lucide-react';
import { APP_ROUTES } from '../../config/appConfig';
import { institution } from '../../data/portalData';

const navigateTo = (path) => globalThis.location.assign(path);

export default function PublicHeader({ onRegister, onStudentLogin }) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 px-4 sm:px-6 md:px-8 shadow-sm relative z-30">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        {/* Institution Branding */}
        <div className="flex items-center justify-center lg:justify-start gap-3 text-center lg:text-left select-none min-w-0">
          <div className="flex items-center gap-2.5 shrink-0" aria-hidden="true">
            <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex items-center justify-center shadow-inner">
              <img src="/images/govt_puducherry.png" alt="Govt Emblem" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex items-center justify-center shadow-inner">
              <img src="/images/institute_seal.png" alt="Institute Seal" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-black text-blue-900 tracking-tight leading-[1.08] text-[13px] sm:text-sm md:text-base uppercase flex flex-col">
              {institution.nameLines.map((line, idx) => (
                <span key={line} className={`${idx === institution.nameLines.length - 1 ? 'text-teal-600 font-bold' : ''} lg:whitespace-nowrap`}>
                  {line}
                </span>
              ))}
            </h1>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search Field */}
          <div className="relative w-full sm:w-72 lg:w-[300px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
            <span className="sr-only">Search institution portal</span>
            <input 
              type="search" 
              placeholder="Search services..." 
              className="h-10 w-full bg-slate-50 border border-slate-200/80 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/10 transition-all shadow-inner"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <button
              type="button"
              className="h-10 bg-amber-500 hover:bg-amber-600 active:scale-95 text-blue-950 font-black text-sm px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:shadow-amber-500/20 shrink-0"
              onClick={onRegister || (() => navigateTo(APP_ROUTES.student))}
            >
              <UserPlus size={16} /> Register Now
            </button>
            
            <button
              type="button"
              className="h-10 bg-blue-900 hover:bg-blue-950 border border-blue-800 active:scale-95 text-white font-bold text-sm px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-blue-950/10 shrink-0"
              onClick={onStudentLogin || (() => navigateTo(APP_ROUTES.studentLogin))}
            >
              <LogIn size={16} className="text-teal-400" /> Student Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
