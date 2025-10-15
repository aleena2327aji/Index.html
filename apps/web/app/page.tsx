import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rustic-card p-6">
        <h1 className="text-2xl font-semibold mb-2 text-farm-green">Fresh from local farms</h1>
        <p className="text-gray-600 mb-4">Discover seasonal produce and value-added goods.</p>
        <Link href="/seller" className="inline-block bg-farm-green text-white px-4 py-2 rounded">Seller Dashboard</Link>
      </div>
      <div className="relative aspect-video rustic-card overflow-hidden">
        <Image src="https://picsum.photos/seed/farm/1200/800" alt="Farm" fill className="object-cover" />
      </div>
    </div>
  );
}
