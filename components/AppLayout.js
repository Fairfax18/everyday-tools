'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toolsCategories } from '../lib/toolsConfig';

export default function AppLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [toast, setToast] = useState(null);
  const pathname = usePathname();

  // Close mobile menu when navigating
  useEffect(() => setIsMobileOpen(false), [pathname]);

  // Initialize Dark Mode based on user preference
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
    
    // Global Toast Function (accessible anywhere via window.showToast)
    window.showToast = (msg) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
    };
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 hidden md:flex flex-col flex-shrink-0 transition-colors duration-300">
        <div className="p-6 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-70 transition">
            Everyday Tools.
          </Link>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition">
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <nav className="px-4 pb-6 space-y-8 overflow-y-auto flex-1">
          {toolsCategories.map((category) => (
            <div key={category.slug}>
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {category.title}
              </h3>
              <ul className="space-y-1">
                {category.tools.map((tool) => (
                  <li key={tool.path}>
                    <Link href={tool.path} className={`block px-2 py-1.5 text-sm rounded-md transition-colors ${pathname === tool.path ? 'bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white font-medium' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white'}`}>
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile Drawer Menu */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800">
          <Link href="/" className="text-lg font-bold tracking-tight">Menu</Link>
          <button onClick={() => setIsMobileOpen(false)} className="text-2xl text-neutral-500">&times;</button>
        </div>
        <nav className="p-4 space-y-6 overflow-y-auto flex-1">
          {toolsCategories.map((category) => (
            <div key={category.slug}>
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">{category.title}</h3>
              <ul className="space-y-1">
                {category.tools.map((tool) => (
                  <li key={tool.path}>
                    <Link href={tool.path} onClick={() => setIsMobileOpen(false)} className="block px-2 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md">
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative animate-fade-in">
        
        {/* Mobile Header */}
        <header className="md:hidden border-b border-neutral-200 dark:border-neutral-800 p-4 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md z-30">
          <Link href="/" className="font-bold tracking-tight text-neutral-900 dark:text-white">Everyday Tools.</Link>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="text-xl">{isDark ? '☀️' : '🌙'}</button>
            <button onClick={() => setIsMobileOpen(true)} className="text-neutral-900 dark:text-white font-medium">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </header>
        
        <div className="p-6 md:p-12 max-w-5xl mx-auto w-full pb-24">
          {children}
        </div>
      </main>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 rounded-full shadow-xl font-medium text-sm flex items-center gap-2">
            <span className="text-green-400 dark:text-green-600">✓</span>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}