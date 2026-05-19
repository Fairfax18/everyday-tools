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
  
  const pathname = usePathname();
  const router = useRouter();

  // 1. Dark Mode & Keyboard Listeners
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

  // Flatten tools for search
  const allTools = toolsCategories.flatMap(c => c.tools);
  const filteredTools = allTools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* Sidebar: Accordion */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 hidden md:block p-6 sticky top-0 h-screen flex flex-col">
        <Link href="/" className="text-xl font-bold mb-10 block tracking-tighter">Everyday Tools.</Link>
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
                        <Link href={t.path} className={`text-sm block py-1.5 px-3 rounded-lg transition-all ${pathname === t.path ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}>
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <header className="flex justify-end gap-4 mb-12">
            <button onClick={() => setShowSearch(true)} className="text-sm text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-md hover:border-neutral-400 transition">Search... <span className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded ml-2">⌘K</span></button>
            <button onClick={toggleTheme} className="text-xl p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition">{isDark ? '☀️' : '🌙'}</button>
          </header>
          
          <AnimatePresence mode="wait">
            <motion.div key={pathname} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowSearch(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
              <input autoFocus placeholder="Search tools..." className="w-full bg-transparent p-4 outline-none border-b border-neutral-100 dark:border-neutral-800" onChange={(e) => setSearchQuery(e.target.value)} />
              <ul className="max-h-80 overflow-y-auto">
                {filteredTools.map(tool => (
                  <li key={tool.path}>
                    <button onClick={() => { router.push(tool.path); setShowSearch(false); }} className="w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">{tool.name}</button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}