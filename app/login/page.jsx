'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  Compass,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
} from 'lucide-react';

export default function LoginPage() {
  const loginVideoUrl = process.env.NEXT_PUBLIC_LOGIN_VIDEO_URL;
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setSubmitMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    const nextErrors = {};
    const email = form.email.trim();

    if (!email) {
      nextErrors.email = 'Enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!form.password) {
      nextErrors.password = 'Enter your password.';
    } else if (!passwordRegex.test(form.password)) {
      nextErrors.password =
        'Password must be at least 8 characters and include 1 uppercase, 1 lowercase, and 1 number.';
    }

    setErrors(nextErrors);
    setSubmitMessage('');

    if (Object.keys(nextErrors).length) {
      event.currentTarget.elements
        .namedItem(nextErrors.email ? 'email' : 'password')
        ?.focus();

      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Connect to the GenVilla authentication API when available.
      setSubmitMessage(
        'Sign-in isn’t available yet. You can continue exploring GenVilla without an account.'
      );
    } catch {
      setSubmitMessage(
        'We couldn’t sign you in. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    'h-12 w-full rounded-xl border bg-white py-3 pl-11 text-sm text-ink placeholder:text-ink/50 transition focus:border-green focus:ring-2 focus:ring-green/15 disabled:cursor-wait disabled:opacity-60';

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">

      {/* HEADER */}
      <header className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:px-10">

        <Link
          href="/"
          aria-label="GenVilla home"
          className="shrink-0 rounded-sm"
        >
          <img
            src="/login/genvilla.logo.jpeg"
            alt="GenVilla"
            className="h-[68px] w-[165px] object-contain"
          />
        </Link>

        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold text-ink/70 transition hover:text-green sm:text-sm"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to home</span>
        </Link>

      </header>

      {/* MAIN */}
      <main className="flex flex-1 items-center justify-center px-4 py-3 sm:px-8 sm:py-5">

        <div className="grid w-full max-w-[980px] overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-soft lg:grid-cols-2">

          {/* LEFT VIDEO PANEL */}
          <aside
            aria-labelledby="login-intro"
            className="relative hidden min-h-[520px] overflow-hidden text-white lg:flex"
          >

            {loginVideoUrl && (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={loginVideoUrl} type="video/mp4" />
              </video>
            )}

            <div className="absolute inset-0 bg-[#082f27]/70" />

            <div className="relative z-10 flex w-full flex-col p-10">

              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d3e3d8]">
                Real estate, made clear
              </p>

              <h2
                id="login-intro"
                className="mt-7 font-serif text-[38px] leading-[1.1] tracking-tight"
              >
                A place to begin.
                <br />

                <em className="font-normal text-[#d8e7dc]">
                  A clearer way
                  <br />
                  to decide.
                </em>
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-white/85">
                Make smarter property decisions with GenVilla,
                from your first search to your next move.
              </p>

              <ul className="my-7 space-y-5">
                {[
                  [
                    Building2,
                    'Find your next property',
                    'Explore homes in the places you love.',
                  ],
                  [
                    Calculator,
                    'Understand the numbers',
                    'Plan with property and affordability tools.',
                  ],
                  [
                    Compass,
                    'Decide with confidence',
                    'Discover schemes and smart property insights.',
                  ],
                ].map(([Icon, title, description]) => (

                  <li
                    key={title}
                    className="flex items-start gap-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                      <Icon
                        size={18}
                        className="text-[#d8e7dc]"
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <p className="text-sm font-semibold">
                        {title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/80">
                        {description}
                      </p>
                    </div>
                  </li>

                ))}
              </ul>

              <div className="mt-auto border-t border-white/20 pt-5">

                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#d8e7dc]">

                  <MapPin
                    size={14}
                    aria-hidden="true"
                  />

                  Your city. Your possibilities.

                </p>

                <p className="mt-3 text-xs leading-6 text-white/80">
                  Gurugram · Ghaziabad · Sonipat
                  <br />
                  Noida · New Delhi
                </p>

              </div>

            </div>
          </aside>

          {/* RIGHT LOGIN FORM */}
          <section
            aria-labelledby="login-heading"
            className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-9"
          >

            <p className="eyebrow">
              Your next chapter
            </p>

            <h1
              id="login-heading"
              className="mt-3 font-serif text-[36px] leading-tight tracking-tight sm:text-[40px]"
            >
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-ink/70">
              Sign in to continue exploring properties, calculators,
              government schemes, and smart property insights.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              aria-busy={isSubmitting}
              className="mt-6"
            >

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-4 text-ink/50"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? 'email-error' : undefined
                    }
                    className={`${inputClass} pr-4 ${
                      errors.email
                        ? 'border-red-700'
                        : 'border-ink/20'
                    }`}
                  />

                </div>

                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-2 text-xs text-red-700"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="mt-4">

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-4 text-ink/50"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby="password-help password-error"
                    className={`${inputClass} pr-14 ${
                      errors.password
                        ? 'border-red-700'
                        : 'border-ink/20'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    aria-controls="password"
                    disabled={isSubmitting}
                    className="absolute right-1 top-1 flex h-10 w-11 items-center justify-center rounded-lg text-ink/60 transition hover:bg-sage/50 hover:text-green disabled:cursor-wait disabled:opacity-60"
                  >

                    {showPassword ? (
                      <EyeOff
                        size={18}
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        size={18}
                        aria-hidden="true"
                      />
                    )}

                  </button>

                </div>

                {errors.password ? (
                  <p
                    id="password-error"
                    role="alert"
                    className="mt-2 text-xs leading-5 text-red-700"
                  >
                    {errors.password}
                  </p>
                ) : (
                  <p
                    id="password-help"
                    className="mt-2 text-xs leading-5 text-ink/55"
                  >
                    Minimum 8 characters, including 1 uppercase,
                    1 lowercase and 1 number.
                  </p>
                )}

              </div>

              {/* REMEMBER + FORGOT */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs sm:text-sm">

                <label
                  htmlFor="rememberMe"
                  className="flex min-h-10 cursor-pointer items-center gap-2.5 text-ink/80"
                >

                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-ink/25 accent-green"
                  />

                  Remember me

                </label>

                <Link
                  href="/forgot-password"
                  className="inline-flex min-h-10 items-center rounded-sm font-semibold text-green underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>

              </div>

              {/* SIGN IN */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-green mt-4 min-h-[46px] w-full focus-visible:ring-4 focus-visible:ring-green/20 disabled:cursor-wait disabled:opacity-60"
              >

                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={17}
                      aria-hidden="true"
                      className="animate-spin motion-reduce:animate-none"
                    />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={17}
                      aria-hidden="true"
                    />
                  </>
                )}

              </button>

              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >

                {submitMessage && (
                  <p className="mt-4 rounded-xl border border-green/20 bg-sage/40 p-3 text-sm leading-6 text-green">
                    {submitMessage}
                  </p>
                )}

              </div>

            </form>

            {/* CREATE ACCOUNT */}
            <p className="mt-5 border-t border-ink/10 pt-5 text-center text-sm leading-6 text-ink/70">

              Don&apos;t have an account?{' '}

              <Link
                href="/signup"
                className="inline-block rounded-sm font-semibold text-green underline-offset-4 hover:underline"
              >
                Create account
              </Link>

            </p>

          </section>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="px-5 py-4 text-center text-xs leading-5 text-ink/60">
        <p>
          GenVilla. A clearer way to find your place.
        </p>
      </footer>

    </div>
  );
}
