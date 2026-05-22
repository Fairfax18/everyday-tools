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

  // Compact format for summary cards (e.g., Rp 28,6 M)
  const formatCompactMoney = (amount) => {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      notation: 'compact',
      maximumFractionDigits: 2, // Allowed an extra decimal for precision
    }).format(amount || 0);
  };

  return (
    // UPDATED: Expanded to max-w-7xl for a true dashboard feel
    <div className="max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Dividend & Investment</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">Model compound growth and dividend yields over time.</p>
        </div>
        
        {/* Currency Selector */}
        <div className="w-full md:w-64 shrink-0">
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Currency Engine</label>
          <select 
            value={currency.code}
            onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value))}
            className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition shadow-sm font-medium cursor-pointer"
          >
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </div>
      </div>
      
      {/* UPDATED: Increased gap to 12 for better separation between controls and charts */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Parameters */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm sticky top-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Starting Principal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">{currency.code === 'IDR' ? 'Rp' : currency.code === 'JPY' ? '¥' : currency.code === 'EUR' ? '€' : currency.code === 'GBP' ? '£' : '$'}</span>
                  <input 
                    type="number" min="0" step="1000"
                    value={principal} onChange={(e) => setPrincipal(e.target.value)}
                    className="w-full p-3 pl-12 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition font-mono text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Monthly Contribution</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">{currency.code === 'IDR' ? 'Rp' : currency.code === 'JPY' ? '¥' : currency.code === 'EUR' ? '€' : currency.code === 'GBP' ? '£' : '$'}</span>
                  <input 
                    type="number" min="0" step="100"
                    value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="w-full p-3 pl-12 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition font-mono text-lg"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Time Horizon</label>
                  <span className="text-sm font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{years} Years</span>
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
                    <span className="block text-[10px] font-bold text-neutral-500 mb-1">Growth Yield</span>
                    <div className="relative">
                      <input 
                        type="number" min="0" step="0.1"
                        value={annualGrowth} onChange={(e) => setAnnualGrowth(e.target.value)}
                        className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white font-mono text-lg"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">%</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-neutral-500 mb-1">Dividend Yield</span>
                    <div className="relative">
                      <input 
                        type="number" min="0" step="0.1"
                        value={dividendYield} onChange={(e) => setDividendYield(e.target.value)}
                        className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white font-mono text-lg"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">%</span>
                    </div>
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
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      Reinvest Dividends
                    </span>
                    <span className="text-[10px] text-neutral-500">Enable DRIP compounding</span>
                  </div>
                </label>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Breakdown */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col space-y-8">
          
          {/* Top Summary Cards - UPDATED TO PREVENT OVERLAP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            <div className="p-6 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-sm min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Total Invested</p>
              <p className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white tabular-nums truncate tracking-tight" title={formatMoney(projection.totalInvested)}>
                {formatCompactMoney(projection.totalInvested)}
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-sm min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Capital Gains</p>
              <p className="text-2xl lg:text-3xl font-bold text-emerald-500 dark:text-emerald-400 tabular-nums truncate tracking-tight" title={`+${formatMoney(projection.totalGrowth)}`}>
                +{formatCompactMoney(projection.totalGrowth)}
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-sm min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Total Dividends</p>
              <p className="text-2xl lg:text-3xl font-bold text-blue-500 dark:text-blue-400 tabular-nums truncate tracking-tight" title={formatMoney(projection.totalDividends)}>
                {formatCompactMoney(projection.totalDividends)}
              </p>
            </div>
            
            <div className="p-6 bg-neutral-900 dark:bg-white border border-neutral-800 dark:border-neutral-200 rounded-3xl shadow-xl min-w-0 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 dark:bg-black/5 rounded-full blur-2xl pointer-events-none"></div>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Final Balance</p>
              <p className="text-3xl lg:text-4xl font-extrabold text-white dark:text-neutral-900 tabular-nums truncate tracking-tighter" title={formatMoney(projection.finalBalance)}>
                {formatCompactMoney(projection.finalBalance)}
              </p>
            </div>
          </div>

          {/* Visual Growth Chart - UPDATED HEIGHT */}
          <div className="bg-white dark:bg-[#111] p-6 md:p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex-1 flex flex-col min-h-[400px]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-8">Portfolio Trajectory</h3>
            
            <div className="flex-1 flex items-end justify-between gap-1 md:gap-2 h-80 md:h-96 border-b border-neutral-100 dark:border-neutral-800 pb-2">
              {projection.yearlyData.map((data, idx) => {
                const totalHeightPct = (data.balance / projection.maxBalance) * 100;
                
                return (
                  <div key={data.year} className="relative group w-full flex flex-col justify-end items-center h-full">
                    {/* Hover Tooltip - UPDATED with whitespace-nowrap so long IDR numbers don't wrap awkwardly */}
                    <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm p-4 rounded-xl shadow-2xl pointer-events-none border border-neutral-700 dark:border-neutral-200">
                      <p className="font-bold mb-2 border-b border-neutral-700 dark:border-neutral-200 pb-2 uppercase tracking-widest text-[10px] text-neutral-400">Year {data.year}</p>
                      <p className="font-mono font-bold">Bal: {formatMoney(data.balance)}</p>
                      <p className="text-blue-400 dark:text-blue-600 font-mono font-bold mt-1">Div: {formatMoney(data.yearlyDividend)}</p>
                    </div>
                    
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

        </div>
      </div>
    </div>
  );
}