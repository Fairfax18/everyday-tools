import '../app/globals.css';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'Everyday Tools',
  description: 'Useful Everyday Tools That We Use',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}