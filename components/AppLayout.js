'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toolsCategories } from '../lib/toolsConfig';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppLayout({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [openCategory, setOpenCategory] = useState('time');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  // Dark Mode & Keyboard Listeners
  useEffect(() => {
    const isDarkMode = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.theme = newDark ? 'dark' : 'light';
  };

  const allTools = toolsCategories.flatMap(c => c.tools);
  const filteredTools = allTools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // --- REUSABLE NAVIGATION ACCORDION ---
  // We extract this so we can use it in both the Desktop Sidebar AND the Mobile Drawer
  const renderNavigation = () => (
    <nav className="flex-1 space-y-1 overflow-y-auto">
      {toolsCategories.map((cat) => (
        <div key={cat.slug} className="mb-4">
          <button 
            onClick={() => setOpenCategory(openCategory === cat.slug ? null : cat.slug)} 
            className="w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 py-2 transition-colors"
          >
            {cat.title} <span>{openCategory === cat.slug ? '−' : '+'}</span>
          </button>
          <AnimatePresence>
            {openCategory === cat.slug && (
              <motion.ul 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {cat.tools.map(t => (
                  <li key={t.path}>
                    <Link 
                      href={t.path} 
                      onClick={() => setIsMobileOpen(false)} // Closes drawer on mobile when clicked
                      className={`text-sm block py-1.5 px-3 rounded-lg transition-all ${pathname === t.path ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* --- MOBILE HEADER --- */}
      {/* Only visible on small screens. Stays sticky at the top. */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between p-4 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <Link href="/" className="text-lg font-bold tracking-tighter">Everyday Tools.</Link>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSearch(true)} className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button onClick={toggleTheme} className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
            {isDark ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setIsMobileOpen(true)} className="p-2 text-neutral-900 dark:text-white">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </header>

      {/* --- MOBILE DRAWER OVERLAY --- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsMobileOpen(false)} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white dark:bg-[#111] z-50 p-6 flex flex-col border-r border-neutral-200 dark:border-neutral-800 md:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <Link href="/" onClick={() => setIsMobileOpen(false)} className="text-xl font-bold tracking-tighter">Everyday Tools.</Link>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 text-neutral-500 hover:text-red-500 transition-colors">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              {renderNavigation()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 hidden md:flex p-6 sticky top-0 h-screen flex-col">
        <Link href="/" className="text-xl font-bold mb-10 block tracking-tighter">Everyday Tools.</Link>
        {renderNavigation()}
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          
          {/* Desktop Top Controls (Hidden on Mobile) */}
          <header className="hidden md:flex justify-end gap-4 mb-12">
            <button onClick={() => setShowSearch(true)} className="text-sm text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-md hover:border-neutral-400 transition flex items-center gap-2">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Search... <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded ml-2 text-xs">⌘K</span>
            </button>
            <button onClick={toggleTheme} className="text-xl p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition">{isDark ? '☀️' : '🌙'}</button>
          </header>
          
          <AnimatePresence mode="wait">
            <motion.div key={pathname} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* --- COMMAND PALETTE MODAL --- */}
      {/* Kept unchanged, it overlays everything perfectly */}
      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setShowSearch(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-[60] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
              <input autoFocus placeholder="Search tools..." className="w-full bg-transparent p-4 outline-none border-b border-neutral-100 dark:border-neutral-800" onChange={(e) => setSearchQuery(e.target.value)} />
              <ul className="max-h-80 overflow-y-auto">
                {filteredTools.length > 0 ? filteredTools.map(tool => (
                  <li key={tool.path}>
                    <button onClick={() => { router.push(tool.path); setShowSearch(false); setIsMobileOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">{tool.name}</button>
                  </li>
                )) : <li className="p-4 text-neutral-500 text-sm">No tools found.</li>}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}