'use client';
import { useState } from 'react';

export default function SplitBill() {
  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState(15);
  const [people, setPeople] = useState(2);

  const billAmt = parseFloat(bill) || 0;
  const tipAmt = billAmt * (tipPct / 100);
  const total = billAmt + tipAmt;
  const perPerson = people > 0 ? total / people : 0;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Split Bill & Tip</h1>
      <p className="text-neutral-500 mb-8">Calculate tips and divide the check evenly.</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Total Bill Amount</label>
            <input 
              type="number" 
              value={bill} 
              onChange={(e) => setBill(e.target.value)}
              placeholder="0.00"
              className="w-full p-3 rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-neutral-700">Tip Percentage</label>
              <span className="font-bold text-neutral-900">{tipPct}%</span>
            </div>
            <input 
              type="range" min="0" max="30" step="5" 
              value={tipPct} 
              onChange={(e) => setTipPct(Number(e.target.value))}
              className="w-full cursor-pointer accent-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Number of People</label>
            <div className="flex items-center gap-4">
              <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 font-bold">-</button>
              <span className="text-xl font-medium w-8 text-center">{people}</span>
              <button onClick={() => setPeople(people + 1)} className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 font-bold">+</button>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 flex flex-col justify-center text-center">
          <div className="mb-6">
            <p className="text-sm text-neutral-500 mb-1">Total per person</p>
            <p className="text-5xl font-bold text-neutral-900">${perPerson.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-sm text-neutral-500 pt-4 border-t border-neutral-200">
            <span>Total Tip: ${tipAmt.toFixed(2)}</span>
            <span>Total Bill: ${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}