import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Clock3, FileSpreadsheet, GraduationCap, TrendingUp } from 'lucide-react';

const statMeta = {
  'Total Students': { icon: GraduationCap, bg: 'bg-blue-50 border-blue-100', iconColor: 'text-blue-600', barColor: 'bg-blue-600', trend: '+12%' },
  'Pending Verification': { icon: Clock3, bg: 'bg-amber-50 border-amber-100', iconColor: 'text-amber-600', barColor: 'bg-amber-500', trend: '-8%' },
  'Approved Students': { icon: CheckCircle2, bg: 'bg-teal-50 border-teal-100', iconColor: 'text-teal-600', barColor: 'bg-teal-600', trend: '+9%' },
  'Scheduled Exams': { icon: TrendingUp, bg: 'bg-cyan-50 border-cyan-100', iconColor: 'text-cyan-600', barColor: 'bg-cyan-500', trend: '+4%' },
  'Generated Marks Sheets': { icon: FileSpreadsheet, bg: 'bg-indigo-50 border-indigo-100', iconColor: 'text-indigo-600', barColor: 'bg-indigo-600', trend: '+11%' },
};

export default function StatsSection({ stats }) {
  return (
    <section className="portal-content-shell py-8 select-none" id="stats">
      <div className="border-l-4 border-teal-500 pl-4 mb-5">
        <span className="text-teal-600 text-xs font-black uppercase tracking-wider block">Operational Analytics</span>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-blue-950 mt-1">Operational Snapshot</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl font-medium">
          Public counters show real-time registration and verification health, while secure task backlogs remain protected inside the official dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(([label, value, detail], idx) => {
          const meta = statMeta[label] || statMeta['Total Students'];
          const Icon = meta.icon;

          return (
            <motion.article 
              key={label} 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className="min-h-[206px] bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl p-4 shadow-md shadow-slate-200/60 hover:shadow-xl hover:shadow-blue-950/10 hover:border-teal-300 flex flex-col justify-between transition-all relative overflow-hidden"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className={`p-2.5 rounded-lg ${meta.bg} border shrink-0`}>
                    <Icon size={18} className={meta.iconColor} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 flex items-center gap-0.5 bg-teal-50/50 border border-teal-100/50 px-2 py-0.5 rounded-full">
                    <ArrowUpRight size={10} aria-hidden="true" /> {meta.trend}
                  </span>
                </div>
                
                <strong className="text-2xl font-black tracking-tight text-slate-900 font-display block mb-1">
                  {value}
                </strong>
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  {label}
                </span>
                <p className="text-[11px] text-slate-500 leading-snug font-medium">
                  {detail}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3" aria-hidden="true">
                  <div className={`h-full ${meta.barColor}`} style={{ width: '75%' }} />
                </div>
                {/* Mini chart */}
                <div className="flex items-end justify-between h-7 gap-1 px-1" aria-hidden="true">
                  {[35, 55, 42, 68, 50, 78].map((height, i) => (
                    <b 
                      key={i} 
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        i === 5 ? meta.barColor : 'bg-slate-200'
                      }`}
                      style={{ height: `${height}%` }} 
                    />
                  ))}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
