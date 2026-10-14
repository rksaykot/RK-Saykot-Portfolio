import { Wrench } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-100 text-center px-4">
      <div className="mb-8 rounded-full bg-primary/10 p-6 text-primary">
        <Wrench size={48} strokeWidth={1.5} />
      </div>
      <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">Under Maintenance</h1>
      <p className="max-w-md text-base-content/60 text-lg">
        The site is currently down for scheduled maintenance and updates. Please check back soon!
      </p>
    </div>
  );
}
