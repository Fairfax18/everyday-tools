'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

// A curated list of common, easy-to-type words for Passphrase Mode
const WORD_LIST = [
  "apple", "river", "mountain", "ocean", "battery", "horse", "staple", "correct",
  "sunset", "desert", "forest", "winter", "summer", "rocket", "planet", "galaxy",
  "window", "coffee", "guitar", "puzzle", "robot", "wizard", "dragon", "castle",
  "ninja", "pirate", "laser", "quantum", "crystal", "shadow", "spirit", "temple",
  "velvet", "breeze", "storm", "thunder", "silver", "golden", "copper", "bronze",
  "eagle", "tiger", "panther", "falcon", "wolf", "bear", "dolphin", "whale",
  "orbit", "comet", "meteor", "nebula", "cosmos", "voyage", "journey", "quest",
  "diamond", "ruby", "sapphire", "emerald", "amber", "pearl", "jade", "opal",
  "piano", "violin", "trumpet", "melody", "rhythm", "harmony", "chorus", "tempo",
  "circle", "square", "triangle", "sphere", "pyramid", "cube", "spiral", "helix",
  "vector", "matrix", "tensor", "scalar", "fractal", "enigma", "cipher", "beacon"
];

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('random'); // 'random' or 'passphrase'
  
  // Random Mode State
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  
  // Passphrase Mode State
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');

  // Calculate Mathematical Entropy
  const entropy = useMemo(() => {
    if (mode === 'random') {
      let poolSize = 0;
      if (options.lower) poolSize += 26;
      if (options.upper) poolSize += 26;
      if (options.numbers) poolSize += 10;
      if (options.symbols) poolSize += 32;
      
      if (poolSize === 0) return 0;
      // Entropy = Length * log2(Pool Size)
      return length * Math.log2(poolSize);
    } else {
      // Entropy = Number of Words * log2(Dictionary Size)
      return wordCount * Math.log2(WORD_LIST.length);
    }
  }, [mode, length, options, wordCount]);

  // Determine Strength UI based on Entropy Bits
  const strength = useMemo(() => {
    if (entropy < 40) return { label: 'Very Weak', color: 'bg-red-500', text: 'text-red-500', pct: 20 };
    if (entropy < 60) return { label: 'Weak', color: 'bg-orange-500', text: 'text-orange-500', pct: 40 };
    if (entropy < 80) return { label: 'Good', color: 'bg-yellow-500', text: 'text-yellow-500', pct: 60 };
    if (entropy < 100) return { label: 'Strong', color: 'bg-green-500', text: 'text-green-500', pct: 80 };
    return { label: 'Excellent', color: 'bg-emerald-500', text: 'text-emerald-500', pct: 100 };
  }, [entropy]);

  const generate = () => {
    if (mode === 'random') {
      let charset = "";
      if (options.lower) charset += "abcdefghijklmnopqrstuvwxyz";
      if (options.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (options.numbers) charset += "0123456789";
      if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
      
      if (!charset) return setPassword(''); 
      
      let newPassword = "";
      // Use crypto.getRandomValues for true cryptographic randomness
      const randomValues = new Uint32Array(length);
      window.crypto.getRandomValues(randomValues);
      
      for (let i = 0; i < length; i++) {
        newPassword += charset[randomValues[i] % charset.length];
      }
      setPassword(newPassword);
    } else {
      const randomValues = new Uint32Array(wordCount);
      window.crypto.getRandomValues(randomValues);
      
      const words = [];
      for (let i = 0; i < wordCount; i++) {
        words.push(WORD_LIST[randomValues[i] % WORD_LIST.length]);
      }
      setPassword(words.join(separator));
    }
  };

  // Regenerate when dependencies change
  useEffect(() => { generate(); }, [mode, length, options, wordCount, separator]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    if (window.showToast) window.showToast('Password copied to clipboard');
  };

  const toggleOption = (key) => setOptions({ ...options, [key]: !options[key] });

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Password Generator</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Create mathematically secure passwords and passphrases.</p>
      
      <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        
        {/* Output & Copy Area */}
        <div className="relative mb-6 group">
          <input 
            type="text" 
            value={password} 
            readOnly 
            className="w-full text-2xl md:text-3xl font-mono p-5 pr-32 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl outline-none text-neutral-900 dark:text-white tracking-wider"
          />
          <button 
            onClick={copyToClipboard}
            className="absolute right-3 top-3 bottom-3 px-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
          >
            Copy
          </button>
        </div>

        {/* Animated Entropy Meter */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-2">
            <span className={`text-sm font-bold uppercase tracking-widest ${strength.text}`}>
              {strength.label}
            </span>
            <span className="text-xs text-neutral-400 font-mono">{Math.round(entropy)} bits of entropy</span>
          </div>
          <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${strength.pct}%`, backgroundColor: strength.color === 'bg-red-500' ? '#ef4444' : strength.color === 'bg-orange-500' ? '#f97316' : strength.color === 'bg-yellow-500' ? '#eab308' : strength.color === 'bg-green-500' ? '#22c55e' : '#10b981' }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full"
            />
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg mb-8">
          <button 
            onClick={() => setMode('random')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'random' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
          >
            Random Characters
          </button>
          <button 
            onClick={() => setMode('passphrase')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'passphrase' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
          >
            Memorable Passphrase
          </button>
        </div>

        {/* Controls based on Mode */}
        {mode === 'random' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mb-8">
            <div>
              <div className="flex justify-between mb-3">
                <label className="font-bold text-neutral-700 dark:text-neutral-300">Length</label>
                <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-sm text-neutral-900 dark:text-white font-bold">{length}</span>
              </div>
              <input 
                type="range" min="8" max="64" 
                value={length} 
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full cursor-pointer accent-neutral-900 dark:accent-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'upper', label: 'Uppercase (A-Z)' },
                { id: 'lower', label: 'Lowercase (a-z)' },
                { id: 'numbers', label: 'Numbers (0-9)' },
                { id: 'symbols', label: 'Symbols (!@#)' },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={options[opt.id]} 
                    onChange={() => toggleOption(opt.id)} 
                    className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-neutral-900 cursor-pointer" 
                  />
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition">{opt.label}</span>
                </label>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mb-8">
            <div>
              <div className="flex justify-between mb-3">
                <label className="font-bold text-neutral-700 dark:text-neutral-300">Word Count</label>
                <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-sm text-neutral-900 dark:text-white font-bold">{wordCount}</span>
              </div>
              <input 
                type="range" min="3" max="8" 
                value={wordCount} 
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full cursor-pointer accent-neutral-900 dark:accent-white"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-3">Separator</label>
              <div className="flex gap-2">
                {[
                  { value: '-', label: 'Hyphen (-)' },
                  { value: '_', label: 'Underscore (_)' },
                  { value: ' ', label: 'Space' },
                  { value: '', label: 'None' }
                ].map((sep) => (
                  <button
                    key={sep.label}
                    onClick={() => setSeparator(sep.value)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${separator === sep.value ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent' : 'bg-white dark:bg-transparent border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
                  >
                    {sep.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <button 
          onClick={generate}
          className="w-full py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-bold rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}