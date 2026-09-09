import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calculator,
  CheckCircle2,
  Compass,
  HeartHandshake,
  Linkedin,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "About GenVilla | Clearer Property Decisions",
  description:
    "Learn how GenVilla brings property discovery, financial planning, and practical insights together to help homebuyers make clearer real-estate decisions.",
};

const platformPillars = [
  {
    icon: Search,
    number: "01",
    title: "Discover",
    text: "Explore properties across growing NCR markets with the details that matter from the start.",
  },
  {
    icon: Calculator,
    number: "02",
    title: "Understand",
    text: "Turn prices into practical numbers with tools for affordability, true cost, EMI, returns, and risk.",
  },
  {
    icon: Compass,
    number: "03",
    title: "Decide",
    text: "Bring the property and your finances into one clear view before taking the next step.",
  },
];

const principles = [
  {
    icon: ShieldCheck,
    title: "Clarity over complexity",
    text: "Property decisions involve enough uncertainty. We make the information easier to understand and act on.",
  },
  {
    icon: BarChart3,
    title: "Context behind every number",
    text: "A price alone says very little. We connect it with affordability, ownership costs, returns, and financial resilience.",
  },
  {
    icon: HeartHandshake,
    title: "Built around the buyer",
    text: "Our tools start with real questions people face while choosing a home or evaluating an investment.",
  },
  {
    icon: Sparkles,
    title: "Technology with purpose",
    text: "We use technology to support better judgment while keeping the final decision firmly in your hands.",
  },
];

const cities = ["Gurugram", "Ghaziabad", "Sonipat", "Noida", "New Delhi"];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-cream text-ink">
        <section className="relative border-b border-ink/10 bg-[#edf1ec]">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-28 h-[430px] w-[430px] rounded-full border border-green/10"
          />
          <div
            aria-hidden="true"
            className="absolute -right-6 -top-10 h-[285px] w-[285px] rounded-full border border-green/10"
          />

          <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[1.25fr_.75fr] lg:items-end lg:px-10 lg:py-28">
            <div>
              <p className="eyebrow">ABOUT GENVILLA</p>
              <h1 className="mt-6 max-w-5xl font-serif text-[clamp(3.4rem,7vw,7rem)] leading-[.96] tracking-[-.045em]">
                Property decisions,
                <span className="block font-normal text-green">
                  made clearer.
                </span>
              </h1>
            </div>

            <div className="border-l border-green/25 pl-6 sm:pl-8">
              <p className="text-lg leading-8 text-ink/70">
                GenVilla brings property discovery, financial planning, and
                practical insights together, so every buyer can move forward
                with more context and confidence.
              </p>
              <Link
                href="/properties"
                className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-green transition hover:gap-3"
              >
                Explore properties
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:px-10 lg:py-28">
            <div>
              <p className="eyebrow">WHY WE EXIST</p>
              <h2 className="mt-4 font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl">
                Finding a property is only the beginning.
              </h2>
            </div>

            <div className="max-w-3xl text-base leading-8 text-ink/65 sm:text-lg">
              <p>
                A home is more than a listing, and a good property decision is
                more than a price. Buyers also need to understand the complete
                cost, monthly commitment, long-term value, available schemes,
                and the risks hidden between the lines.
              </p>
              <p className="mt-6">
                GenVilla is building a clearer way through that process. Our
                platform connects the search for a property with the tools and
                context needed to evaluate it, helping people move from
                browsing to a decision they understand.
              </p>

              <div className="mt-10 grid gap-4 border-t border-ink/10 pt-8 sm:grid-cols-2">
                {["Useful property context", "Practical financial tools", "Clear decision support", "One connected journey"].map(
                  (item) => (
                    <p
                      key={item}
                      className="flex items-center gap-3 text-sm font-semibold text-ink"
                    >
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-green"
                        aria-hidden="true"
                      />
                      {item}
                    </p>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-ink/10 bg-cream">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:py-20 lg:px-10 lg:py-24">
            <div className="max-w-3xl">
              <p className="eyebrow">THE GENVILLA APPROACH</p>
              <h2 className="mt-4 font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl">
                One journey from search to decision.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-ink/60">
                We organize a complicated process into three connected steps,
                each designed to answer the next important question.
              </p>
            </div>

            <div className="mt-12 grid overflow-hidden rounded-[28px] border border-ink/10 bg-ink/10 shadow-sm md:grid-cols-3">
              {platformPillars.map(({ icon: Icon, number, title, text }) => (
                <article key={title} className="bg-white p-7 sm:p-9">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-green">
                      <Icon size={21} aria-hidden="true" />
                    </span>
                    <span className="font-serif text-3xl text-ink/15">
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-10 font-serif text-3xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/60">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#15352c] text-white">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[.82fr_1.18fr] lg:gap-20 lg:px-10 lg:py-28">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#9fc6b7]">
                WHAT GUIDES US
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl">
                Better information creates better conversations.
              </h2>
              <p className="mt-6 max-w-md leading-7 text-white/60">
                Whether you are buying your first home or studying your next
                investment, you deserve to know what the numbers mean for you.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[26px] border border-white/10 bg-white/10 sm:grid-cols-2">
              {principles.map(({ icon: Icon, title, text }) => (
                <article key={title} className="bg-[#183b31] p-7 sm:p-8">
                  <Icon size={23} className="text-[#9fc6b7]" aria-hidden="true" />
                  <h3 className="mt-6 font-serif text-2xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-10 lg:py-24">
            <div>
              <p className="eyebrow">WHERE WE ARE FOCUSED</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl">
                Local discovery across Delhi NCR.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-ink/60">
                GenVilla currently helps people explore property opportunities
                across five key markets, with experiences shaped around the
                questions buyers ask locally.
              </p>
            </div>

            <div className="rounded-[28px] border border-ink/10 bg-[#f5f7f2] p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-ink/10 pb-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green text-white">
                  <MapPin size={19} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-green">
                    Delhi NCR
                  </p>
                  <p className="mt-1 text-sm text-ink/50">
                    Property markets we cover
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {cities.map((city) => (
                  <span
                    key={city}
                    className="rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold shadow-sm"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-ink/10 bg-cream">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:py-20 lg:px-10 lg:py-24">
            <div className="relative overflow-hidden rounded-[30px] bg-[#102d25] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
              <Building2
                aria-hidden="true"
                strokeWidth={1}
                className="absolute -bottom-16 -right-10 h-64 w-64 text-white/[.045]"
              />
              <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <div className="flex items-center gap-3">
                    <Target size={19} className="text-[#9fc6b7]" aria-hidden="true" />
                    <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#9fc6b7]">
                      CONNECT WITH GENVILLA
                    </p>
                  </div>
                  <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl">
                    Let&apos;s make property decisions clearer together.
                  </h2>
                  <p className="mt-5 max-w-2xl leading-7 text-white/60">
                    Follow our journey on LinkedIn or reach our support team by
                    email. We would be glad to hear from you.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <a
                    href="https://www.linkedin.com/company/genvilla-in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-ink transition hover:bg-[#e4eee8]"
                  >
                    <Linkedin size={17} aria-hidden="true" />
                    Follow on LinkedIn
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                  <a
                    href="mailto:support@genvilla.in"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-bold text-white transition hover:border-white/50 hover:bg-white/10"
                  >
                    <Mail size={17} aria-hidden="true" />
                    support@genvilla.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
