'use client';
import { useState, useEffect } from 'react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setCopied(false);
  };

  // Generate a password on first load
  useEffect(() => {
    generatePassword();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Secure Password Generator</h1>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          
          {/* Password Display */}
          <div className="relative mb-6">
            <input 
              type="text" 
              value={password} 
              readOnly 
              className="w-full text-2xl font-mono p-4 pr-24 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-800"
            />
            <button 
              onClick={copyToClipboard}
              className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-4 mb-8 text-gray-700">
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium">Password Length</label>
                <span className="font-bold text-blue-600">{length}</span>
              </div>
              <input 
                type="range" 
                min="8" 
                max="32" 
                value={length} 
                onChange={(e) => setLength(e.target.value)} 
                className="w-full cursor-pointer"
              />
            </div>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} className="w-5 h-5 text-blue-600" />
              <span>Include Uppercase Letters</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="w-5 h-5 text-blue-600" />
              <span>Include Numbers</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="w-5 h-5 text-blue-600" />
              <span>Include Symbols</span>
            </label>
          </div>

          <button 
            onClick={generatePassword}
            className="w-full py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition text-lg"
          >
            Generate New Password
          </button>
        </div>
      </div>
    </div>
  );
}