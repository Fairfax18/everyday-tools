'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Base64Tool() {
  const [tab, setTab] = useState('text'); // 'text' or 'image'
  
  // Text Mode State
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [textAction, setTextAction] = useState('encode'); // 'encode' or 'decode'
  const [textError, setTextError] = useState(false);

  // Image Mode State
  const [isDragging, setIsDragging] = useState(false);
  const [imageData, setImageData] = useState(null); // { base64: string, name: string, size: string, isImage: boolean }
  const fileInputRef = useRef(null);

  // --- Text Processing Logic ---
  const processText = (text, action) => {
    setTextInput(text);
    setTextError(false);
    if (!text) return setTextOutput('');

    try {
      if (action === 'encode') {
        setTextOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setTextOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch (err) {
      setTextError(true);
      setTextOutput('Error: Invalid Base64 string.');
    }
  };

  const switchTextAction = (newAction) => {
    setTextAction(newAction);
    processText(textInput, newAction);
  };

  // --- Image Drag & Drop Logic ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      const sizeKB = (file.size / 1024).toFixed(2);
      
      setImageData({
        base64: base64String,
        name: file.name,
        size: `${sizeKB} KB`,
        isImage: file.type.startsWith('image/')
      });
    };
    // readAsDataURL automatically formats it as a usable web URI (data:image/png;base64,iVBORw0KGgo...)
    reader.readAsDataURL(file); 
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    if (window.showToast) window.showToast('Copied to clipboard');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Base64 Encoder</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Encode text or embed images into Data URIs instantly.</p>
      
      <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm min-h-[500px]">
        
        {/* Main Tabs (Text vs Image) */}
        <div className="flex p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg mb-8 max-w-sm">
          <button 
            onClick={() => setTab('text')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tab === 'text' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
          >
            Text String
          </button>
          <button 
            onClick={() => setTab('image')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 ${tab === 'image' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
          >
            Image File <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-[10px] uppercase tracking-wider">New</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'text' ? (
            <motion.div key="text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              {/* Text Encode/Decode Toggle */}
              <div className="flex gap-2">
                <button onClick={() => switchTextAction('encode')} className={`px-6 py-2 text-sm font-bold rounded-lg border transition-all ${textAction === 'encode' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent' : 'bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}>
                  Encode
                </button>
                <button onClick={() => switchTextAction('decode')} className={`px-6 py-2 text-sm font-bold rounded-lg border transition-all ${textAction === 'decode' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent' : 'bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}>
                  Decode
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Input</label>
                    {textInput && <button onClick={() => {setTextInput(''); setTextOutput('');}} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">Clear</button>}
                  </div>
                  <textarea
                    value={textInput}
                    onChange={(e) => processText(e.target.value, textAction)}
                    placeholder={textAction === 'encode' ? "Type text to encode into Base64..." : "Paste Base64 string to decode..."}
                    className="w-full h-48 p-4 font-mono text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-[#111] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition resize-none text-neutral-800 dark:text-neutral-200"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Output</label>
                    {textOutput && !textError && <button onClick={() => copyToClipboard(textOutput)} className="text-xs font-bold text-neutral-900 dark:text-white hover:opacity-70 transition-opacity">Copy Result</button>}
                  </div>
                  <textarea
                    value={textOutput}
                    readOnly
                    className={`w-full h-48 p-4 font-mono text-sm rounded-xl border resize-none outline-none ${textError ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400' : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111] text-neutral-800 dark:text-neutral-200'}`}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="image" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              
              {!imageData ? (
                /* Drag and Drop Zone */
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-900/50 scale-[1.02]' : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/20'}`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => processFile(e.target.files[0])} 
                    className="hidden" 
                    accept="image/*,.svg"
                  />
                  <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Upload an image</h3>
                  <p className="text-sm text-neutral-500">Drag and drop, or click to browse</p>
                  <p className="text-xs text-neutral-400 mt-4 font-mono">PNG, JPG, SVG, WebP</p>
                </div>
              ) : (
                /* Result View */
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image Preview Card */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Preview</label>
                      <button onClick={() => setImageData(null)} className="text-xs text-neutral-400 hover:text-red-500 transition-colors">Upload new file</button>
                    </div>
                    <div className="relative w-full h-48 md:h-64 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center overflow-hidden group">
                      {/* Checkerboard background for transparent PNGs/SVGs */}
                      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #fff 25%, #fff 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
                      
                      {imageData.isImage ? (
                        <img src={imageData.base64} alt="Uploaded preview" className="max-w-full max-h-full object-contain p-4 z-10" />
                      ) : (
                        <div className="z-10 text-neutral-500 font-bold flex flex-col items-center"><span className="text-4xl mb-2">📄</span>File Preview Not Available</div>
                      )}

                      {/* File Info Overlay */}
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-20 translate-y-full group-hover:translate-y-0 transition-transform">
                        <span className="text-xs font-medium text-neutral-900 dark:text-white truncate max-w-[70%]">{imageData.name}</span>
                        <span className="text-xs font-mono text-neutral-500">{imageData.size}</span>
                      </div>
                    </div>
                  </div>

                  {/* Base64 Output Box */}
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold uppercase tracking-widest text-neutral-400">Data URI Format</label>
                      <button onClick={() => copyToClipboard(imageData.base64)} className="text-xs font-bold text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-800 px-3 py-1.5 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">Copy Data</button>
                    </div>
                    <textarea
                      value={imageData.base64}
                      readOnly
                      className="flex-1 w-full p-4 font-mono text-[10px] leading-relaxed rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 outline-none resize-none break-all"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}