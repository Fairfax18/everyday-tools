import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wider">
          Everyday Tools
        </Link>
        <ul className="flex space-x-6">
          <li><Link href="/world-clock" className="hover:text-blue-300 transition">World Clock</Link></li>
          <li><Link href="/timer" className="hover:text-blue-300 transition">Timer</Link></li>
          <li><Link href="/todo" className="hover:text-blue-300 transition">To-Do</Link></li>
          <li><Link href="/calculator" className="hover:text-blue-300 transition">Calculator</Link></li>
          <li><Link href="/converter" className="hover:text-blue-300 transition">Converter</Link></li>
        </ul>
      </div>
    </nav>
  );
}