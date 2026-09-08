'use client';

import '../login/login.css';

import { useState } from 'react';
import Link from 'next/link';

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
} from 'lucide-react';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({
    text: '',
    type: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setMessage({
      text: '',
      type: '',
    });
  }

  function validateForm() {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = 'Please enter a valid email.';
    }

    if (!form.password) {
      newErrors.password = 'Please enter a password.';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!form.agree) {
      newErrors.agree = 'Please accept the terms.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage({
      text: '',
      type: '',
    });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      setMessage({
        text: 'Signup authentication will be connected to GenVilla soon.',
        type: 'success',
      });
    } catch {
      setMessage({
        text: 'Something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          id="backgroundVideo"
        >
          <source
            src="/login/front-end video.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="background-overlay" />

      <main className="login-page signup-page">
        <div className="login-container">
          <section className="welcome-section">
            <div className="welcome-content">
              <Link
                href="/"
                className="logo"
                aria-label="GenVilla Home"
              >
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
                Create your GenVilla account to discover
                properties, analyze affordability, compare
                costs and make smarter real-estate decisions.
              </p>

              <div className="benefits">
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <ShieldCheck size={19} />
                  </div>

                  <div className="benefit-text">
                    <h3>Secure Account</h3>
                    <p>
                      Keep your property journey and account
                      information protected.
                    </p>
                  </div>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">
                    <Home size={19} />
                  </div>

                  <div className="benefit-text">
                    <h3>Discover Properties</h3>
                    <p>
                      Explore listings and property insights
                      in one place.
                    </p>
                  </div>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">
                    <TrendingUp size={19} />
                  </div>

                  <div className="benefit-text">
                    <h3>Analyze Smarter</h3>
                    <p>
                      Use affordability, cost, ROI and risk
                      tools before you decide.
                    </p>
                  </div>
                </div>
              </div>

              <div className="trust-message">
                <CheckCircle2
                  size={15}
                  style={{ color: '#13d39b' }}
                />

                <span>
                  Find · Analyze · Own with GenVilla
                </span>
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-container">
              <div className="form-header">
                <h2>Create Account</h2>

                <p>
                  Join GenVilla and start making smarter
                  property decisions.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="name">
                    Full Name
                  </label>

                  <div
                    className={`input-box ${
                      errors.name ? 'error' : ''
                    }`}
                  >
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                    />

                    <span className="email-icon">
                      <User size={17} />
                    </span>
                  </div>

                  <small className="error-message">
                    {errors.name}
                  </small>
                </div>

                <div className="input-group">
                  <label htmlFor="email">
                    Email
                  </label>

                  <div
                    className={`input-box ${
                      errors.email ? 'error' : ''
                    }`}
                  >
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

                  <small className="error-message">
                    {errors.email}
                  </small>
                </div>

                <div className="input-group">
                  <label htmlFor="password">
                    Password
                  </label>

                  <div
                    className={`input-box ${
                      errors.password ? 'error' : ''
                    }`}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>

                  <small className="error-message">
                    {errors.password}
                  </small>
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password
                  </label>

                  <div
                    className={`input-box ${
                      errors.confirmPassword ? 'error' : ''
                    }`}
                  >
                    <input
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
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

                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={form.agree}
                      onChange={handleChange}
                    />

                    <span className="custom-checkbox" />

                    <span>
                      I agree to the terms
                    </span>
                  </label>
                </div>

                {errors.agree && (
                  <small className="error-message">
                    {errors.agree}
                  </small>
                )}

                {message.text && (
                  <div
                    className={`login-message ${message.type}`}
                  >
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`login-button ${
                    isLoading ? 'loading' : ''
                  }`}
                >
                  <span className="button-content">
                    <Lock size={15} />
                    <span>Create Account</span>
                  </span>

                  <span className="loading-spinner" />
                </button>
              </form>

              <div className="divider">
                <span />
                <p>or continue with</p>
                <span />
              </div>

              <div className="social-login">
                <button
                  type="button"
                  className="social-button"
                >
                  <span className="google-icon">
                    G
                  </span>

                  <span>Google</span>
                </button>

                <button
                  type="button"
                  className="social-button"
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

              <div className="register-section">
                <span>
                  Already have an account?
                </span>

                <Link href="/login">
                  Login
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-copyright">
          © 2026 GenVilla
        </div>

        <div className="footer-links">
          <Link href="/about">
            About Us
          </Link>

          <span>•</span>

          <Link href="/terms">
            Terms &amp; Conditions
          </Link>

          <span>•</span>

          <Link href="/privacy">
            Privacy
          </Link>
        </div>
      </footer>
    </>
  );
}