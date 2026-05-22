'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar ($)', locale: 'en-US' },
  { code: 'IDR', label: 'Indonesian Rupiah (Rp)', locale: 'id-ID' },
  { code: 'EUR', label: 'Euro (€)', locale: 'en-DE' },
  { code: 'GBP', label: 'British Pound (£)', locale: 'en-GB' },
  { code: 'JPY', label: 'Japanese Yen (¥)', locale: 'ja-JP' },
  { code: 'AUD', label: 'Australian Dollar ($)', locale: 'en-AU' },
  { code: 'SGD', label: 'Singapore Dollar ($)', locale: 'en-SG' },
];

export default function InvestmentCalculator() {
  const [currency, setCurrency] = useState(CURRENCIES[1]); // Default to IDR
  const [principal, setPrincipal] = useState(10000000);
  const [monthlyContribution, setMonthlyContribution] = useState(1500000);
  const [years, setYears] = useState(10);
  const [annualGrowth, setAnnualGrowth] = useState(6);
  const [dividendYield, setDividendYield] = useState(5);
  const [reinvest, setReinvest] = useState(true);

  // --- Financial Math Engine ---
  const projection = useMemo(() => {
    let currentBalance = Number(principal) || 0;
    let totalInvested = Number(principal) || 0;
    let totalDividends = 0;
    const yearlyData = [];
    
    const mContribute = Number(monthlyContribution) || 0;
    const growthRate = (Number(annualGrowth) || 0) / 100;
    const divRate = (Number(dividendYield) || 0) / 100;

    for (let y = 1; y <= (Number(years) || 1); y++) {
      const yearlyContribution = mContribute * 12;
      totalInvested += yearlyContribution;
      currentBalance += yearlyContribution;

      const capitalGain = currentBalance * growthRate;
      currentBalance += capitalGain;

      const dividend = currentBalance * divRate;
      totalDividends += dividend;
      
      if (reinvest) {
        currentBalance += dividend;
      }

      yearlyData.push({
        year: y,
        balance: currentBalance,
        invested: totalInvested,
        yearlyDividend: dividend,
        totalDividends: totalDividends
      });
    }

    const maxBalance = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].balance : 0;

    return { 
      finalBalance: currentBalance, 
      totalInvested, 
      totalDividends,
      totalGrowth: currentBalance - totalInvested - (reinvest ? 0 : totalDividends),
      yearlyData,
      maxBalance
    };
  }, [principal, monthlyContribution, years, annualGrowth, dividendYield, reinvest]);

  // Exact Number Formatting (No more compact abbreviations)
  const isZeroDecimal = ['IDR', 'JPY'].includes(currency.code);
  const formatMoney = (amount) => {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2,
    }).format(amount || 0);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dividend & Investment</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Model compound growth and dividend yields over time.</p>
        </div>
        
        {/* Universal Currency Selector */}
        <div className="w-full md:w-56 shrink-0">
          <select 
            value={currency.code}
            onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value))}
            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition shadow-sm font-bold cursor-pointer"
          >
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm sticky top-8">
            <div className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Starting Principal</label>
                <input 
                  type="number" min="0" step="1000"
                  value={principal} onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition font-mono text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Monthly Contribution</label>
                <input 
                  type="number" min="0" step="100"
                  value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition font-mono text-lg"
                />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Time Horizon</label>
                  <span className="text-sm font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-900 dark:text-white">{years} Years</span>
                </div>
                <input 
                  type="range" min="1" max="40" 
                  value={years} onChange={(e) => setYears(e.target.value)}
                  className="w-full cursor-pointer accent-neutral-900 dark:accent-white"
                />
              </div>

              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Asset Profile</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-bold text-neutral-500 mb-1">Growth Yield (%)</span>
                    <input 
                      type="number" min="0" step="0.1"
                      value={annualGrowth} onChange={(e) => setAnnualGrowth(e.target.value)}
                      className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white font-mono text-lg"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-neutral-500 mb-1">Dividend Yield (%)</span>
                    <input 
                      type="number" min="0" step="0.1"
                      value={dividendYield} onChange={(e) => setDividendYield(e.target.value)}
                      className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white font-mono text-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-4 cursor-pointer group p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={reinvest} onChange={() => setReinvest(!reinvest)}
                    className="w-6 h-6 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-neutral-900 cursor-pointer shrink-0" 
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">Reinvest Dividends</span>
                    <span className="text-[10px] text-neutral-500">Enable DRIP compounding</span>
                  </div>
                </label>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: The "Hero" Canvas */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-sm flex flex-col overflow-hidden h-full">
            
            {/* 1. Hero Final Balance (No rigid boxes, text wraps beautifully) */}
            <div className="p-8 md:p-10 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20">
              <p className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-3">Projected Portfolio Value</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-neutral-900 dark:text-white break-words leading-tight">
                {formatMoney(projection.finalBalance)}
              </h2>
            </div>

            {/* 2. Portfolio Chart */}
            <div className="p-8 md:p-10 flex-1 min-h-[320px] flex flex-col">
              <div className="flex-1 flex items-end justify-between gap-1 md:gap-2 h-full border-b border-neutral-100 dark:border-neutral-800 pb-2">
                {projection.yearlyData.map((data, idx) => {
                  const totalHeightPct = (data.balance / projection.maxBalance) * 100;
                  return (
                    <div key={data.year} className="relative group w-full flex flex-col justify-end items-center h-full">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm p-4 rounded-xl shadow-2xl pointer-events-none border border-neutral-700 dark:border-neutral-200">
                        <p className="font-bold mb-2 border-b border-neutral-700 dark:border-neutral-200 pb-2 uppercase tracking-widest text-[10px] text-neutral-400">Year {data.year}</p>
                        <p className="font-mono font-bold">Bal: {formatMoney(data.balance)}</p>
                        <p className="text-blue-400 dark:text-blue-600 font-mono font-bold mt-1">Div: {formatMoney(data.yearlyDividend)}</p>
                      </div>
                      
                      {/* Interactive Bar */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${totalHeightPct}%` }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.015 }}
                        className="w-full max-w-[32px] bg-neutral-200 dark:bg-neutral-800 rounded-t-lg group-hover:bg-neutral-900 dark:group-hover:bg-white transition-colors cursor-crosshair"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
                <span>Year 1</span>
                <span>Year {Math.floor(years / 2)}</span>
                <span>Year {years}</span>
              </div>
            </div>

            {/* 3. Spacious Stats Footer */}
            <div className="bg-neutral-50 dark:bg-neutral-900/40 p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-neutral-100 dark:border-neutral-800">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Total Invested</p>
                <p className="text-xl font-bold font-mono text-neutral-900 dark:text-white break-words">{formatMoney(projection.totalInvested)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Capital Gains</p>
                <p className="text-xl font-bold font-mono text-emerald-500 dark:text-emerald-400 break-words">+{formatMoney(projection.totalGrowth)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Total Dividends</p>
                <p className="text-xl font-bold font-mono text-blue-500 dark:text-blue-400 break-words">{formatMoney(projection.totalDividends)}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}