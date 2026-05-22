'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const PRESETS = [
  { label: 'Every Minute', value: ['*', '*', '*', '*', '*'] },
  { label: 'Every 5 Minutes', value: ['*/5', '*', '*', '*', '*'] },
  { label: 'Every Hour', value: ['0', '*', '*', '*', '*'] },
  { label: 'Every Midnight', value: ['0', '0', '*', '*', '*'] },
  { label: 'Every Monday', value: ['0', '0', '*', '*', '1'] },
  { label: 'Weekday Mornings (8 AM)', value: ['0', '8', '*', '*', '1-5'] },
];

const SEGMENTS = [
  { id: 0, name: 'Minute', desc: '0-59', common: ['*', '0', '*/5', '*/15', '30'] },
  { id: 1, name: 'Hour', desc: '0-23', common: ['*', '0', '8', '12', '*/2'] },
  { id: 2, name: 'Day of Month', desc: '1-31', common: ['*', '1', '15', '*/2'] },
  { id: 3, name: 'Month', desc: '1-12', common: ['*', '1', '6', '12', '*/3'] },
  { id: 4, name: 'Day of Week', desc: '0-6 (0=Sun)', common: ['*', '0', '1-5', '6,0'] },
];

export default function CronBuilder() {
  const [parts, setParts] = useState(['0', '0', '*', '*', '*']);

  // --- Lightweight Humanizer Engine ---
  const explanation = useMemo(() => {
    const [min, hr, dom, mon, dow] = parts;
    
    // Safety check for empty inputs
    if (!min || !hr || !dom || !mon || !dow) return "Incomplete expression.";

    let desc = "";

    // Time parsing
    if (min === '*' && hr === '*') desc = "Every minute";
    else if (min.startsWith('*/') && hr === '*') desc = `Every ${min.split('/')[1]} minutes`;
    else if (min === '0' && hr === '*') desc = "Every hour, on the hour";
    else if (min !== '*' && hr === '*') desc = `Every hour, at minute ${min}`;
    else if (hr.startsWith('*/') && min === '0') desc = `Every ${hr.split('/')[1]} hours, on the hour`;
    else if (min !== '*' && hr !== '*') {
      // Basic formatting for standard time
      const isNum = !isNaN(hr) && !isNaN(min);
      if (isNum) {
        const period = Number(hr) >= 12 ? 'PM' : 'AM';
        const formattedHr = Number(hr) % 12 || 12;
        desc = `At ${String(formattedHr).padStart(2, '0')}:${String(min).padStart(2, '0')} ${period}`;
      } else {
        desc = `At minute ${min} past hour ${hr}`;
      }
    } else {
      desc = "At specified time";
    }

    // Day of Week parsing
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (dow !== '*') {
      if (dow === '1-5') desc += ", Monday through Friday";
      else if (dow === '6,0' || dow === '0,6') desc += ", on weekends";
      else if (!isNaN(dow) && dow >= 0 && dow <= 6) desc += `, only on ${days[dow]}`;
      else desc += `, on day of week ${dow}`;
    }

    // Day of Month & Month parsing
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (dom !== '*' && mon !== '*') {
      if (!isNaN(mon) && !isNaN(dom)) desc += `, on ${months[mon - 1]} ${dom}`;
      else desc += `, on day ${dom} of month ${mon}`;
    } else if (dom !== '*') {
      desc += `, on day ${dom} of the month`;
    } else if (mon !== '*') {
      if (!isNaN(mon)) desc += `, in ${months[mon - 1]}`;
      else desc += `, every month ${mon}`;
    }

    return desc;
  }, [parts]);

  const updatePart = (index, value) => {
    const newParts = [...parts];
    newParts[index] = value;
    setParts(newParts);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(parts.join(' '));
    if (window.showToast) window.showToast('Cron expression copied!');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Cron Builder</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Generate, edit, and translate server cron schedule expressions.</p>
      
      {/* Top Section: Output & Translation */}
      <div className="bg-neutral-900 dark:bg-white p-8 rounded-3xl shadow-xl mb-8 relative group overflow-hidden">
        <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Generated Expression</div>
        
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-mono text-4xl md:text-5xl font-extrabold tracking-widest text-white dark:text-neutral-900 break-all text-center md:text-left">
            {parts.join(' ')}
          </div>
          
          <button 
            onClick={copyToClipboard}
            className="shrink-0 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            Copy Code
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-800 dark:border-neutral-200">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-1">Schedule Translation</div>
          <p className="text-lg font-medium text-emerald-400 dark:text-emerald-600">
            "{explanation}"
          </p>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Common Templates</h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => {
            const isActive = parts.join(' ') === preset.value.join(' ');
            return (
              <button
                key={preset.label}
                onClick={() => setParts([...preset.value])}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${isActive ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent shadow-sm' : 'bg-white dark:bg-[#111] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Builder Grid */}
      <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Interactive Builder</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {SEGMENTS.map((seg) => (
            <div key={seg.id} className="flex flex-col">
              <label className="text-sm font-bold text-neutral-900 dark:text-white mb-1">{seg.name}</label>
              <span className="text-[10px] font-mono text-neutral-400 mb-3">{seg.desc}</span>
              
              <input 
                type="text" 
                value={parts[seg.id]} 
                onChange={(e) => updatePart(seg.id, e.target.value)}
                className="w-full p-3 font-mono text-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition text-neutral-900 dark:text-white mb-4 shadow-inner"
              />
              
              <div className="flex flex-wrap gap-1.5 justify-center">
                {seg.common.map(val => (
                  <button
                    key={val}
                    onClick={() => updatePart(seg.id, val)}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-colors border ${parts[seg.id] === val ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white border-transparent' : 'bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}