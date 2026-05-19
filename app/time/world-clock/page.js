'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorldClock() {
  const [time, setTime] = useState(null);
  const [clocks, setClocks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch all available global timezones natively
  const allTimezones = typeof Intl !== 'undefined' && Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : [];

  // Helper to format raw timezones (e.g., "America/New_York" -> "New York")
  const formatCityName = (tz) => {
    if (tz === Intl.DateTimeFormat().resolvedOptions().timeZone) return 'Local Time';
    const parts = tz.split('/');
    return parts[parts.length - 1].replace(/_/g, ' ');
  };

  // 2. Load custom dashboard from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('everyday-clocks');
    if (saved) {
      setClocks(JSON.parse(saved));
    } else {
      // Default initial dashboard
      const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setClocks([
        { name: 'Local Time', zone: localZone },
        { name: 'Jakarta', zone: 'Asia/Jakarta' },
        { name: 'London', zone: 'Europe/London' },
        { name: 'New York', zone: 'America/New_York' }
      ]);
    }
    setIsLoaded(true);

    // Master ticking clock
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Save to LocalStorage whenever clocks change
  useEffect(() => {
    if (isLoaded) localStorage.setItem('everyday-clocks', JSON.stringify(clocks));
  }, [clocks, isLoaded]);

  const addClock = (zone) => {
    if (!clocks.find(c => c.zone === zone)) {
      setClocks([...clocks, { name: formatCityName(zone), zone }]);
    }
    setShowAddMenu(false);
    setSearchQuery('');
  };

  const removeClock = (zoneToRemove) => {
    setClocks(clocks.filter(c => c.zone !== zoneToRemove));
  };

  // Filter timezones based on search (limit to 50 for performance)
  const filteredZones = allTimezones
    .filter(tz => tz.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 50);

  if (!isLoaded || !time) return <div className="text-neutral-500 animate-pulse">Synchronizing clocks...</div>;

  return (
    <div className="max-w-4xl animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">World Clock</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Customize your global timezone dashboard.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {clocks.map((tz) => (
            <motion.div 
              key={tz.zone}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group relative p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#111] flex justify-between items-center hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
            >
              <div>
                <h2 className="font-medium text-neutral-900 dark:text-white text-lg">{tz.name}</h2>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{tz.zone.replace(/\//g, ' / ')}</p>
              </div>
              <div className="text-3xl font-mono tracking-tighter text-neutral-800 dark:text-neutral-100 tabular-nums">
                {time.toLocaleTimeString('en-US', { timeZone: tz.zone, hour12: false })}
              </div>
              
              {/* Delete Button (Appears on Hover) */}
              <button 
                onClick={() => removeClock(tz.zone)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm flex items-center justify-center font-bold"
                title="Remove clock"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* The "Add Clock" Interface */}
        {showAddMenu ? (
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 flex flex-col h-full min-h-[120px]"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Add City</span>
              <button onClick={() => setShowAddMenu(false)} className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white">Cancel</button>
            </div>
            
            <input 
              autoFocus
              type="text" 
              placeholder="Search Tokyo, Paris..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 mb-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition"
            />
            
            <div className="flex-1 overflow-y-auto max-h-32 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#111]">
              {filteredZones.length === 0 ? (
                <p className="p-3 text-xs text-neutral-400 text-center">No cities found.</p>
              ) : (
                filteredZones.map(zone => (
                  <button 
                    key={zone} 
                    onClick={() => addClock(zone)}
                    className="w-full text-left p-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition"
                  >
                    {formatCityName(zone)}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.button 
            layout
            onClick={() => setShowAddMenu(true)}
            className="p-5 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col justify-center items-center text-neutral-400 dark:text-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-all min-h-[120px]"
          >
            <span className="text-2xl mb-1">+</span>
            <span className="text-sm font-medium">Add Timezone</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}