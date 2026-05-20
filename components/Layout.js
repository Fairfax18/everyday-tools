import '../app/globals.css';
import Script from 'next/script';
import AppLayout from '../components/AppLayout';

export const metadata = {
  title: {
    template: '%s | Everyday Tools',
    default: 'Everyday Tools | Productivity, simplified.', // Used when a specific page doesn't set a title
  },
  description: 'A minimal, offline-first suite of everyday utilities designed to keep your workflow fast and focus-driven.',
  keywords: ['productivity tools', 'developer tools', 'calculators', 'pomodoro timer', 'json formatter', 'password generator'],
  metadataBase: new URL('https://everyday-tools-tan.vercel.app/'), // TODO: Replace with your actual live Vercel URL
  
  openGraph: {
    title: 'Everyday Tools | Productivity, simplified.',
    description: 'A minimal, offline-first suite of everyday utilities designed to keep your workflow fast and focus-driven.',
    url: 'https://everyday-tools-tan.vercel.app/',
    siteName: 'Everyday Tools',
    images: [
      {
        url: '/og-image.png', // We will add this image next
        width: 1200,
        height: 630,
        alt: 'Everyday Tools Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Everyday Tools | Productivity, simplified.',
    description: 'A minimal suite of everyday utilities.',
    images: ['/og-image.png'],
  },
  
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },

  other: {
    'google-adsense-account': 'ca-pub-6390065021877737' // Use your actual ID
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script>
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6390065021877737`}
          crossOrigin="anonymous"
        </Script>
      </head>
      <body className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 antialiased">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
