import Link from 'next/link';

export default function Home() {
  const tools = [
    { name: 'World Clock', path: '/world-clock', desc: 'Check global times across different cities.', icon: '🌍' },
    { name: 'Focus Timer', path: '/timer', desc: 'Customizable timer for work and breaks.', icon: '⏱️' },
    { name: 'To-Do List', path: '/todo', desc: 'Manage your daily tasks locally.', icon: '📝' },
    { name: 'Calculator', path: '/calculator', desc: 'Standard math and finance calculations.', icon: '🧮' },
    { name: 'Converter', path: '/converter', desc: 'Convert lengths, weights, and temperatures.', icon: '🔄' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome to Everyday Tools</h1>
        <p className="text-lg text-gray-600 mb-8">No-fuss, browser-based utilities for your daily workflow.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.name} href={tool.path}>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-500 transition cursor-pointer h-full">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{tool.name}</h2>
                <p className="text-gray-600">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}