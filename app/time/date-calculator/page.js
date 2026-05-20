'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DateCalculator() {
  const [mode, setMode] = useState('add'); // 'add' or 'diff'
  
  // Get today's date formatted for HTML input (YYYY-MM-DD)
  const todayStr = new Date().toLocaleDateString('en-CA');
  
  // State
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [amount, setAmount] = useState(14);
  const [action, setAction] = useState('add'); // 'add' or 'sub'
  const [businessDaysOnly, setBusinessDaysOnly] = useState(true);

  // --- Date Math Helpers ---
  // Safely parse "YYYY-MM-DD" into local timezone to avoid UTC shift bugs
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-');
    return new Date(y, m - 1, d);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }).format(date);
  };

  // --- Calculations ---
  const result = useMemo(() => {
    if (mode === 'add') {
      let current = parseDate(startDate);
      let count = 0;
      const step = action === 'add' ? 1 : -1;
      const target = Math.max(0, parseInt(amount) || 0);

      if (!businessDaysOnly) {
        current.setDate(current.getDate() + (target * step));
      } else {
        while (count < target) {
          current.setDate(current.getDate() + step);
          // 0 is Sunday, 6 is Saturday
          if (current.getDay() !== 0 && current.getDay() !== 6) {
            count++;
          }
        }
      }
      return { finalDate: current };
    } 
    
    // Mode: Difference Between Dates
    else {
      let start = parseDate(startDate);
      let end = parseDate(endDate);
      
      // Swap if start is after end
      const isNegative = start > end;
      if (isNegative) {
        const temp = start;
        start = end;
        end = temp;
      }

      let totalDays = 0;
      let bizDays = 0;
      let current = new Date(start);

      while (current < end) {
        current.setDate(current.getDate() + 1);
        totalDays++;
        if (current.getDay() !== 0 && current.getDay() !== 6) bizDays++;
      }

      // Progress Bar Logic (if start is in the past and end is in the future)
      const now = new Date();
      now.setHours(0,0,0,0);
      let progress = 0;
      let status = 'Completed';
      
      if (now < start) status = 'Upcoming';
      else if (now >= start && now <= end) {
        status = 'In Progress';
        progress = ((now - start) / (end - start)) * 100;
      }

      return { 
        totalDays: isNegative ? -totalDays : totalDays, 
        bizDays: isNegative ? -bizDays : bizDays,
        progress,
        status,
        isNegative
      };
    }
  }, [mode, startDate, endDate, amount, action, businessDaysOnly]);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Date Calculator</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Calculate strict deadlines and business day intervals.</p>
      
      <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        
        {/* Mode Toggle */}
        <div className="flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg mb-8 max-w-sm">
          <button 
            onClick={() => setMode('add')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'add' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
          >
            Add / Subtract
          </button>
          <button 
            onClick={() => setMode('diff')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'diff' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
          >
            Duration
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'add' ? (
            <motion.div key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              
              {/* Inputs */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Start Date</label>
                  <input 
                    type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Action</label>
                  <select 
                    value={action} onChange={(e) => setAction(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition text-neutral-900 dark:text-white"
                  >
                    <option value="add">Add (+)</option>
                    <option value="sub">Subtract (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Amount</label>
                  <div className="relative">
                    <input 
                      type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition text-neutral-900 dark:text-white"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">Days</span>
                  </div>
                </div>
              </div>

              {/* Options */}
              <label className="flex items-center space-x-3 cursor-pointer group w-fit">
                <input 
                  type="checkbox" checked={businessDaysOnly} onChange={() => setBusinessDaysOnly(!businessDaysOnly)}
                  className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-neutral-900 cursor-pointer" 
                />
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition">Business Days Only (Skip Weekends)</span>
              </label>

              {/* Results */}
              <div className="p-8 bg-neutral-900 dark:bg-white rounded-2xl text-center shadow-lg">
                <p className="text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest text-xs mb-2">Resulting Date</p>
                <p className="text-2xl md:text-4xl font-extrabold text-white dark:text-neutral-900 tracking-tight">
                  {formatDate(result.finalDate)}
                </p>
              </div>

            </motion.div>
          ) : (
            <motion.div key="diff" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              
              {/* Inputs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Start Date</label>
                  <input 
                    type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">End Date</label>
                  <input 
                    type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Total Calendar Days</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-white">{result.totalDays}</p>
                </div>
                <div className="p-6 bg-neutral-900 dark:bg-white rounded-2xl text-center shadow-md">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">Business Days</p>
                  <p className="text-3xl font-bold text-white dark:text-neutral-900">{result.bizDays}</p>
                </div>
              </div>

              {/* Visual Progress Bar */}
              {result.totalDays > 0 && (
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Timeline Status</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${result.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : result.status === 'Upcoming' ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {result.status}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${result.status === 'Completed' ? 100 : result.status === 'Upcoming' ? 0 : result.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-neutral-400 font-mono">
                    <span>{startDate}</span>
                    {result.status === 'In Progress' && <span>{Math.round(result.progress)}%</span>}
                    <span>{endDate}</span>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}