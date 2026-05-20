import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";
import './globals.css';
import AppLayout from '../components/AppLayout';

export const metadata = { title: 'Everyday Tools', description: 'Minimalist suite.' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        <AppLayout>{children}</AppLayout>

        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}