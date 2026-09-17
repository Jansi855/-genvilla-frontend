import Link from "next/link";

export default function PropertyNotFound() {
  return <main className="min-h-[60vh] bg-cream px-5 py-20 text-center">
    <h1 className="font-serif text-4xl">Property not found</h1>
    <p className="mt-4 text-sm text-ink/60">This listing may no longer be available.</p>
    <Link href="/properties" className="btn-green mt-6">Browse properties</Link>
  </main>;
}
