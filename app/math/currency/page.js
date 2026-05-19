'use client';
import { useState, useEffect } from 'react';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('IDR');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  const currencies = ['USD', 'IDR', 'EUR', 'GBP', 'JPY', 'SGD', 'AUD', 'KRW'];

  useEffect(() => {
    fetch(`https://open.er-api.com/v6/latest/${from}`)
      .then(res => res.json())
      .then(data => {
        setRates(data.rates);
        setLoading(false);
      });
  }, [from]);

  const convertedAmount = rates && amount ? (parseFloat(amount) * rates[to]).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0.00';

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Currency Converter</h1>
      <p className="text-neutral-500 mb-8">Live exchange rates updated daily.</p>
      
      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Amount</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-neutral-700 mb-2">From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full p-3 rounded-lg border border-neutral-200 bg-neutral-50">
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-neutral-700 mb-2">To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full p-3 rounded-lg border border-neutral-200 bg-neutral-50">
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="p-6 bg-neutral-900 rounded-xl text-center text-white">
          {loading ? (
            <p className="animate-pulse">Fetching live rates...</p>
          ) : (
            <>
              <p className="text-sm text-neutral-400 mb-1">{amount} {from} =</p>
              <p className="text-4xl font-bold">{convertedAmount} {to}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}