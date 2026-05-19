'use client';
import { useState, useEffect } from 'react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let charset = "";
    if (options.lower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    if (!charset) return setPassword(''); // Prevent error if nothing selected
    
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setCopied(false);
  };

  useEffect(() => { generate(); }, [length, options]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    
    // Instead of changing button text, trigger the sleek new global toast!
    if (window.showToast) {
      window.showToast('Password copied to clipboard');
    }
  };

  const toggleOption = (key) => setOptions({ ...options, [key]: !options[key] });

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Password Generator</h1>
      <p className="text-neutral-500 mb-8">Create strong, secure passwords instantly.</p>
      
      <div className="bg-white p-6 md:p-8 rounded-xl border border-neutral-200 shadow-sm">
        <div className="relative mb-8 group">
          <input 
            type="text" 
            value={password} 
            readOnly 
            className="w-full text-2xl md:text-3xl font-mono p-4 pr-32 bg-neutral-50 border border-neutral-200 rounded-lg outline-none text-neutral-900 tracking-wider"
          />
          <button 
            onClick={copyToClipboard}
            className="absolute right-2 top-2 bottom-2 px-6 bg-neutral-900 text-white font-medium rounded hover:bg-neutral-800 transition"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium text-neutral-700">Length</label>
              <span className="font-mono bg-neutral-100 px-2 py-1 rounded text-sm text-neutral-900">{length}</span>
            </div>
            <input 
              type="range" min="8" max="64" 
              value={length} 
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full cursor-pointer accent-neutral-900"
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
                  className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer" 
                />
                <span className="text-neutral-600 group-hover:text-neutral-900 transition">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          onClick={generate}
          className="w-full py-4 bg-white border border-neutral-200 text-neutral-900 font-medium rounded-lg hover:bg-neutral-50 hover:border-neutral-300 transition"
        >
          Regenerate Password
        </button>
      </div>
    </div>
  );
}