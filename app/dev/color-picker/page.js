'use client';
import { useState, useEffect, useMemo } from 'react';

// --- Color Math Helpers ---
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const hexToHsl = (hex) => {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToHex = (h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const getLuminance = (r, g, b) => {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// ---------------------------

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6'); // Default blue
  const [formats, setFormats] = useState({ rgb: '', hsl: '' });

  // Calculate Contrast
  const contrast = useMemo(() => {
    const { r, g, b } = hexToRgb(color);
    const lum = getLuminance(r, g, b);
    
    // Contrast ratio formula: (L1 + 0.05) / (L2 + 0.05)
    const ratioWhite = 1.05 / (lum + 0.05);
    const ratioBlack = (lum + 0.05) / 0.05;
    
    return {
      white: { ratio: ratioWhite.toFixed(2), pass: ratioWhite >= 4.5 },
      black: { ratio: ratioBlack.toFixed(2), pass: ratioBlack >= 4.5 }
    };
  }, [color]);

  // Generate Tailwind-style Palette (50-950)
  const palette = useMemo(() => {
    const { h, s, l: baseL } = hexToHsl(color);
    const shades = [];
    
    // Define steps. 500 is the base color.
    const steps = [
      { weight: '50', l: baseL + (95 - baseL) * 0.95 },
      { weight: '100', l: baseL + (95 - baseL) * 0.8 },
      { weight: '200', l: baseL + (95 - baseL) * 0.6 },
      { weight: '300', l: baseL + (95 - baseL) * 0.4 },
      { weight: '400', l: baseL + (95 - baseL) * 0.2 },
      { weight: '500', l: baseL }, // Exact match
      { weight: '600', l: baseL - (baseL - 5) * 0.2 },
      { weight: '700', l: baseL - (baseL - 5) * 0.4 },
      { weight: '800', l: baseL - (baseL - 5) * 0.6 },
      { weight: '900', l: baseL - (baseL - 5) * 0.8 },
      { weight: '950', l: baseL - (baseL - 5) * 0.95 },
    ];

    steps.forEach(step => {
      // Keep hue and saturation, only shift lightness
      shades.push({
        weight: step.weight,
        hex: hslToHex(h, s, Math.max(0, Math.min(100, step.l)))
      });
    });
    
    return shades;
  }, [color]);

  useEffect(() => {
    const { r, g, b } = hexToRgb(color);
    const { h, s, l } = hexToHsl(color);
    setFormats({
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${s}%, ${l}%)`
    });
  }, [color]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    if (window.showToast) window.showToast(`${label} copied`);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Color Studio</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Generate palettes and verify WCAG contrast ratios.</p>
      
      <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm mb-8">
        
        {/* Top Section: Picker & Formats */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Native Picker */}
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-neutral-100 dark:border-neutral-800 shadow-sm shrink-0 mx-auto md:mx-0 cursor-pointer hover:scale-105 transition-transform group">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="absolute -top-4 -left-4 w-48 h-48 cursor-pointer"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity mix-blend-difference text-white font-medium">
              Click to edit
            </div>
          </div>
          
          {/* Formats List */}
          <div className="flex-1 space-y-3">
            {[
              { label: 'HEX', value: color.toUpperCase() },
              { label: 'RGB', value: formats.rgb },
              { label: 'HSL', value: formats.hsl }
            ].map((format) => (
              <div key={format.label} onClick={() => copyToClipboard(format.value, format.label)} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-100 dark:border-neutral-800/50 cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 transition group">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{format.label}</p>
                  <p className="font-mono text-lg text-neutral-900 dark:text-white">{format.value}</p>
                </div>
                <div className="text-sm font-medium text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition">Copy</div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Section: WCAG Contrast Checker */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4">Accessibility (WCAG 4.5:1)</h3>
          <div className="grid grid-cols-2 gap-4">
            
            {/* White Text Test */}
            <div 
              style={{ backgroundColor: color }} 
              className="p-6 rounded-xl flex flex-col items-center justify-center text-center transition-colors"
            >
              <span className="text-3xl font-bold text-white mb-2">Aa</span>
              <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-white text-sm font-medium">{contrast.white.ratio}</span>
                {contrast.white.pass ? (
                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">✓</span>
                ) : (
                  <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">×</span>
                )}
              </div>
            </div>

            {/* Black Text Test */}
            <div 
              style={{ backgroundColor: color }} 
              className="p-6 rounded-xl flex flex-col items-center justify-center text-center transition-colors"
            >
              <span className="text-3xl font-bold text-black mb-2">Aa</span>
              <div className="bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-black text-sm font-medium">{contrast.black.ratio}</span>
                {contrast.black.pass ? (
                  <span className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">✓</span>
                ) : (
                  <span className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">×</span>
                )}
              </div>
            </div>
            
          </div>
        </div>

        {/* Bottom Section: Tailwind Palette Generator */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Palette Generator</h3>
            <span className="text-xs text-neutral-400">Click to copy hex</span>
          </div>
          
          <div className="grid grid-cols-11 h-24 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-inner">
            {palette.map((shade) => (
              <div 
                key={shade.weight}
                onClick={() => copyToClipboard(shade.hex, `Shade ${shade.weight}`)}
                className="relative group cursor-pointer h-full transition-all hover:flex-[1.5]"
                style={{ backgroundColor: shade.hex }}
              >
                {/* Tooltip on hover */}
                <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end h-full bg-gradient-to-t from-black/50 to-transparent">
                  <span className="text-white text-[10px] font-bold">{shade.weight}</span>
                  <span className="text-white/80 text-[9px] font-mono">{shade.hex.toUpperCase()}</span>
                </div>
                
                {/* Dot indicator for the base 500 color */}
                {shade.weight === '500' && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black/30 dark:bg-white/30 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}