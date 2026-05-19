'use client';
import { useState } from 'react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJSON = (space) => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, space));
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      if (window.showToast) window.showToast('JSON copied to clipboard');
    }
  };

  // Custom lightweight syntax highlighter
  const renderHighlightedJSON = () => {
    if (!output) return null;

    // 1. Escape HTML to prevent XSS attacks if users paste malicious strings
    let html = output.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // 2. Use Regex to find JSON tokens and wrap them in Tailwind color classes
    html = html.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'text-blue-600 dark:text-blue-400'; // Default to number color
      
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-neutral-900 dark:text-white font-semibold'; // Keys
        } else {
          cls = 'text-green-600 dark:text-green-400'; // Strings
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-orange-500 dark:text-orange-400 font-medium'; // Booleans
      } else if (/null/.test(match)) {
        cls = 'text-red-500 dark:text-red-400 opacity-80 italic'; // Null values
      }
      
      return `<span class="${cls}">${match}</span>`;
    });

    // 3. Render the HTML safely
    return <pre dangerouslySetInnerHTML={{ __html: html }} className="whitespace-pre-wrap font-mono text-sm leading-relaxed" />;
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">JSON Formatter</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Format, validate, and highlight JSON data instantly.</p>
      
      <div className="grid lg:grid-cols-2 gap-6 h-[600px]">
        
        {/* Input Section */}
        <div className="flex flex-col h-full bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm flex-1">
          <div className="flex justify-between items-center p-4 border-b border-neutral-100 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/30">
            <label className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Input Data</label>
            <button 
              onClick={() => { setInput(''); setOutput(''); setError(''); }} 
              className="text-xs font-medium text-neutral-400 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          </div>
          
          <textarea
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"paste": "your messy JSON here"}'
            className="flex-1 w-full p-4 font-mono text-sm bg-transparent outline-none resize-none text-neutral-800 dark:text-neutral-200"
          />
          
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900/30 border-t border-neutral-100 dark:border-neutral-800/50 flex gap-3">
            <button 
              onClick={() => formatJSON(2)} 
              className="flex-1 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-md"
            >
              Prettify
            </button>
            <button 
              onClick={() => formatJSON(0)} 
              className="flex-1 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              Minify
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col h-full bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm flex-1">
          <div className="flex justify-between items-center p-4 border-b border-neutral-100 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/30">
            <label className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Output Result</label>
            {output && !error && (
              <button 
                onClick={copyToClipboard} 
                className="text-xs font-bold text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-800 px-3 py-1.5 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              >
                Copy JSON
              </button>
            )}
          </div>
          
          <div className="flex-1 p-4 overflow-auto">
            {error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 flex flex-col gap-2">
                <div className="font-bold flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  Invalid JSON
                </div>
                <p className="font-mono text-sm opacity-90">{error}</p>
              </div>
            ) : output ? (
              renderHighlightedJSON()
            ) : (
              <p className="text-neutral-400 dark:text-neutral-600 text-sm font-mono italic">
                // Valid JSON output will appear here...
              </p>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}