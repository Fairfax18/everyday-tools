'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toolsCategories } from '../lib/toolsConfig';

export default function AppLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [openCategory, setOpenCategory] = useState('time');
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isDarkMode = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.theme = newDark ? 'dark' : 'light';
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 hidden md:block p-6">
        <Link href="/" className="text-xl font-bold mb-8 block">Everyday Tools.</Link>
        <nav className="space-y-2">
          {toolsCategories.map((cat) => (
            <div key={cat.slug} className="border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <button onClick={() => setOpenCategory(openCategory === cat.slug ? null : cat.slug)} className="w-full flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500 py-2">
                {cat.title} <span>{openCategory === cat.slug ? '−' : '+'}</span>
              </button>
              {openCategory === cat.slug && (
                <ul className="space-y-1 mt-1">
                  {cat.tools.map(t => (
                    <li key={t.path}>
                      <Link href={t.path} className={`text-sm block py-1 px-2 rounded-md ${pathname === t.path ? 'bg-neutral-100 dark:bg-neutral-800' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}>{t.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-end gap-4 mb-12">
            <button onClick={toggleTheme} className="text-xl">{isDark ? '☀️' : '🌙'}</button>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}