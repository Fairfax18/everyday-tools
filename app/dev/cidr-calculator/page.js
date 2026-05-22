'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CidrCalculator() {
  const [ip, setIp] = useState('192.168.1.0');
  const [cidr, setCidr] = useState(24);

  // --- IP Math Engine ---
  const calculation = useMemo(() => {
    // 1. Basic IP Validation (IPv4)
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    if (!ipRegex.test(ip)) {
      return { error: 'Invalid IPv4 Address' };
    }

    // 2. Convert IP string to 32-bit integer
    const ipInt = ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
    
    // 3. Calculate Mask Integer
    const maskInt = cidr === 0 ? 0 : (~((1 << (32 - cidr)) - 1) >>> 0);
    
    // 4. Calculate Network and Broadcast Integers
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | (~maskInt)) >>> 0;

    // 5. Convert Integer back to IP string
    const intToIp = (int) => [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255
    ].join('.');

    // 6. Calculate Hosts
    const totalHosts = Math.pow(2, 32 - cidr);
    // /32 has 1 host, /31 has 2 (point-to-point), otherwise total - 2 (network & broadcast)
    let usableHosts = totalHosts - 2;
    if (cidr === 32) usableHosts = 1;
    if (cidr === 31) usableHosts = 2;

    return {
      ip: intToIp(ipInt),
      netmask: intToIp(maskInt),
      networkAddress: intToIp(networkInt),
      broadcastAddress: cidr < 31 ? intToIp(broadcastInt) : 'N/A',
      firstHost: cidr < 31 ? intToIp(networkInt + 1) : 'N/A',
      lastHost: cidr < 31 ? intToIp(broadcastInt - 1) : 'N/A',
      totalHosts: totalHosts.toLocaleString(),
      usableHosts: usableHosts.toLocaleString(),
      wildcardMask: intToIp((~maskInt) >>> 0),
      error: null
    };
  }, [ip, cidr]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    if (window.showToast) window.showToast(`${label} copied!`);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">CIDR Calculator</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Calculate IP ranges, subnets, and usable hosts instantly.</p>
      
      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            
            {/* IP Input */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">IP Address</label>
              <input 
                type="text" 
                value={ip} 
                onChange={(e) => setIp(e.target.value)}
                placeholder="192.168.1.0"
                className={`w-full p-3 font-mono text-lg rounded-xl border focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition ${calculation.error ? 'border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400' : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white'}`}
              />
              <AnimatePresence>
                {calculation.error && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs font-bold mt-2">
                    {calculation.error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* CIDR Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Prefix / Mask</label>
                <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-sm text-neutral-900 dark:text-white font-bold">/{cidr}</span>
              </div>
              <input 
                type="range" min="0" max="32" 
                value={cidr} 
                onChange={(e) => setCidr(Number(e.target.value))}
                className="w-full cursor-pointer accent-neutral-900 dark:accent-white mb-3"
              />
              
              {/* Quick Select Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[8, 16, 24, 32].map(quickCidr => (
                  <button
                    key={quickCidr}
                    onClick={() => setCidr(quickCidr)}
                    className={`py-1.5 text-xs font-mono font-bold rounded-lg transition-colors border ${cidr === quickCidr ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent' : 'bg-transparent text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-700'}`}
                  >
                    /{quickCidr}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Results Dashboard */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden h-full">
            
            {calculation.error ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center text-neutral-400">
                <span className="text-4xl mb-4">⚠️</span>
                <p className="font-medium">Enter a valid IPv4 address to see the subnet breakdown.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                
                {/* Header Highlight */}
                <div className="p-6 bg-neutral-50 dark:bg-neutral-900/30 flex justify-between items-center group">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">Usable Host Range</p>
                    <p className="font-mono text-xl text-neutral-900 dark:text-white">{calculation.firstHost} <span className="text-neutral-400 mx-1">—</span> {calculation.lastHost}</p>
                  </div>
                  <button onClick={() => copyToClipboard(`${calculation.firstHost} - ${calculation.lastHost}`, 'Host Range')} className="text-xs font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition opacity-0 group-hover:opacity-100">
                    Copy
                  </button>
                </div>

                {/* Data Grid */}
                <div className="p-6 grid sm:grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    { label: 'Network Address', value: calculation.networkAddress },
                    { label: 'Broadcast Address', value: calculation.broadcastAddress },
                    { label: 'Subnet Mask', value: calculation.netmask },
                    { label: 'Wildcard Mask', value: calculation.wildcardMask },
                    { label: 'Total Hosts', value: calculation.totalHosts, isNum: true },
                    { label: 'Usable Hosts', value: calculation.usableHosts, isNum: true },
                  ].map((item) => (
                    <div key={item.label} className="group flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{item.label}</p>
                        <button 
                          onClick={() => copyToClipboard(item.value, item.label)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                          title="Copy"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                      </div>
                      <p className={`font-mono text-base ${item.isNum ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Network Class / CIDR Notation Display */}
                <div className="p-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-center text-sm font-mono tracking-wider font-bold">
                  {calculation.networkAddress}/{cidr}
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}