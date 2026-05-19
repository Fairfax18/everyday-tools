'use client';
import { useState } from 'react';

export default function UnitConverter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');

  const units = {
    meters: 1,
    feet: 3.28084,
    inches: 39.3701,
    kilometers: 0.001,
    miles: 0.000621371
  };

  const convert = () => {
    if (!value) return '';
    const baseValue = parseFloat(value) / units[fromUnit];
    return (baseValue * units[toUnit]).toFixed(4);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Unit Converter</h1>
      <p className="text-neutral-500 mb-8">Quickly convert lengths and distances.</p>
      
      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Amount</label>
            <input 
              type="number" 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.00"
              className="w-full p-3 text-lg rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full">
            <label className="block text-sm font-medium text-neutral-700 mb-2">From</label>
            <select 
              value={fromUnit} 
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-3 rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            >
              {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          
          <div className="hidden md:block mt-6 text-neutral-400">➔</div>
          
          <div className="w-full">
            <label className="block text-sm font-medium text-neutral-700 mb-2">To</label>
            <select 
              value={toUnit} 
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-3 rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            >
              {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {value && (
          <div className="mt-8 p-4 bg-neutral-50 border border-neutral-100 rounded-lg text-center">
            <p className="text-sm text-neutral-500 mb-1">Result</p>
            <p className="text-3xl font-bold text-neutral-900">{convert()} <span className="text-lg font-normal text-neutral-500">{toUnit}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}