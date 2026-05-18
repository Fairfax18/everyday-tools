'use client';

import { useState, useEffect } from 'react';

export default function WorldClock() {
  const [time, setTime] = useState(null);

  // We define a few initial timezones. 
  const timezones = [
    { name: 'Local Time', zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { name: 'Jakarta (WIB)', zone: 'Asia/Jakarta' },
    { name: 'Seoul', zone: 'Asia/Seoul' },
    { name: 'London', zone: 'Europe/London' },
    { name: 'New York', zone: 'America/New_York' }
  ];

  useEffect(() => {
    // Update the clock every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="p-8 text-center text-gray-500">Loading clocks...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">World Clock</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {timezones.map((tz, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">{tz.name}</h2>
                <p className="text-sm text-gray-400">{tz.zone}</p>
              </div>
              <div className="text-2xl font-mono font-bold text-blue-600">
                {time.toLocaleTimeString('en-US', { timeZone: tz.zone, hour12: false })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}