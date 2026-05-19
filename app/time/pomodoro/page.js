'use client';
import { useState, useEffect, useCallback } from 'react';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'

  // 1. Web Audio API Chime Synthesizer (No MP3 required!)
  const playChime = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      
      const playNote = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine'; // Smooth, pure tone
        osc.frequency.value = freq;
        
        // Envelope for a bell-like fade out
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Play a pleasant double chime (A5 then C#6)
      playNote(880, ctx.currentTime, 1.5); 
      playNote(1108.73, ctx.currentTime + 0.3, 1.5); 
    } catch (e) {
      console.log("Audio not supported or blocked", e);
    }
  }, []);

  // 2. Native Browser Notification
  const triggerNotification = useCallback((message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Everyday Tools', { 
        body: message,
        icon: '/icon.svg' // Uses the sleek logo we created earlier
      });
    }
    // Also show our sleek in-app toast
    if (window.showToast) window.showToast(message);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 3. Dynamic Browser Tab Title
  useEffect(() => {
    const timeString = formatTime(timeLeft);
    const modeString = mode === 'work' ? 'Focus' : 'Break';
    document.title = isActive ? `(${timeString}) ${modeString} - Everyday Tools` : 'Pomodoro Timer | Everyday Tools';
    
    // Cleanup title on unmount
    return () => { document.title = 'Everyday Tools'; };
  }, [timeLeft, isActive, mode]);

  // Main Timer Countdown Logic
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((time) => time - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      // Session Ended!
      setIsActive(false);
      playChime();
      
      if (mode === 'work') {
        triggerNotification("Focus session complete! Time for a 5-minute break.");
      } else {
        triggerNotification("Break is over! Ready to focus?");
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, playChime, triggerNotification]);

  const toggleTimer = () => {
    // Request notification permission on first user interaction
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };
  
  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="max-w-2xl mx-auto text-center mt-10 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Focus Timer</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Enhance productivity using timeboxing.</p>
      
      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => switchMode('work')} 
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'work' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md' : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'}`}
        >
          Work (25m)
        </button>
        <button 
          onClick={() => switchMode('break')} 
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'break' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md' : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'}`}
        >
          Break (5m)
        </button>
      </div>

      <div className="text-[7rem] md:text-[10rem] font-bold tracking-tighter text-neutral-900 dark:text-white font-mono mb-12 tabular-nums">
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={toggleTimer} 
          className={`px-10 py-4 rounded-xl font-bold text-lg transition-all ${isActive ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-700' : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-105 shadow-lg'}`}
        >
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button 
          onClick={() => switchMode(mode)} 
          className="px-8 py-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl font-bold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}