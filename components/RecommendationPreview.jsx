'use client';

import {
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Gauge,
  TrendingUp,
  Home,
  MapPin,
  ShieldCheck,
  Target,
  LockKeyhole,
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

export default function RecommendationPreview() {
  const data = [
    { value: 72 },
    { value: 28 },
  ];

  return (
    <div
      className="
        overflow-hidden
        rounded-[30px]
        border
        border-black/10
        bg-white
        p-5
        text-[#102721]
        shadow-[0_24px_70px_rgba(24,45,38,0.12)]
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-[0_30px_85px_rgba(24,45,38,0.16)]
        md:p-7
      "
    >
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-6">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#14684f]">
            Smart Recommendation Preview
          </p>

          <h3 className="mt-3 font-serif text-[28px] leading-none text-[#101c18]">
            M3M Antalya Hills
          </h3>

          <div className="mt-3 flex items-center gap-2 text-sm text-black/50">
            <MapPin size={15} />
            <span>Sector 79 · Gurugram · 3 BHK</span>
          </div>
        </div>

        <button
          className="
            flex
            items-center
            gap-3
            rounded-full
            bg-[#e4f7e8]
            px-6
            py-3
            font-bold
            text-[#14684f]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-[#d7f2de]
            hover:shadow-lg
          "
        >
          BUY
          <span className="text-xl">→</span>
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.8fr]">

        {/* FIT SCORE */}
        <div
          className="
            group
            relative
            flex
            min-h-[400px]
            flex-col
            items-center
            justify-center
            overflow-hidden
            rounded-[20px]
            border
            border-black/10
            bg-white
            p-5
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_16px_40px_rgba(18,73,55,0.10)]
          "
        >
          <div className="relative h-56 w-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={82}
                  outerRadius={98}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  <Cell fill="#117653" />
                  <Cell fill="#dcebe2" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <strong className="font-serif text-[54px] leading-none text-[#101c18]">
                72
              </strong>

              <span className="mt-2 text-[12px] font-semibold uppercase tracking-wide text-[#32775f]">
                Fit Score
              </span>

              <span className="mt-3 rounded-lg bg-[#e1f4e7] px-3 py-1 text-xs font-semibold text-[#14684f]">
                Good Fit
              </span>
            </div>
          </div>

          <p className="mt-5 max-w-[230px] text-center text-sm leading-6 text-black/60">
            This property aligns well with your financial profile and goals.
          </p>

          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-25">
            <div className="absolute bottom-2 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#67b795] to-transparent" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="grid grid-cols-2 gap-4">

          <Metric
            icon={Home}
            label="Property Price"
            value="₹ 2.42 Cr"
            tag="Market aligned"
            tagClass="bg-[#e3f5e8] text-[#227956]"
          />

          <Metric
            icon={IndianRupee}
            label="True Cost"
            value="₹ 2.68 Cr"
            tag="Incl. all charges"
            tagClass="bg-[#e8f1ff] text-[#2c66b8]"
          />

          <Metric
            icon={Gauge}
            label="Estimated EMI"
            value="₹ 1.54 L/mo"
            tag="31% of income"
            tagClass="bg-[#efebff] text-[#5f47b8]"
          />

          <Metric
            icon={TrendingUp}
            label="Rental ROI"
            value="3.8%"
            tag="Good return"
            tagClass="bg-[#fff2dd] text-[#c36c00]"
          />
        </div>
      </div>

      {/* REASONS */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Reason
          icon={ShieldCheck}
          text="Strong location demand and rental potential"
          good
        />

        <Reason
          icon={AlertTriangle}
          text="Registration costs need a larger cash buffer"
        />
      </div>

      {/* AFFORDABILITY */}
      <div
        className="
          mt-4
          rounded-2xl
          border
          border-black/10
          bg-white
          px-5
          py-4
          transition-all
          duration-300
          hover:shadow-md
        "
      >
        <div className="flex items-center gap-4">
          <Gauge size={21} className="text-[#16835e]" />

          <p className="text-sm font-medium text-[#293a34]">
            EMI uses 31% of estimated household income
          </p>

          <div className="ml-auto hidden h-2 w-[38%] overflow-hidden rounded-full bg-black/10 md:block">
            <div className="h-full w-[31%] rounded-full bg-[#16835e]" />
          </div>

          <span className="text-sm font-semibold">31%</span>
        </div>
      </div>

      {/* TRUST ROW */}
      <div className="mt-5 grid gap-4 border-t border-black/10 pt-5 sm:grid-cols-2 xl:grid-cols-4">
        <TrustItem
          icon={ShieldCheck}
          title="Data-backed insights"
          text="Trusted & transparent"
        />

        <TrustItem
          icon={Target}
          title="Personalized for you"
          text="Tailored to your profile"
        />

        <TrustItem
          icon={TrendingUp}
          title="Real-time analysis"
          text="Always up to date"
        />

        <TrustItem
          icon={LockKeyhole}
          title="Private & secure"
          text="Your data stays safe"
        />
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tag,
  tagClass,
}) {
  return (
    <div
      className="
        group
        rounded-[18px]
        border
        border-black/10
        bg-white
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#92c9b1]
        hover:shadow-[0_12px_30px_rgba(18,73,55,0.10)]
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-[#e5f4eb]
            text-[#27815f]
            transition-transform
            duration-300
            group-hover:scale-110
          "
        >
          <Icon size={18} />
        </div>

        <span className="text-[13px] text-black/65">
          {label}
        </span>
      </div>

      <div className="mt-5 text-[27px] font-medium text-[#101c18]">
        {value}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <span
          className={`rounded-md px-3 py-1 text-xs font-medium ${tagClass}`}
        >
          {tag}
        </span>

        <div className="flex h-9 items-end gap-1 opacity-80">
          <span className="h-2 w-1 rounded bg-[#13825d]/40" />
          <span className="h-4 w-1 rounded bg-[#13825d]/55" />
          <span className="h-3 w-1 rounded bg-[#13825d]/70" />
          <span className="h-6 w-1 rounded bg-[#13825d]" />
        </div>
      </div>
    </div>
  );
}

function Reason({ icon: Icon, text, good }) {
  return (
    <div
      className={`
        group
        flex
        min-h-[90px]
        items-center
        gap-4
        overflow-hidden
        rounded-[18px]
        border
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
        ${
          good
            ? 'border-[#caeadb] bg-[#f2fbf6]'
            : 'border-[#f2dfbd] bg-[#fffaf0]'
        }
      `}
    >
      <div
        className={`
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-full
          transition-transform
          duration-300
          group-hover:scale-110
          ${
            good
              ? 'bg-[#dff4e8] text-[#17805b]'
              : 'bg-[#fff0ca] text-[#c88310]'
          }
        `}
      >
        <Icon size={20} />
      </div>

      <p className="text-sm leading-6 text-[#263832]">
        {text}
      </p>
    </div>
  );
}

function TrustItem({ icon: Icon, title, text }) {
  return (
    <div className="group flex items-center gap-3">
      <Icon
        size={23}
        className="
          shrink-0
          text-[#2b956e]
          transition-transform
          duration-300
          group-hover:scale-110
        "
      />

      <div>
        <p className="text-xs font-semibold text-[#23352f]">
          {title}
        </p>

        <p className="mt-1 text-[11px] text-black/45">
          {text}
        </p>
      </div>
    </div>
  );
}