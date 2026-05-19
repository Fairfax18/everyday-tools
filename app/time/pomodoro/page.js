'use client';
import { useState, useEffect } from 'react';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((time) => time - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-2xl mx-auto text-center mt-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Focus Timer</h1>
      <p className="text-neutral-500 mb-8">Enhance productivity using timeboxing.</p>
      
      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => switchMode('work')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${mode === 'work' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>Work (25m)</button>
        <button onClick={() => switchMode('break')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${mode === 'break' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>Break (5m)</button>
      </div>

      <div className="text-8xl md:text-[10rem] font-bold tracking-tighter text-neutral-900 font-mono mb-12">
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={toggleTimer} className="px-8 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition">
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => switchMode(mode)} className="px-8 py-3 bg-white border border-neutral-200 text-neutral-600 rounded-lg font-medium hover:bg-neutral-50 hover:text-neutral-900 transition">
          Reset
        </button>
      </div>
    </div>
  );
}