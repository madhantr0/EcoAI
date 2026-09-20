import FeedGrid from '@/components/feed/FeedGrid';

export default function FeedPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-serif text-5xl mb-2">The Grove</h1>
      <p className="text-forest-100/60 mb-10 font-light">
        Cryptographically verified plantings, sorted by recency.
      </p>
      <FeedGrid />
    </div>
  );
}
