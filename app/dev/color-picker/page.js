'use client';
import { useState, useEffect } from 'react';

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6'); // Default blue
  const [rgb, setRgb] = useState('');
  const [hsl, setHsl] = useState('');

  // Helper to convert HEX to RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Helper to convert HEX to HSL
  const hexToHsl = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) { h = s = 0; } 
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  useEffect(() => {
    setRgb(hexToRgb(color));
    setHsl(hexToHsl(color));
  }, [color]);

  const copyFormat = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: You could add a toast notification here
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Color Picker</h1>
      <p className="text-neutral-500 mb-8">Select colors and copy standard web formats.</p>
      
      <div className="bg-white p-8 rounded-xl border border-neutral-200">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-neutral-100 shadow-sm shrink-0">
            {/* The actual HTML5 color picker input */}
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="absolute -top-4 -left-4 w-48 h-48 cursor-pointer"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-medium text-neutral-900 mb-2">Selected Color</h2>
            <p className="text-neutral-500 text-sm">Click the circle to open the native color picker and adjust the hue, saturation, and lightness.</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'HEX', value: color.toUpperCase() },
            { label: 'RGB', value: rgb },
            { label: 'HSL', value: hsl }
          ].map((format) => (
            <div key={format.label} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-100 group">
              <div>
                <p className="text-xs font-semibold text-neutral-400 mb-1">{format.label}</p>
                <p className="font-mono text-lg text-neutral-900">{format.value}</p>
              </div>
              <button 
                onClick={() => copyFormat(format.value)}
                className="px-4 py-2 text-sm font-medium bg-white border border-neutral-200 rounded-md text-neutral-600 opacity-0 group-hover:opacity-100 transition hover:bg-neutral-100"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}