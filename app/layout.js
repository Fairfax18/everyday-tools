import './globals.css';
import Link from 'next/link';
import { toolsCategories } from '../lib/toolsConfig';

export const metadata = {
  title: 'Everyday Tools',
  description: 'Minimalist everyday utilities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased flex min-h-screen">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-neutral-200 bg-neutral-50/50 hidden md:block flex-shrink-0">
          <div className="p-6">
            <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900 hover:text-neutral-600 transition">
              Everyday Tools.
            </Link>
          </div>
          <nav className="px-4 pb-6 space-y-8">
            {toolsCategories.map((category) => (
              <div key={category.slug}>
                <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {category.title}
                </h3>
                <ul className="space-y-1">
                  {category.tools.map((tool) => (
                    <li key={tool.path}>
                      <Link 
                        href={tool.path}
                        className="block px-2 py-1.5 text-sm text-neutral-600 rounded-md hover:bg-neutral-200 hover:text-neutral-900 transition-colors"
                      >
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
        <main className="flex-1 overflow-y-auto">
          {/* Mobile Header (visible only on small screens) */}
          <header className="md:hidden border-b border-neutral-200 p-4 flex justify-between items-center">
            <Link href="/" className="font-semibold tracking-tight text-neutral-900">
              Everyday Tools.
            </Link>
            <span className="text-sm text-neutral-500">Menu</span>
          </header>
          
          <div className="p-6 md:p-12 max-w-5xl mx-auto">
            {children}
          </div>
        </main>

      </body>
    </html>
  );
}