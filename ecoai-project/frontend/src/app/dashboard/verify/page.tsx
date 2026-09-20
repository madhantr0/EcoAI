import VerifyFlow from '@/components/verify/VerifyFlow';

export default function VerifyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-5xl mb-2">Verify a Planting</h1>
      <p className="text-forest-100/60 mb-10 font-light">
        GPS-locked. Hash-chained. Immutable.
      </p>
      <VerifyFlow />
    </div>
  );
}
