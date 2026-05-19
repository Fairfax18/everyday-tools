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
          <li><Link href="/word-counter" className="hover:text-blue-300 transition">Word Counter</Link></li>
          <li><Link href="/password-generator" className="hover:text-blue-300 transition">Password Gen</Link></li>
        </ul>
      </div>
    </nav>
  );
}