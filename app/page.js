import Link from 'next/link';
import { toolsCategories } from '../lib/toolsConfig';

export default function Home() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">All Tools</h1>
        <p className="text-neutral-500 text-lg">A minimal collection of useful everyday utilities.</p>
      </div>

      <div className="space-y-12">
        {toolsCategories.map((category) => (
          <section key={category.slug}>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-neutral-200">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tools.map((tool) => (
                <Link key={tool.path} href={tool.path}>
                  <div className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-sm transition cursor-pointer group">
                    <h3 className="font-medium text-neutral-800 group-hover:text-black transition">
                      {tool.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}