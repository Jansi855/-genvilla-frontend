import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Home,
  Users,
  Mail,
  ShieldCheck,
  LockKeyhole,
  BarChart3,
  Headphones,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";

const columns = {
  Explore: [
    ["Properties", "/properties"],
    ["Calculators", "/calculators"],
    ["Insights", "/insights"],
    ["Schemes", "/schemes"],
    ["Tools", "/tools"],
  ],

  Sell: [
    ["List your property", "/sell"],
    ["Seller dashboard", "/seller"],
    ["Manage listings", "/seller/listings"],
  ],

  Company: [
    ["About", "/about"],
    ["Contact", "/contact"],
    ["Privacy policy", "/privacy"],
    ["Terms", "/terms"],
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-[5px] border-[#d0923d] bg-[#061713] text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-[500px] w-[500px] rounded-full bg-emerald-900/10 blur-[130px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-14 lg:px-10">

        {/* =========================
            MAIN FOOTER
        ========================= */}
        <div className="grid items-start gap-14 xl:grid-cols-[1.15fr_1fr]">

          {/* LEFT */}
          <div>
            {/* Brand */}
            <div>
              <p className="font-serif text-4xl tracking-[0.03em] md:text-5xl">
                GENVILLA
              </p>

              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#d0923d]">
                Plan · Analyze · Invest
              </p>

              <div className="mt-5 h-[2px] w-12 bg-[#d0923d]" />

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/55">
                A clearer way to find property, understand the numbers and
                make a decision that fits your life.
              </p>
            </div>

            {/* =========================
                LARGE VIDEO
            ========================= */}
            <div className="group relative mt-7 max-w-[650px] overflow-hidden rounded-[28px] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.4)]">

              <div className="relative h-[310px] sm:h-[350px] lg:h-[390px]">

                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source
                    src="/hero/home-video.mp4"
                    type="video/mp4"
                  />
                </video>

                {/* Very light overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061713]/55 via-transparent to-black/5" />

                {/* GenVilla badge */}
                <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-[#061713]/75 px-4 py-2 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                    GenVilla
                  </span>
                </div>

                {/* Bottom text */}
                <div className="pointer-events-none absolute bottom-6 left-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
                    Find your perfect home
                  </p>

                  <p className="mt-1 text-lg font-semibold text-white">
                    Plan{" "}
                    <span className="text-[#d0923d]">·</span>{" "}
                    Analyze{" "}
                    <span className="text-[#d0923d]">·</span>{" "}
                    Invest
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* =========================
              RIGHT LINKS
          ========================= */}
          <div className="grid gap-10 sm:grid-cols-3">

            {Object.entries(columns).map(([name, links], index) => {
              const HeaderIcon =
                index === 0
                  ? Building2
                  : index === 1
                    ? Home
                    : Users;

              return (
                <div
                  key={name}
                  className="sm:border-l sm:border-white/10 sm:pl-7"
                >
                  {/* Heading */}
                  <div className="mb-7">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/[0.05]">
                        <HeaderIcon
                          size={18}
                          className="text-emerald-400"
                        />
                      </div>

                      <h3 className="text-base font-bold">
                        {name}
                      </h3>
                    </div>

                    <div className="ml-14 mt-3 h-[2px] w-8 bg-emerald-500/70" />
                  </div>

                  {/* Links */}
                  <div className="space-y-5">
                    {links.map(([label, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="group flex items-center gap-3 text-sm text-white/55 transition duration-300 hover:text-white"
                      >
                        <ArrowRight
                          size={13}
                          className="text-emerald-500 transition-transform duration-300 group-hover:translate-x-1"
                        />

                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================
            NEWSLETTER + TRUST
        ========================= */}
        <div className="mt-14 rounded-[26px] border border-emerald-500/20 bg-white/[0.025] p-6">

          <div className="grid items-center gap-8 xl:grid-cols-[1.05fr_1fr]">

            {/* Newsletter */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/[0.05]">
                <Mail
                  size={22}
                  className="text-emerald-400"
                />
              </div>

              <div className="shrink-0">
                <p className="font-bold">
                  Stay updated
                </p>

                <p className="mt-1 max-w-[220px] text-xs leading-5 text-white/45">
                  Get the latest property insights and market updates.
                </p>
              </div>

              <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/15">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                />

                <button
                  type="button"
                  className="flex items-center gap-2 bg-emerald-600 px-5 text-sm font-bold transition hover:bg-emerald-500"
                >
                  Subscribe
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-2 gap-5 border-t border-white/10 pt-7 sm:grid-cols-4 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">

              <TrustItem
                icon={ShieldCheck}
                title="Trusted Data"
                text="Accurate & reliable"
              />

              <TrustItem
                icon={LockKeyhole}
                title="Secure & Private"
                text="Your data is safe"
              />

              <TrustItem
                icon={BarChart3}
                title="Smart Insights"
                text="Data-driven"
              />

              <TrustItem
                icon={Headphones}
                title="Expert Support"
                text="Here to help"
              />

            </div>
          </div>
        </div>

        {/* =========================
            BOTTOM
        ========================= */}
        <div className="mt-8 grid gap-7 border-t border-white/10 pt-7 md:grid-cols-3 md:items-center">

          {/* Social */}
          <div>
            <p className="mb-3 text-xs text-white/45">
              Follow us
            </p>

            <div className="flex gap-3">
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Linkedin} />
            </div>
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/40 md:text-center">
            © 2026{" "}
            <span className="font-bold text-emerald-400">
              GenVilla
            </span>
            . All rights reserved.
          </p>

          {/* Disclaimer */}
          <p className="text-xs leading-5 text-white/35 md:text-right">
            Calculations and insights are estimates and should not be treated
            as financial, legal or investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* =========================
   TRUST ITEM
========================= */

function TrustItem({ icon: Icon, title, text }) {
  return (
    <div className="text-center">

      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/[0.05]">
        <Icon
          size={17}
          className="text-emerald-400"
        />
      </div>

      <p className="mt-2 text-[11px] font-bold">
        {title}
      </p>

      <p className="mt-1 text-[9px] text-white/35">
        {text}
      </p>
    </div>
  );
}

/* =========================
   SOCIAL ICON
========================= */

function SocialIcon({ icon: Icon }) {
  return (
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:text-emerald-400"
    >
      <Icon size={16} />
    </button>
  );
}