'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState(null); // { header, payload, signature, raw: [], error }

  const decodeJWT = (jwtString) => {
    setToken(jwtString);
    if (!jwtString.trim()) {
      setDecoded(null);
      return;
    }

    try {
      const parts = jwtString.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT: Must contain 3 parts separated by dots.');

      // Standardize Base64-URL to standard Base64
      const decodeBase64Url = (str) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad with '=' so length is a multiple of 4
        while (base64.length % 4) {
          base64 += '=';
        }
        // Decode to string, handling Unicode characters properly
        return decodeURIComponent(escape(window.atob(base64)));
      };

      const headerRaw = decodeBase64Url(parts[0]);
      const payloadRaw = decodeBase64Url(parts[1]);

      setDecoded({
        header: JSON.parse(headerRaw),
        payload: JSON.parse(payloadRaw),
        signature: parts[2],
        raw: parts,
        error: null
      });
    } catch (err) {
      setDecoded({ error: err.message || 'Invalid or malformed token.' });
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    if (window.showToast) window.showToast(`${label} copied!`);
  };

  // Check Expiration (exp claim)
  const getExpirationStatus = () => {
    if (!decoded || !decoded.payload || !decoded.payload.exp) return null;
    const expDate = new Date(decoded.payload.exp * 1000);
    const now = new Date();
    const isExpired = expDate < now;
    
    return {
      dateString: expDate.toLocaleString(),
      isExpired,
      label: isExpired ? 'Token Expired' : 'Token Valid'
    };
  };

  const expStatus = getExpirationStatus();

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">JWT Decoder</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Decode JSON Web Tokens instantly. 100% client-side for total privacy.</p>
      
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input */}
        <div className="flex flex-col space-y-4">
          <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/50 bg-neutral-50 dark:bg-neutral-900/30">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Encoded Token</label>
              {token && <button onClick={() => decodeJWT('')} className="text-xs font-medium text-neutral-400 hover:text-red-500 transition-colors">Clear</button>}
            </div>
            
            {/* Visual Token Input */}
            <div className="relative flex-1 bg-transparent p-5 font-mono text-sm overflow-auto">
              {!decoded || decoded.error ? (
                <textarea
                  autoFocus
                  value={token}
                  onChange={(e) => decodeJWT(e.target.value)}
                  placeholder="Paste your eyJhbGciOi... here"
                  className="w-full h-full bg-transparent outline-none resize-none text-neutral-800 dark:text-neutral-200 break-all leading-relaxed"
                />
              ) : (
                <div className="relative w-full h-full text-neutral-800 dark:text-neutral-200 break-all leading-relaxed cursor-text" onClick={() => document.getElementById('hidden-jwt-input').focus()}>
                  <span className="text-red-600 dark:text-red-400 font-bold">{decoded.raw[0]}</span>
                  <span className="text-neutral-900 dark:text-white">.</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{decoded.raw[1]}</span>
                  <span className="text-neutral-900 dark:text-white">.</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{decoded.raw[2]}</span>
                  
                  {/* Hidden textarea to capture edits while displaying colored text */}
                  <textarea
                    id="hidden-jwt-input"
                    value={token}
                    onChange={(e) => decodeJWT(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 resize-none cursor-text"
                    spellCheck="false"
                  />
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {decoded?.error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-3 shadow-sm">
                <span className="text-xl">⚠️</span>
                <span className="text-sm font-bold">{decoded.error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col h-[500px] overflow-hidden space-y-4">
          
          {/* Header Box */}
          <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-100 dark:border-neutral-800/50 bg-red-50 dark:bg-red-900/10">
              <label className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400">Header <span className="text-[10px] opacity-70 ml-1">ALGORITHM & TOKEN TYPE</span></label>
              {decoded && !decoded.error && <button onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), 'Header')} className="text-xs font-bold text-red-600/70 hover:text-red-600 dark:text-red-400/70 dark:hover:text-red-400 transition">Copy</button>}
            </div>
            <div className="p-4 overflow-auto font-mono text-sm text-neutral-800 dark:text-neutral-200 flex-1">
              {decoded && !decoded.error ? (
                <pre className="m-0 leading-relaxed">{JSON.stringify(decoded.header, null, 2)}</pre>
              ) : <span className="opacity-30">// Paste token to view</span>}
            </div>
          </div>

          {/* Payload Box */}
          <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm flex flex-col flex-[2] overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-100 dark:border-neutral-800/50 bg-purple-50 dark:bg-purple-900/10">
              <label className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Payload <span className="text-[10px] opacity-70 ml-1">DATA</span></label>
              {decoded && !decoded.error && <button onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), 'Payload')} className="text-xs font-bold text-purple-600/70 hover:text-purple-600 dark:text-purple-400/70 dark:hover:text-purple-400 transition">Copy</button>}
            </div>
            <div className="p-4 overflow-auto font-mono text-sm text-neutral-800 dark:text-neutral-200 flex-1 relative">
              {decoded && !decoded.error ? (
                <>
                  <pre className="m-0 leading-relaxed">{JSON.stringify(decoded.payload, null, 2)}</pre>
                  
                  {/* Expiration Status Overlay */}
                  {expStatus && (
                    <div className="absolute top-4 right-4 flex flex-col items-end">
                      <div className={`px-3 py-1 rounded-md text-xs font-bold mb-1 shadow-sm border ${expStatus.isExpired ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-900 dark:text-red-400' : 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:border-green-900 dark:text-green-400'}`}>
                        {expStatus.label}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide">
                        {expStatus.dateString}
                      </span>
                    </div>
                  )}
                </>
              ) : <span className="opacity-30">// Paste token to view</span>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}