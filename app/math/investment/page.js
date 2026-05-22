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

  // --- Formatting Helpers ---
  const isZeroDecimal = ['IDR', 'JPY'].includes(currency.code);

  // Full format for tooltips (e.g., Rp 28.583.565.689)
  const formatMoney = (amount) => {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2,
    }).format(amount || 0);
  };

  // Compact format for tiny summary cards (e.g., Rp 28,6 M)
  const formatCompactMoney = (amount) => {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount || 0);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dividend & Investment</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Model compound growth and dividend yields over time.</p>
        </div>
        
        {/* Currency Selector */}
        <div className="w-full md:w-48">
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Currency</label>
          <select 
            value={currency.code}
            onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value))}
            className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition"
          >
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Parameters */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Starting Principal</label>
                <input 
                  type="number" min="0" step="1000"
                  value={principal} onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Monthly Contribution</label>
                <input 
                  type="number" min="0" step="100"
                  value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Time Horizon</label>
                  <span className="text-xs font-bold">{years} Years</span>
                </div>
                <input 
                  type="range" min="1" max="40" 
                  value={years} onChange={(e) => setYears(e.target.value)}
                  className="w-full cursor-pointer accent-neutral-900 dark:accent-white"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Asset Profile</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-bold text-neutral-500 mb-1">Growth (%)</span>
                    <input 
                      type="number" min="0" step="0.1"
                      value={annualGrowth} onChange={(e) => setAnnualGrowth(e.target.value)}
                      className="w-full p-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-neutral-500 mb-1">Dividend (%)</span>
                    <input 
                      type="number" min="0" step="0.1"
                      value={dividendYield} onChange={(e) => setDividendYield(e.target.value)}
                      className="w-full p-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center space-x-3 cursor-pointer group pt-2">
                <input 
                  type="checkbox" 
                  checked={reinvest} onChange={() => setReinvest(!reinvest)}
                  className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-neutral-900 cursor-pointer" 
                />
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition">
                  Reinvest Dividends (DRIP)
                </span>
              </label>

            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Breakdown */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Top Summary Cards USING COMPACT MONEY */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Total Invested</p>
              <p className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white tabular-nums tracking-tight">{formatCompactMoney(projection.totalInvested)}</p>
            </div>
            <div className="p-4 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Capital Gains</p>
              <p className="text-xl md:text-2xl font-bold text-emerald-500 dark:text-emerald-400 tabular-nums tracking-tight">+{formatCompactMoney(projection.totalGrowth)}</p>
            </div>
            <div className="p-4 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Total Dividends</p>
              <p className="text-xl md:text-2xl font-bold text-blue-500 dark:text-blue-400 tabular-nums tracking-tight">{formatCompactMoney(projection.totalDividends)}</p>
            </div>
            <div className="p-4 bg-neutral-900 dark:bg-white border border-neutral-800 dark:border-neutral-200 rounded-2xl shadow-lg">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">Final Balance</p>
              <p className="text-xl md:text-2xl font-extrabold text-white dark:text-neutral-900 tabular-nums tracking-tight">{formatCompactMoney(projection.finalBalance)}</p>
            </div>
          </div>

          {/* Visual Growth Chart USING FULL MONEY IN TOOLTIPS */}
          <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex-1 flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Portfolio Trajectory</h3>
            
            <div className="flex-1 flex items-end justify-between gap-1 h-64 border-b border-neutral-100 dark:border-neutral-800 pb-2">
              {projection.yearlyData.map((data, idx) => {
                const totalHeightPct = (data.balance / projection.maxBalance) * 100;
                
                return (
                  <div key={data.year} className="relative group w-full flex flex-col justify-end items-center h-full">
                    {/* Hover Tooltip - Shows full un-abbreviated number */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-max bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs p-3 rounded-lg shadow-xl pointer-events-none">
                      <p className="font-bold mb-1 border-b border-neutral-700 dark:border-neutral-200 pb-1">Year {data.year}</p>
                      <p className="font-mono">Bal: {formatMoney(data.balance)}</p>
                      <p className="text-blue-400 dark:text-blue-600 font-mono mt-1">Div: {formatMoney(data.yearlyDividend)}</p>
                    </div>
                    
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${totalHeightPct}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.02 }}
                      className="w-full max-w-[24px] bg-neutral-200 dark:bg-neutral-800 rounded-t-md hover:bg-neutral-400 dark:hover:bg-neutral-600 transition-colors"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-xs font-mono text-neutral-400">
              <span>Year 1</span>
              <span>Year {Math.floor(years / 2)}</span>
              <span>Year {years}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}