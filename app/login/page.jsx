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
  ShieldCheck,
  TrendingUp,
  User,
} from "lucide-react";

export default function LoginPage() {
  const loginVideoUrl = process.env.NEXT_PUBLIC_LOGIN_VIDEO_URL;

  const [identifierType, setIdentifierType] = useState("EMAIL");

  const [form, setForm] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    identifier: "",
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
  // IDENTIFIER TYPE
  // =========================

  function handleIdentifierType(type) {
    setIdentifierType(type);

    setForm((prev) => ({
      ...prev,
      identifier: "",
    }));

    setErrors((prev) => ({
      ...prev,
      identifier: "",
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
      identifier: "",
      password: "",
    };

    const identifier = form.identifier.trim();

    if (!identifier) {
      newErrors.identifier =
        identifierType === "EMAIL"
          ? "Please enter your email."
          : "Please enter your username.";
    } else if (identifierType === "EMAIL") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(identifier)) {
        newErrors.identifier = "Please enter a valid email address.";
      }
    } else {
      const usernameRegex = /^[a-z0-9._]{3,10}$/;

      if (!usernameRegex.test(identifier)) {
        newErrors.identifier =
          "Username must be 3–10 characters using lowercase letters, numbers, dots or underscores.";
      }
    }

    if (!form.password) {
      newErrors.password = "Please enter your password.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    setErrors(newErrors);

    return !newErrors.identifier && !newErrors.password;
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
      if (form.rememberMe && identifierType === "EMAIL") {
        localStorage.setItem("genvillaRememberedEmail", form.identifier.trim());
      } else {
        localStorage.removeItem("genvillaRememberedEmail");
      }

      // ==========================================
      // FRONTEND ONLY
      // REAL AUTH API WILL BE CONNECTED LATER
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
          aria-hidden="true"
          id="backgroundVideo"
        >
          <source src={loginVideoUrl} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      </div>

      <div className="background-overlay" />

      {/* =========================
          LOGIN PAGE
      ========================== */}

      <main className="login-page premium-login-page">
        <div className="login-container">
          {/* =========================
              LEFT PANEL
          ========================== */}

          <section className="welcome-section">
            <div className="welcome-content">
              {/* LOGO - UNCHANGED */}

              <Link href="/" className="logo" aria-label="GenVilla Home">
                <img
                  src="/login/genvilla.logo.jpeg"
                  alt="GenVilla"
                  className="genvilla-login-logo"
                />
              </Link>

              {/* HEADING */}

              <h1>
                Welcome
                <span>Back</span>
              </h1>

              {/* DESCRIPTION */}

              <p className="welcome-description">
                Sign in to your GenVilla account to discover properties, analyze
                affordability, compare costs and make smarter real-estate
                decisions.
              </p>

              {/* BENEFITS */}

              <div className="benefits">
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <ShieldCheck size={19} />
                  </div>

                  <div className="benefit-text">
                    <h3>Secure Account</h3>

                    <p>
                      Keep your property journey and account information
                      protected.
                    </p>
                  </div>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">
                    <Home size={19} />
                  </div>

                  <div className="benefit-text">
                    <h3>Discover Properties</h3>

                    <p>Explore listings and property insights in one place.</p>
                  </div>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">
                    <TrendingUp size={19} />
                  </div>

                  <div className="benefit-text">
                    <h3>Analyze Smarter</h3>

                    <p>
                      Use affordability, cost, ROI and risk tools before you
                      decide.
                    </p>
                  </div>
                </div>
              </div>

              {/* TRUST MESSAGE */}

              <div className="trust-message">
                <CheckCircle2 size={15} style={{ color: "#13d39b" }} />

                <span>Find · Analyze · Own with GenVilla</span>
              </div>
            </div>
          </section>

          {/* =========================
              RIGHT PANEL
          ========================== */}

          <section className="form-section login-form-section">
            <div className="form-container">
              {/* HEADER */}

              <div className="register-page-header login-page-header">
                <div className="register-header-icon">
                  <User size={23} />
                </div>

                <div>
                  <p className="register-kicker">LOGIN PAGE</p>

                  <h2>Welcome back</h2>

                  <span className="register-title-line" />
                </div>
              </div>

              <p className="login-intro">
                Sign in to continue your GenVilla property journey.
              </p>

              {/* =========================
                  EMAIL / USERNAME SELECTOR
              ========================== */}

              <div className="login-identifier-section">
                <div className="login-identifier-heading">
                  <span>Sign in using</span>

                  <small>Choose how you want to log in</small>
                </div>

                <div className="login-identifier-selector">
                  <button
                    type="button"
                    onClick={() => handleIdentifierType("EMAIL")}
                    className={`login-identifier-btn ${
                      identifierType === "EMAIL" ? "active" : ""
                    }`}
                  >
                    Email
                  </button>

                  <button
                    type="button"
                    onClick={() => handleIdentifierType("USERNAME")}
                    className={`login-identifier-btn ${
                      identifierType === "USERNAME" ? "active" : ""
                    }`}
                  >
                    Username
                  </button>
                </div>
              </div>

              {/* =========================
                  LOGIN FORM
              ========================== */}

              <form onSubmit={handleSubmit}>
                {/* IDENTIFIER */}

                <div className="input-group">
                  <label htmlFor="identifier">
                    {identifierType === "EMAIL" ? "Email" : "Username"}
                  </label>

                  <div
                    className={`input-box ${errors.identifier ? "error" : ""}`}
                  >
                    <input
                      type={identifierType === "EMAIL" ? "email" : "text"}
                      id="identifier"
                      name="identifier"
                      placeholder={
                        identifierType === "EMAIL"
                          ? "Enter your email"
                          : "Enter your username"
                      }
                      autoComplete={
                        identifierType === "EMAIL" ? "email" : "username"
                      }
                      value={form.identifier}
                      onChange={(event) => {
                        const value =
                          identifierType === "EMAIL"
                            ? event.target.value.toLowerCase()
                            : event.target.value.toLowerCase();

                        handleChange({
                          target: {
                            name: "identifier",
                            value,
                            type: "text",
                            checked: false,
                          },
                        });
                      }}
                      onBlur={() => {
                        setForm((prev) => ({
                          ...prev,
                          identifier: prev.identifier.trim(),
                        }));
                      }}
                    />

                    <span className="email-icon">
                      <User size={17} />
                    </span>
                  </div>

                  <small className="error-message">{errors.identifier}</small>
                </div>

                {/* PASSWORD */}

                <div className="input-group">
                  <div className="login-password-label">
                    <label htmlFor="password">Password</label>

                    <Link href="/forgot-password" className="forgot-password">
                      Forgot password?
                    </Link>
                  </div>

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

                {/* REMEMBER ME */}

                <div className="form-options login-options">
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
                </div>

                {/* MESSAGE */}

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

                    <span>Log in</span>
                  </span>

                  <span className="loading-spinner" />
                </button>
              </form>

              {/* SECURITY CARD */}

              <div className="login-security-card">
                <div className="login-security-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <strong>Secure GenVilla Login</strong>

                  <p>
                    Your login details stay protected during your property
                    journey.
                  </p>
                </div>
              </div>

              {/* REGISTER */}

              <div className="register-section">
                <span>Don&apos;t have an account?</span>

                <Link href="/signup">Create account</Link>
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
