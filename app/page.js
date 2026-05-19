import Link from 'next/link';

export default function Home() {
  return (
    <div className="animate-fade-in">
      <div className="text-center py-20">
        <h1 className="text-5xl font-extrabold tracking-tighter mb-6">Productivity, simplified.</h1>
        <p className="text-neutral-500 text-xl max-w-lg mx-auto mb-10">A suite of minimal, offline-first tools designed to keep your workflow fast and focus-driven.</p>
        <div className="flex justify-center gap-4">
           <Link href="/time/world-clock" className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium">Get Started</Link>
        </div>
      </div>
    </div>
  );
}