'use client';
import { useState } from 'react';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Case Converter</h1>
      <p className="text-neutral-500 mb-8">Instantly convert text between different letter cases.</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setText(text.toUpperCase())} className="px-4 py-2 text-sm font-medium bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg transition">UPPERCASE</button>
        <button onClick={() => setText(text.toLowerCase())} className="px-4 py-2 text-sm font-medium bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg transition">lowercase</button>
        <button onClick={() => setText(toTitleCase(text))} className="px-4 py-2 text-sm font-medium bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg transition">Title Case</button>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-64 p-5 pb-16 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition resize-y text-neutral-800"
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          {text && (
            <button onClick={() => setText('')} className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition">
              Clear
            </button>
          )}
          <button 
            onClick={copyToClipboard}
            className="px-6 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg transition"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}