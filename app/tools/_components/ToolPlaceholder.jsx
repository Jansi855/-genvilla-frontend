import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ToolPlaceholder({ title, description }) {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] items-center justify-center bg-cream px-5 py-16 sm:py-24">
        <section aria-labelledby="tool-title" className="w-full max-w-3xl rounded-[28px] border border-ink/10 bg-white p-7 shadow-soft sm:p-12">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-green">
            <Wrench size={26} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <p className="eyebrow mt-6">GENVILLA TOOLS</p>
          <h1 id="tool-title" className="mt-4 font-serif text-4xl leading-tight tracking-[-.03em] text-ink sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl leading-7 text-ink/65">{description}</p>
          <p className="mt-6 rounded-xl bg-sage/40 p-4 text-sm leading-6 text-ink/65">This is a preview page. The interactive tool is not available yet.</p>
          <Link href="/tools" className="btn-dark mt-8">
            <ArrowLeft size={16} aria-hidden="true" /> Back to Tools
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
