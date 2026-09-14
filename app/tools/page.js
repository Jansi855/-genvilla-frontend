import Image from "next/image";
import { ArrowDown, ChevronRight, Wrench } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { assetUrl } from "@/lib/assets";
import ToolsDirectory from "./_components/ToolsDirectory";

export const metadata = {
  title: "Property Tools | GenVilla",
  description:
    "Explore GenVilla’s property comparison, document checklist, stamp duty, home loan, locality and RERA tools for your next property decision.",
};

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream">
        <section
          aria-labelledby="tools-title"
          className="relative isolate overflow-hidden bg-[#0d2922] text-white"
        >
          <Image
            src={assetUrl("/hero/property-amentities.png")}
            alt="Modern residences surrounded by landscaped gardens and shared amenities"
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061713]/95 via-[#061713]/80 to-[#061713]/30" />
          <div className="mx-auto max-w-[1360px] px-5 pb-16 pt-7 lg:px-10 lg:pb-20">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-white/70"
            >
              <Link href="/" className="rounded hover:text-white">
                Home
              </Link>
              <ChevronRight size={12} aria-hidden="true" />
              <span aria-current="page" className="text-white">
                Tools
              </span>
            </nav>
            <div className="mt-12 max-w-2xl lg:mt-16">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.18em]">
                <Wrench size={14} aria-hidden="true" /> Your property toolkit
              </p>
              <h1
                id="tools-title"
                className="mt-6 font-serif text-5xl leading-[1.06] tracking-[-.035em] sm:text-6xl lg:text-7xl"
              >
                A little clarity.
                <br />
                <span className="text-[#b9dcc7]">
                  A smarter property decision.
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/80">
                From your first shortlist to the final paperwork, explore
                practical tools to help you plan your next move with confidence.
              </p>
              <a href="#explore-tools" className="btn-light mt-8">
                Explore the tools <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        <ToolsDirectory />
      </main>
      <Footer />
    </>
  );
}
