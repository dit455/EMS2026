import React from 'react';
import { Download } from 'lucide-react';
import { downloadExamSchedule, downloadGuidelines, downloadStudentTemplate } from '../../utils/actions';

function runDownload(link) {
  if (link.toLowerCase().includes('schedule')) {
    downloadExamSchedule();
    return;
  }
  if (link.toLowerCase().includes('guideline') || link.toLowerCase().includes('checklist') || link.toLowerCase().includes('helpdesk')) {
    downloadGuidelines();
    return;
  }
  downloadStudentTemplate();
}

export default function DownloadsQuickLinks({ links }) {
  return (
    <section className="portal-content-shell py-8 select-none" id="downloads">
      <div className="border-l-4 border-teal-500 pl-4 mb-5">
        <span className="text-teal-600 text-xs font-black uppercase tracking-wider block">Student Downloads</span>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-blue-950 mt-1">Official Resources</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl font-medium">
          Access and download official student templates, guidelines, instruction checklists, and examination schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {links.map((link) => (
          <button 
            type="button" 
            key={link} 
            id={link.toLowerCase().includes('schedule') ? 'exam-schedule' : undefined}
            onClick={() => runDownload(link)}
            className="group min-h-[54px] flex items-center justify-between p-3.5 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-500/50 rounded-xl font-bold text-slate-700 hover:text-blue-900 transition-all text-xs tracking-wider uppercase cursor-pointer text-left shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <span className="pr-4">{link}</span>
            <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 shrink-0 transition-colors">
              <Download size={14} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
