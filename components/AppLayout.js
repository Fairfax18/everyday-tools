'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toolsCategories } from '../lib/toolsConfig';
import { motion, AnimatePresence } from 'framer-motion'; // Added for smooth transitions

export default function AppLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [openCategory, setOpenCategory] = useState('time');
  const pathname = usePathname();

  // ... (Keep existing Dark Mode and Theme logic) ...

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* Sidebar: Now with better hover states for a "Sleek" look */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 hidden md:block p-6 sticky top-0 h-screen">
        <Link href="/" className="text-xl font-bold mb-10 block tracking-tighter">Everyday Tools.</Link>
        <nav className="space-y-1">
          {toolsCategories.map((cat) => (
            <div key={cat.slug} className="mb-4">
              <button 
                onClick={() => setOpenCategory(openCategory === cat.slug ? null : cat.slug)} 
                className="w-full flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 py-2 transition-colors"
              >
                {cat.title} <span>{openCategory === cat.slug ? '−' : '+'}</span>
              </button>
              {openCategory === cat.slug && (
                <motion.ul 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1 overflow-hidden"
                >
                  {cat.tools.map(t => (
                    <li key={t.path}>
                      <Link 
                        href={t.path} 
                        className={`text-sm block py-1.5 px-3 rounded-lg transition-all ${pathname === t.path ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
                      >
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area: The Page Transition Layer */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}