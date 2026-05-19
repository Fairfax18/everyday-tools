'use client';
import { useState } from 'react';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');

  // Update QR code only when user clicks generate to prevent API spam
  const generateQR = (e) => {
    e.preventDefault();
    setDebouncedText(text);
  };

  const qrUrl = debouncedText 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(debouncedText)}` 
    : null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">QR Code Generator</h1>
      <p className="text-neutral-500 mb-8">Convert links or text into shareable QR codes.</p>
      
      <div className="bg-white p-6 md:p-8 rounded-xl border border-neutral-200">
        <form onSubmit={generateQR} className="flex gap-2 mb-8">
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter URL or text..."
            className="flex-1 p-3 rounded-lg border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
          />
          <button type="submit" className="px-6 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition">
            Generate
          </button>
        </form>

        <div className="flex flex-col items-center justify-center p-8 bg-neutral-50 rounded-xl border border-neutral-100 min-h-[300px]">
          {qrUrl ? (
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl shadow-sm mb-6 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="Generated QR Code" className="w-48 h-48 md:w-64 md:h-64" />
              </div>
              <p className="text-sm text-neutral-500">Right-click the image to save or copy.</p>
            </div>
          ) : (
            <p className="text-neutral-400">Your QR code will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}