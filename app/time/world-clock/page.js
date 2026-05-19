'use client';
import { useState, useEffect } from 'react';

export default function WorldClock() {
  const [time, setTime] = useState(null);

  const timezones = [
    { name: 'Local', zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { name: 'Jakarta', zone: 'Asia/Jakarta' },
    { name: 'Tokyo', zone: 'Asia/Tokyo' },
    { name: 'London', zone: 'Europe/London' },
    { name: 'New York', zone: 'America/New_York' }
  ];

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="text-neutral-500 animate-pulse">Synchronizing clocks...</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">World Clock</h1>
      <p className="text-neutral-500 mb-8">Current local times across global hubs.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timezones.map((tz, index) => (
          <div key={index} className="p-5 border border-neutral-200 rounded-xl bg-white flex justify-between items-center hover:border-neutral-300 transition">
            <div>
              <h2 className="font-medium text-neutral-900">{tz.name}</h2>
              <p className="text-xs text-neutral-400 mt-1">{tz.zone}</p>
            </div>
            <div className="text-2xl font-mono tracking-tight text-neutral-800">
              {time.toLocaleTimeString('en-US', { timeZone: tz.zone, hour12: false })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}