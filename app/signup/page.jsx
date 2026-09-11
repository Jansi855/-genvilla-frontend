"use client";

import "../login/login.css";

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
  User,
} from "lucide-react";

export default function SignupPage() {
  const loginVideoUrl = process.env.NEXT_PUBLIC_LOGIN_VIDEO_URL;

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Frontend UI state only
  const [accountType, setAccountType] = useState("BUYER");

  const [errors, setErrors] = useState({});

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const [isLoading, setIsLoading] = useState(false);

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

  function validateForm() {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-z0-9._]{3,10}$/;

    // Full Name
    if (!form.name.trim()) {
      newErrors.name = "Please enter your full name.";
    } else if (form.name.trim().length > 100) {
      newErrors.name = "Full name cannot exceed 100 characters.";
    }

    // Username
    if (!form.username.trim()) {
      newErrors.username = "Please enter a username.";
    } else if (!usernameRegex.test(form.username)) {
      newErrors.username = "Use 3-10 lowercase letters, numbers, . or _.";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email.";
    }

    // Password
    if (!form.password) {
      newErrors.password = "Please enter a password.";
    } else if (form.password.length < 12) {
      newErrors.password = "Password must be at least 12 characters.";
    } else if (form.password.length > 128) {
      newErrors.password = "Password cannot exceed 128 characters.";
    } else if (form.password !== form.password.trim()) {
      newErrors.password = "Password cannot start or end with spaces.";
    }

    // Confirm Password
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Terms
    if (!form.agree) {
      newErrors.agree = "Please accept the terms.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

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
      // FRONTEND SIMULATION ONLY
      // No backend/API call has been added or changed.
      await new Promise((resolve) => setTimeout(resolve, 900));

      setMessage({
        text: "Signup authentication will be connected to GenVilla soon.",
        type: "success",
      });
    } catch {
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
      {/* Background video */}
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

      <main className="login-page signup-page">
        <div className="login-container">
          {/* LEFT SIDE */}
          <section className="welcome-section">
            <div className="welcome-content">
              <Link href="/" className="logo" aria-label="GenVilla Home">
                <img
                  src="/login/genvilla.logo.jpeg"
                  alt="GenVilla"
                  className="genvilla-login-logo"
                />
              </Link>

              <h1>
                Start Your
                <span>Journey</span>
              </h1>

              <p className="welcome-description">
                Create your GenVilla account to discover properties, analyze
                affordability, compare costs and make smarter real-estate
                decisions.
              </p>

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

              <div className="trust-message">
                <CheckCircle2 size={15} style={{ color: "#13d39b" }} />

                <span>Find · Analyze · Own with GenVilla</span>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="form-section">
            <div className="form-container">
              {/* Header */}
              <div className="form-header auth-reference-header">
                <div className="auth-title-row">
                  <div className="auth-title-icon">
                    <User size={22} />
                  </div>

                  <div>
                    <p className="auth-kicker">REGISTER PAGE</p>

                    <h2>Create your account</h2>
                  </div>
                </div>

                <p>
                  Join GenVilla as a buyer or seller and start your property
                  journey.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* FULL NAME */}
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>

                  <div className={`input-box ${errors.name ? "error" : ""}`}>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                    />

                    <span className="email-icon">
                      <User size={17} />
                    </span>
                  </div>

                  <small className="error-message">{errors.name}</small>
                </div>

                {/* USERNAME */}
                <div className="input-group">
                  <label htmlFor="username">Username</label>

                  <div
                    className={`input-box ${errors.username ? "error" : ""}`}
                  >
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Choose a username"
                      autoComplete="username"
                      value={form.username}
                      onChange={(event) =>
                        handleChange({
                          target: {
                            ...event.target,
                            value: event.target.value.toLowerCase(),
                          },
                        })
                      }
                    />

                    <span className="email-icon">
                      <User size={17} />
                    </span>
                  </div>

                  <small className="error-message">{errors.username}</small>
                </div>

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
                      onChange={(event) =>
                        handleChange({
                          target: {
                            ...event.target,
                            value: event.target.value.toLowerCase(),
                          },
                        })
                      }
                      onBlur={() =>
                        setForm((prev) => ({
                          ...prev,
                          email: prev.email.trim().toLowerCase(),
                        }))
                      }
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
                      placeholder="Create a password"
                      autoComplete="new-password"
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

                  <p className="password-hint">
                    Use 12–128 characters. Internal spaces are allowed.
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>

                  <div
                    className={`input-box ${
                      errors.confirmPassword ? "error" : ""
                    }`}
                  >
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      className="eye-btn"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>

                  <small className="error-message">
                    {errors.confirmPassword}
                  </small>
                </div>

                {/* ACCOUNT TYPE */}
                <div className="input-group">
                  <div className="account-type-heading">
                    <label>Account Type</label>

                    <span>Choose how you'll use GenVilla</span>
                  </div>

                  <div className="account-type-selector">
                    <button
                      type="button"
                      onClick={() => setAccountType("BUYER")}
                      className={`account-type-btn ${
                        accountType === "BUYER" ? "active" : ""
                      }`}
                    >
                      <span className="account-type-icon">
                        <Home size={20} />
                      </span>

                      <span className="account-type-content">
                        <strong>Buyer</strong>
                        <small>Looking to buy a property</small>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType("SELLER")}
                      className={`account-type-btn ${
                        accountType === "SELLER" ? "active" : ""
                      }`}
                    >
                      <span className="account-type-icon">
                        <TrendingUp size={20} />
                      </span>

                      <span className="account-type-content">
                        <strong>Seller</strong>
                        <small>Looking to sell a property</small>
                      </span>
                    </button>
                  </div>
                </div>

                {/* TERMS */}
                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={form.agree}
                      onChange={handleChange}
                    />

                    <span className="custom-checkbox" />

                    <span>I agree to the terms</span>
                  </label>
                </div>

                {errors.agree && (
                  <small className="error-message">{errors.agree}</small>
                )}

                {/* MESSAGE */}
                {message.text && (
                  <div className={`login-message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`login-button ${isLoading ? "loading" : ""}`}
                >
                  <span className="button-content">
                    <Lock size={15} />
                    <span>Create Account</span>
                  </span>

                  <span className="loading-spinner" />
                </button>
              </form>

              {/* BUILDER */}
              <div className="builder-callout">
                <div>
                  <p className="builder-title">
                    Want to register as a builder?
                  </p>

                  <p className="builder-text">
                    Builders use a separate verified registration flow.
                  </p>
                </div>

                <Link href="/builder-register" className="builder-link">
                  Become a verified Builder →
                </Link>
              </div>

              {/* LOGIN LINK */}
              <div className="register-section">
                <span>Already have an account?</span>

                <Link href="/login">Log in</Link>
              </div>
            </div>
          </section>
        </div>
      </main>

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
