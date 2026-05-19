'use client';
import { useState } from 'react';

export default function DateCalculator() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const calculateDifference = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      days: diffDays,
      weeks: Math.floor(diffDays / 7),
      months: (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    };
  };

  const diff = calculateDifference();

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Date Calculator</h1>
      <p className="text-neutral-500 mb-8">Find the distance between two dates.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Start Date</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">End Date</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
          />
        </div>
      </div>

      {diff && (
        <div className="p-6 border border-neutral-200 rounded-xl bg-white">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">Result</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-neutral-900">{diff.days}</p>
              <p className="text-sm text-neutral-500 mt-1">Days</p>
            </div>
            <div className="border-l border-r border-neutral-100">
              <p className="text-3xl font-bold text-neutral-900">{diff.weeks}</p>
              <p className="text-sm text-neutral-500 mt-1">Weeks</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-neutral-900">{Math.abs(diff.months)}</p>
              <p className="text-sm text-neutral-500 mt-1">Months</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}