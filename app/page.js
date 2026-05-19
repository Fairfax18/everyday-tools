'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  // Spotlight tools: Highlight the 3 most universally useful tools
  const spotlightTools = [
    {
      name: "Password Generator",
      desc: "Create strong, secure passwords instantly.",
      path: "/text/password-generator",
      icon: "🔐",
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
    },
    {
      name: "Focus Timer",
      desc: "Enhance productivity using timeboxing.",
      path: "/time/pomodoro",
      icon: "⏱️",
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
    },
    {
      name: "Currency Converter",
      desc: "Live exchange rates updated daily.",
      path: "/math/currency",
      icon: "💱",
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
    }
  ];

  return (
    <div className="pb-12">
      
      {/* 1. The Hero Section */}
      <section className="py-20 md:py-32 text-center max-w-3xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-neutral-900 dark:text-white"
        >
          Productivity, <br className="hidden md:block" />
          <span className="text-neutral-400 dark:text-neutral-600">simplified.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 mb-10 max-w-xl mx-auto leading-relaxed"
        >
          A suite of minimal, offline-first tools designed to keep your workflow fast, secure, and focus-driven.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-6"
        >
          <Link 
            href="/time/world-clock" 
            className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-lg shadow-neutral-200 dark:shadow-none"
          >
            Start Exploring
          </Link>
          <div className="text-sm text-neutral-500 font-medium hidden sm:flex items-center gap-2">
            <span>or press</span>
            <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 font-mono shadow-sm">
              ⌘K
            </kbd> 
            <span>to search</span>
          </div>
        </motion.div>
      </section>

      {/* 2. The Spotlight Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="pt-12 border-t border-neutral-100 dark:border-neutral-800/50"
      >
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white mb-1">Most Popular</h2>
          <p className="text-sm text-neutral-500">Quick access to essential utilities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spotlightTools.map((tool) => (
            <Link key={tool.name} href={tool.path} className="group block h-full">
              <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 h-full flex flex-col hover:shadow-xl hover:shadow-neutral-100 dark:hover:shadow-none">
                
                {/* Icon Box with subtle tint */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6 ${tool.color}`}>
                  {tool.icon}
                </div>
                
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 group-hover:underline decoration-neutral-300 dark:decoration-neutral-600 underline-offset-4">
                  {tool.name}
                </h3>
                
                <p className="text-sm text-neutral-500 dark:text-neutral-400 flex-1 leading-relaxed">
                  {tool.desc}
                </p>
                
                <div className="mt-6 flex items-center text-sm font-medium text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                  Open Tool <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

    </div>
  );
}