import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="login-container">
        {/* Left panel */}
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-icon">📝</div>
            <span className="brand-name">DevOps Notes</span>
          </div>
          <h1 className="login-headline">
            Start Your<br />
            <span className="headline-accent">DevOps Journey.</span>
          </h1>
          <p className="login-desc">
            Join thousands of engineers documenting their infrastructure, pipelines, and deployments in one place.
          </p>
          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Instant note creation</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <span>Full-text search across notes</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏷️</span>
              <span>Tag-based organization</span>
            </div>
          </div>
          <div className="tech-badges">
            <span className="badge">React</span>
            <span className="badge">Node.js</span>
            <span className="badge">Docker</span>
            <span className="badge">K8s</span>
          </div>
        </div>

        {/* Right panel */}
        <div className="login-right">
          <div className="login-card">
            <div className="card-header">
              <h2 className="card-title">Create account</h2>
              <p className="card-subtitle">Get started for free today</p>
            </div>

            {error && (
              <div className="login-error">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="field-group">
                <label className="field-label">Username</label>
                <div className="field-wrap">
                  <span className="field-icon">👤</span>
                  <input
                    className="field-input"
                    value={form.username}
                    onChange={set('username')}
                    placeholder="johndoe"
                    minLength={3}
                    maxLength={50}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Email Address</label>
                <div className="field-wrap">
                  <span className="field-icon">✉️</span>
                  <input
                    className="field-input"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <span className="field-icon">🔑</span>
                  <input
                    className="field-input"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Min. 6 characters"
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="btn-spinner" />
                    Creating account...
                  </span>
                ) : (
                  <span className="btn-content">
                    Create Account
                    <span className="btn-arrow">→</span>
                  </span>
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>Already have an account?</span>
            </div>

            <Link to="/login" className="register-link">
              Sign in instead
            </Link>
          </div>

          <p className="login-copyright">
            © 2025 DevOps Notes · Secure · Scalable · Production-Ready
          </p>
        </div>
      </div>
    </div>
  );
}
