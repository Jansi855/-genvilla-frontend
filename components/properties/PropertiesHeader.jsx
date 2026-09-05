import * as Icons from "lucide-react";

export default function PropertiesHeader() {
  return (
    <>
      {/* =========================
          PROPERTIES HERO
      ========================= */}
      <section className="relative overflow-hidden border-b border-ink/10">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/properties/properties-hero.webp"
            alt="Modern residential properties"
            className="h-full w-full object-cover object-center"
          />

          {/* Left overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#eef1ea] via-[#eef1ea]/92 to-transparent" />

          {/* Bottom overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#eef1ea]/35 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[1360px] px-5 pb-28 pt-14 lg:px-10 lg:pb-32 lg:pt-20">
          <div className="max-w-[690px]">
            <p className="eyebrow text-[#08785a]">
              PROPERTY DISCOVERY
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-[-.035em] text-[#102b23] md:text-6xl lg:text-7xl">
              Find a Property
              <br />
              That Fits Your Life
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#173c30]/65 md:text-lg md:leading-8">
              Explore homes in Gurugram, Ghaziabad, Sonipat, Noida and New Delhi,
              compare costs, understand risk and make a smarter property decision.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          REALISTIC INFO STRIP
      ========================= */}
      <div className="relative z-20 mx-auto -mt-16 max-w-[1280px] px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-[26px] border border-[#173c30]/10 bg-white shadow-[0_18px_50px_rgba(18,55,43,0.10)] sm:grid-cols-2 xl:grid-cols-4">

          {/* Property Discovery */}
          <div className="group flex gap-4 p-6 transition-colors duration-300 hover:bg-[#f6faf7]">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e8f4ec] text-[#08785a]">
              <Icons.House size={24} strokeWidth={1.7} />
            </div>

            <div>
              <h3 className="font-bold text-[#102b23]">
                Property Discovery
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#173c30]/60">
                Explore carefully selected properties across supported locations.
              </p>
            </div>
          </div>

          {/* 5 NCR Cities */}
          <div className="group flex gap-4 border-[#173c30]/10 p-6 transition-colors duration-300 hover:bg-[#f6faf7] xl:border-l">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e8f4ec] text-[#08785a]">
              <Icons.MapPinned size={24} strokeWidth={1.7} />
            </div>

            <div>
              <h3 className="font-bold text-[#102b23]">
                5 NCR Cities
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#173c30]/60">
                Gurugram · Ghaziabad · Sonipat · Noida · New Delhi
              </p>
            </div>
          </div>

          {/* Smart Analysis */}
          <div className="group flex gap-4 border-[#173c30]/10 p-6 transition-colors duration-300 hover:bg-[#f6faf7] xl:border-l">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e8f4ec] text-[#08785a]">
              <Icons.ChartNoAxesCombined size={24} strokeWidth={1.7} />
            </div>

            <div>
              <h3 className="font-bold text-[#102b23]">
                Smart Analysis
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#173c30]/60">
                Compare affordability, true cost, ROI and risk before you decide.
              </p>
            </div>
          </div>

          {/* Clear Decisions */}
          <div className="group flex gap-4 border-[#173c30]/10 p-6 transition-colors duration-300 hover:bg-[#f6faf7] xl:border-l">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e8f4ec] text-[#08785a]">
              <Icons.BadgeCheck size={24} strokeWidth={1.7} />
            </div>

            <div>
              <h3 className="font-bold text-[#102b23]">
                Clear Decisions
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#173c30]/60">
                Get personalized insights to Buy, Wait or Rent with confidence.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}