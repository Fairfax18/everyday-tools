'use client';
import { useState } from 'react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJSON = (space) => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, space));
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">JSON Formatter</h1>
      <p className="text-neutral-500 mb-8">Format, validate, and minify JSON data.</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-neutral-700">Input</label>
            <button onClick={() => setInput('')} className="text-xs text-neutral-400 hover:text-red-500 transition">Clear</button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"paste": "your JSON here"}'
            className="w-full h-96 p-4 font-mono text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition resize-none text-neutral-800"
          />
          <div className="flex gap-2 mt-4">
            <button onClick={() => formatJSON(2)} className="flex-1 py-2 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition">Prettify</button>
            <button onClick={() => formatJSON(0)} className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition">Minify</button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-neutral-700">Output</label>
            <button onClick={copyToClipboard} className="text-xs text-neutral-500 hover:text-neutral-900 transition font-medium">Copy Result</button>
          </div>
          <div className={`w-full h-96 p-4 font-mono text-sm rounded-xl border overflow-auto ${error ? 'border-red-200 bg-red-50 text-red-600' : 'border-neutral-200 bg-white text-neutral-800'}`}>
            {error ? (
              <div>
                <strong>Invalid JSON:</strong>
                <p className="mt-2">{error}</p>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap">{output}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}