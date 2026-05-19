'use client';
import { useState } from 'react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [error, setError] = useState(false);

  const processText = (text, currentMode) => {
    setInput(text);
    setError(false);
    if (!text) return setOutput('');

    try {
      if (currentMode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch (err) {
      setError(true);
      setOutput('Error: Invalid Base64 string.');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    processText(input, newMode);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Base64 Encoder</h1>
      <p className="text-neutral-500 mb-8">Encode or decode strings in Base64 format.</p>
      
      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <div className="flex gap-2 mb-6 p-1 bg-neutral-100 rounded-lg w-fit">
          <button 
            onClick={() => switchMode('encode')} 
            className={`px-6 py-2 text-sm font-medium rounded-md transition ${mode === 'encode' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Encode
          </button>
          <button 
            onClick={() => switchMode('decode')} 
            className={`px-6 py-2 text-sm font-medium rounded-md transition ${mode === 'decode' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Decode
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Input</label>
            <textarea
              value={input}
              onChange={(e) => processText(e.target.value, mode)}
              placeholder={mode === 'encode' ? "Type text to encode..." : "Paste Base64 to decode..."}
              className="w-full h-32 p-4 font-mono text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition resize-y text-neutral-800"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-neutral-700">Output</label>
              {output && !error && (
                <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-neutral-500 hover:text-neutral-900 transition font-medium">Copy Result</button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              className={`w-full h-32 p-4 font-mono text-sm rounded-xl border resize-y outline-none ${error ? 'border-red-200 bg-red-50 text-red-600' : 'border-neutral-200 bg-white text-neutral-800'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}