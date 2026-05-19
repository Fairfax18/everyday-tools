'use client';
import { useState } from 'react';

export default function PercentageCalculator() {
  const [pct, setPct] = useState('');
  const [num, setNum] = useState('');

  const result = (parseFloat(pct) && parseFloat(num)) ? (parseFloat(pct) / 100) * parseFloat(num) : null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Percentage Calculator</h1>
      <p className="text-neutral-500 mb-8">Calculate simple percentages instantly.</p>
      
      <div className="bg-white p-6 rounded-xl border border-neutral-200 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-3 w-full">
          <span className="text-neutral-500 font-medium">What is</span>
          <input 
            type="number" 
            value={pct} 
            onChange={(e) => setPct(e.target.value)}
            placeholder="%"
            className="w-24 p-3 rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 text-center"
          />
          <span className="text-neutral-500 font-medium">% of</span>
          <input 
            type="number" 
            value={num} 
            onChange={(e) => setNum(e.target.value)}
            placeholder="Value"
            className="flex-1 p-3 rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      </div>

      {result !== null && (
        <div className="mt-6 p-6 bg-neutral-900 text-white rounded-xl text-center">
          <p className="text-neutral-400 mb-1">{pct}% of {num} is</p>
          <p className="text-5xl font-bold">{result}</p>
        </div>
      )}
    </div>
  );
}