import '../app/globals.css';
import AppLayout from '../components/AppLayout';

export const metadata = {
  title: 'Everyday Tools',
  description: 'Minimalist everyday utilities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 antialiased">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
