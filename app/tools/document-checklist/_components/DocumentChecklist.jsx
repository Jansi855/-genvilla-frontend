"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  ClipboardCheck,
  FileText,
  Home,
  KeyRound,
  RotateCcw,
  Store,
} from "lucide-react";
import {
  checklists,
  emptyProgress,
  modes,
  progressFor,
  restoreProgress,
  storageKey,
  updateProgress,
} from "../_lib/checklists";

const modeIcons = { buying: Home, selling: Store, renting: KeyRound };

export default function DocumentChecklist() {
  const [state, setState] = useState(emptyProgress);
  const [loaded, setLoaded] = useState(false);
  const [storageStatus, setStorageStatus] = useState("Loading saved progress…");
  const [canSave, setCanSave] = useState(false);

  useEffect(() => {
    try {
      setState(restoreProgress(window.localStorage.getItem(storageKey)));
      setCanSave(true);
    } catch {
      setStorageStatus(
        "Browser storage is unavailable. Progress stays on this page only.",
      );
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !canSave) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
      setStorageStatus("Progress saved on this browser.");
    } catch {
      setStorageStatus(
        "Progress could not be saved. Changes stay on this page only.",
      );
    }
  }, [state, loaded, canSave]);

  const checklist = checklists[state.mode];
  const completedIds = state.completed[state.mode];
  const progress = progressFor(state);
  const act = (action) =>
    setState((current) => updateProgress(current, action));

  return (
    <main className="min-h-[65vh] bg-cream pb-16">
      <section className="border-b border-ink/10 bg-[#eaf0e7]">
        <div className="mx-auto max-w-[1360px] px-5 py-8 lg:px-10 lg:py-12">
          <Link
            href="/tools"
            className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-green"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Tools
          </Link>
          <p className="eyebrow mt-6">A LITTLE ORDER. A CLEARER NEXT STEP.</p>
          <h1 className="mt-3 font-serif text-4xl tracking-[-.035em] sm:text-5xl lg:text-6xl">
            Document Checklist
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ink/65 sm:text-base">
            Buying, selling or moving into a rental? Keep track of your
            paperwork, one document at a time.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] px-5 pt-8 lg:px-10 lg:pt-10">
        <div
          role="group"
          aria-label="Checklist mode"
          className="flex flex-wrap gap-2"
        >
          {modes.map((mode) => {
            const Icon = modeIcons[mode];
            return (
              <button
                key={mode}
                type="button"
                disabled={!loaded}
                aria-pressed={state.mode === mode}
                onClick={() => act({ type: "mode", mode })}
                className={`inline-flex min-h-12 items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${state.mode === mode ? "border-green bg-green text-white" : "border-ink/15 bg-white text-ink/65 hover:border-green/40 hover:text-green"}`}
              >
                <Icon size={17} aria-hidden="true" />
                {checklists[mode].title}
              </button>
            );
          })}
        </div>

        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[300px_minmax(0,1fr)] xl:gap-10">
          <aside
            className="rounded-[24px] border border-green/15 bg-white p-6 lg:sticky lg:top-28"
            aria-labelledby="progress-title"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/70 text-green">
              <ClipboardCheck size={24} aria-hidden="true" />
            </span>
            <h2 id="progress-title" className="mt-5 font-serif text-2xl">
              Your {checklist.title.toLowerCase()} checklist
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink/60">
              {checklist.description}
            </p>
            <div className="mt-6 flex items-baseline justify-between gap-3">
              <p
                role="status"
                aria-atomic="true"
                className="text-sm font-semibold text-ink"
              >
                {progress.completed} of {progress.total} documents ready
              </p>
              <span className="text-sm font-bold text-green">
                {progress.percent}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`${checklist.title} documents ready`}
              aria-valuenow={progress.completed}
              aria-valuemin={0}
              aria-valuemax={progress.total}
              aria-valuetext={`${progress.completed} of ${progress.total} documents ready`}
              className="mt-3 h-2.5 overflow-hidden rounded-full bg-sage/70"
            >
              <div
                style={{ width: `${progress.percent}%` }}
                className="h-full rounded-full bg-green transition-[width] duration-300 motion-reduce:transition-none"
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-ink/55">
              {progress.completed === progress.total
                ? "All items are ticked. Confirm which documents apply and verify their contents before proceeding."
                : "Tick each document when you have it ready. Some items apply only to certain transactions."}
            </p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled={!loaded || progress.completed === progress.total}
                onClick={() => act({ type: "all" })}
                className="btn-green w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckCheck size={16} aria-hidden="true" />
                Mark all complete
              </button>
              <button
                type="button"
                disabled={!loaded || !progress.completed}
                onClick={() => act({ type: "reset" })}
                className="btn-outline w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={15} aria-hidden="true" />
                Reset checklist
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-ink/55">
              These actions affect {checklist.title.toLowerCase()} only. Your
              other checklists keep their progress.
            </p>
            <div className="mt-5 border-t border-ink/10 pt-4">
              <p role="status" className="text-xs leading-5 text-ink/60">
                {storageStatus}
              </p>
              <p className="mt-2 text-xs leading-5 text-ink/45">
                Only checklist choices are saved. No document uploads or
                personal details are needed.
              </p>
            </div>
          </aside>

          <section
            aria-label={`${checklist.title} document groups`}
            aria-busy={!loaded}
            className="min-w-0 space-y-5"
          >
            {checklist.groups.map((group, index) => {
              const done = group.documents.filter((document) =>
                completedIds.includes(document.id),
              ).length;
              return (
                <fieldset
                  key={`${state.mode}-${group.id}`}
                  disabled={!loaded}
                  className="min-w-0 rounded-[22px] border border-ink/10 bg-white px-5 pb-2 sm:px-7"
                >
                  <legend className="max-w-full px-2">
                    <span className="inline-flex flex-wrap items-center gap-3 bg-white py-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage/60 text-xs font-bold text-green">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-serif text-xl text-ink sm:text-2xl">
                        {group.title}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-sage/40 px-2.5 py-1 text-[11px] font-semibold text-green">
                        {done === group.documents.length && (
                          <Check size={12} aria-hidden="true" />
                        )}
                        {done}/{group.documents.length}
                      </span>
                    </span>
                  </legend>
                  <div className="divide-y divide-ink/10">
                    {group.documents.map((document) => {
                      const id = `${state.mode}-${document.id}`;
                      const checked = completedIds.includes(document.id);
                      return (
                        <div key={document.id} className="py-4">
                          <label
                            htmlFor={id}
                            className="flex cursor-pointer items-start gap-3 rounded-lg p-1 sm:gap-4"
                          >
                            <input
                              id={id}
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                act({ type: "toggle", id: document.id })
                              }
                              aria-describedby={`${id}-description`}
                              className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-ink/25 accent-[#155f4b]"
                            />
                            <span className="min-w-0">
                              <span
                                className={`text-sm font-semibold ${checked ? "text-green" : "text-ink"}`}
                              >
                                {document.title}
                              </span>
                              {document.conditional && (
                                <span className="ml-2 inline-block rounded-full bg-cream px-2 py-0.5 text-[10px] text-ink/55">
                                  If applicable
                                </span>
                              )}
                              <span
                                id={`${id}-description`}
                                className="mt-1.5 block text-xs leading-6 text-ink/60 sm:text-sm"
                              >
                                {document.description}
                              </span>
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </section>
        </div>

        <div className="mt-9 flex items-start gap-3 rounded-2xl border border-green/10 bg-[#eaf0e7] p-5 text-xs leading-6 text-ink/65">
          <FileText
            size={18}
            className="mt-1 shrink-0 text-green"
            aria-hidden="true"
          />
          <p>
            Document requirements may vary by property, lender, state and
            transaction. Verify final requirements with the relevant authority
            or professional.
          </p>
        </div>
        <details className="mt-4 text-xs leading-6 text-ink/55">
          <summary className="w-fit cursor-pointer rounded">
            Reference guidance
          </summary>
          <div className="mt-2 space-y-1">
            <p>
              <a
                href="https://appln.hdfc.bank.in/loanapplication/instructions.php"
                className="text-green underline underline-offset-2"
              >
                HDFC Bank home-loan document guidance
              </a>{" "}
              — lender requirements depend on the application.
            </p>
            <p>
              <a
                href="https://mohua.gov.in/upload/uploadfiles/files/Model-Tenancy-Act-English-02_06_2021.pdf"
                className="text-green underline underline-offset-2"
              >
                MoHUA Model Tenancy Act
              </a>{" "}
              — model guidance; verify the rules applicable in your state.
            </p>
          </div>
        </details>
      </div>
    </main>
  );
}
