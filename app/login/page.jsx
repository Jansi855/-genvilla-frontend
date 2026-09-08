"use client";

import "./login.css";

import { useState } from "react";
import Link from "next/link";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  Home,
  Lock,
  Mail,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // =========================
  // INPUT CHANGE
  // =========================

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage({
      text: "",
      type: "",
    });
  }

  // =========================
  // VALIDATION
  // =========================

  function validateForm() {
    const newErrors = {
      email: "",
      password: "",
    };

    const email = form.email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Please enter your email.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Please enter your password.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  }

  // =========================
  // LOGIN
  // =========================

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage({
      text: "",
      type: "",
    });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (form.rememberMe) {
        localStorage.setItem("genvillaRememberedEmail", form.email.trim());
      } else {
        localStorage.removeItem("genvillaRememberedEmail");
      }

      // ==========================================
      // CONNECT YOUR REAL AUTH API HERE LATER
      // ==========================================

      await new Promise((resolve) => setTimeout(resolve, 900));

      setMessage({
        text: "Login authentication will be connected to GenVilla soon.",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // =========================
  // SOCIAL LOGIN
  // =========================

  function handleGoogleLogin() {
    setMessage({
      text: "Google login will be available soon.",
      type: "success",
    });
  }

  function handleMicrosoftLogin() {
    setMessage({
      text: "Microsoft login will be available soon.",
      type: "success",
    });
  }

  return (
    <>
      {/* =========================
          VIDEO BACKGROUND
      ========================== */}

      <div className="video-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          id="backgroundVideo"
        >
          <source src="/login/front-end video.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      </div>

      {/* VIDEO OVERLAY */}

      <div className="background-overlay" />

      {/* =========================
          MAIN LOGIN PAGE
      ========================== */}

      <main className="login-page">
        <div className="login-container">
          {/* =========================
              LEFT SIDE
          ========================== */}

          <section className="welcome-section">
            <div className="welcome-content">
              {/* LOGO */}

              <Link href="/" className="logo" aria-label="GenVilla Home">
                <img
                  src="/login/genvilla.logo.jpeg"
                  alt="GenVilla"
                  className="genvilla-login-logo"
                />
              </Link>

              {/* HEADING */}

              <h1>
                Find Your
                <span>Place</span>
              </h1>

              {/* DESCRIPTION */}

              <p className="welcome-description">
                Access your GenVilla account to discover properties, analyze
                costs, understand affordability and make smarter real-estate
                decisions.
              </p>

              {/* =========================
                  BENEFITS
              ========================== */}

              <div className="benefits">
                {/* BENEFIT 1 */}

                <div className="benefit-card">
                  <div className="benefit-icon">
                    <ShieldCheck size={19} />
                  </div>

                  <div className="benefit-text">
                    <h3>Secure & Safe</h3>

                    <p>Your account and information stay protected.</p>
                  </div>
                </div>

                {/* BENEFIT 2 */}

                <div className="benefit-card">
                  <div className="benefit-icon">
                    <Home size={19} />
                  </div>

                  <div className="benefit-text">
                    <h3>Smart Property Discovery</h3>

                    <p>Explore properties and useful insights in one place.</p>
                  </div>
                </div>

                {/* BENEFIT 3 */}

                <div className="benefit-card">
                  <div className="benefit-icon">
                    <TrendingUp size={19} />
                  </div>

                  <div className="benefit-text">
                    <h3>Smarter Decisions</h3>

                    <p>Analyze affordability, cost, ROI and property risk.</p>
                  </div>
                </div>
              </div>

              {/* TRUST */}

              <div className="trust-message">
                <CheckCircle2 size={15} style={{ color: "#13d39b" }} />

                <span>Find · Analyze · Own with GenVilla</span>
              </div>
            </div>
          </section>

          {/* =========================
              RIGHT SIDE
          ========================== */}

          <section className="form-section">
            <div className="form-container">
              {/* HEADER */}

              <div className="form-header">
                <h2>Login</h2>

                <p>Welcome back! Sign in to your GenVilla account.</p>
              </div>

              {/* =========================
                  LOGIN FORM
              ========================== */}

              <form onSubmit={handleSubmit}>
                {/* EMAIL */}

                <div className="input-group">
                  <label htmlFor="email">Email</label>

                  <div className={`input-box ${errors.email ? "error" : ""}`}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                    />

                    <span className="email-icon">
                      <Mail size={17} />
                    </span>
                  </div>

                  <small className="error-message">{errors.email}</small>
                </div>

                {/* PASSWORD */}

                <div className="input-group">
                  <label htmlFor="password">Password</label>

                  <div
                    className={`input-box ${errors.password ? "error" : ""}`}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={form.password}
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      className="eye-btn"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  <small className="error-message">{errors.password}</small>
                </div>

                {/* REMEMBER + FORGOT */}

                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={form.rememberMe}
                      onChange={handleChange}
                    />

                    <span className="custom-checkbox" />

                    <span>Remember me</span>
                  </label>

                  <Link href="/forgot-password" className="forgot-password">
                    Forgot password?
                  </Link>
                </div>

                {/* LOGIN MESSAGE */}

                {message.text && (
                  <div className={`login-message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`login-button ${isLoading ? "loading" : ""}`}
                >
                  <span className="button-content">
                    <Lock size={15} />

                    <span>Login</span>
                  </span>

                  <span className="loading-spinner" />
                </button>
              </form>

              {/* =========================
                  DIVIDER
              ========================== */}

              <div className="divider">
                <span />

                <p>or continue with</p>

                <span />
              </div>

              {/* =========================
                  SOCIAL LOGIN
              ========================== */}

              <div className="social-login">
                {/* GOOGLE */}

                <button
                  type="button"
                  className="social-button"
                  onClick={handleGoogleLogin}
                >
                  <span className="google-icon">G</span>

                  <span>Google</span>
                </button>

                {/* MICROSOFT */}

                <button
                  type="button"
                  className="social-button"
                  onClick={handleMicrosoftLogin}
                >
                  <span className="microsoft-icon">
                    <span />
                    <span />
                    <span />
                    <span />
                  </span>

                  <span>Microsoft</span>
                </button>
              </div>

              {/* =========================
                  CREATE ACCOUNT
              ========================== */}

              <div className="register-section">
                <span>Don&apos;t have an account?</span>

                <Link href="/signup">Register</Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="site-footer">
        <div className="footer-copyright">© 2026 GenVilla</div>

        <div className="footer-links">
          <Link href="/about">About Us</Link>

          <span>•</span>

          <Link href="/terms">Terms &amp; Conditions</Link>

          <span>•</span>

          <Link href="/privacy">Privacy</Link>
        </div>
      </footer>
    </>
  );
}
