"use client";

import { useState } from "react";
import * as Icons from "lucide-react";

export default function HomePropertySearch() {
  const [purpose, setPurpose] = useState("buy");

  return (
    <section className="relative z-20 bg-[#fbfcf9] px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="rounded-[28px] border border-[#173c30]/10 bg-white p-5 shadow-[0_18px_50px_rgba(18,55,43,0.10)] md:p-6">

          {/* Buy / Rent + Clear */}
          <div className="flex items-center justify-between border-b border-[#173c30]/10 pb-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPurpose("buy")}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  purpose === "buy"
                    ? "bg-[#0c2b23] text-white shadow-md"
                    : "bg-[#f4f1e9] text-[#173c30]/70"
                }`}
              >
                <Icons.House size={16} />
                Buy
              </button>

              <button
                type="button"
                onClick={() => setPurpose("rent")}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  purpose === "rent"
                    ? "bg-[#0c2b23] text-white shadow-md"
                    : "bg-[#f4f1e9] text-[#173c30]/70"
                }`}
              >
                <Icons.KeyRound size={16} />
                Rent
              </button>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 text-xs font-semibold text-[#173c30]/50 transition hover:text-[#08785a]"
            >
              <Icons.RotateCcw size={14} />
              Clear all
            </button>
          </div>

          {/* Search Fields */}
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr_.8fr_1fr_auto]">

            {/* Location */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#173c30]">
                Location
              </label>

              <div className="relative">
                <Icons.MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#08785a]"
                />

                <input
                  type="text"
                  placeholder="City, sector or locality"
                  className="h-12 w-full rounded-[14px] border border-[#173c30]/15 bg-white pl-11 pr-4 text-sm text-[#173c30] outline-none transition focus:border-[#08785a] focus:ring-2 focus:ring-[#08785a]/10"
                />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#173c30]">
                Property Type
              </label>

              <select className="h-12 w-full rounded-[14px] border border-[#173c30]/15 bg-white px-4 text-sm text-[#173c30] outline-none focus:border-[#08785a]">
                <option>All Property Types</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Independent House</option>
                <option>Plot</option>
              </select>
            </div>

            {/* BHK */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#173c30]">
                BHK
              </label>

              <select className="h-12 w-full rounded-[14px] border border-[#173c30]/15 bg-white px-4 text-sm text-[#173c30] outline-none focus:border-[#08785a]">
                <option>Any BHK</option>
                <option>1 BHK</option>
                <option>2 BHK</option>
                <option>3 BHK</option>
                <option>4 BHK</option>
                <option>4+ BHK</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#173c30]">
                Budget
              </label>

              <select className="h-12 w-full rounded-[14px] border border-[#173c30]/15 bg-white px-4 text-sm text-[#173c30] outline-none focus:border-[#08785a]">
                <option>Any Budget</option>
                <option>Under ₹50 Lakh</option>
                <option>₹50L – ₹1Cr</option>
                <option>₹1Cr – ₹2Cr</option>
                <option>₹2Cr+</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex items-end">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#08785a] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(8,120,90,0.20)] transition-all hover:-translate-y-0.5 hover:bg-[#066b50] lg:w-auto"
              >
                <Icons.Search size={17} />
                Search
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}