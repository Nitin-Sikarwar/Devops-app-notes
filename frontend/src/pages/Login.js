import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background orbs */}
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
            Build. Deploy.<br />
            <span className="headline-accent">Take Notes.</span>
          </h1>
          <p className="login-desc">
            Your intelligent workspace for DevOps documentation, runbooks, and team knowledge.
          </p>
          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <span>CI/CD Pipeline Notes</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🐳</span>
              <span>Docker & Kubernetes Docs</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure JWT Authentication</span>
            </div>
          </div>
          <div className="tech-badges">
            <span className="badge">React</span>
            <span className="badge">Node.js</span>
            <span className="badge">Docker</span>
            <span className="badge">K8s</span>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="login-right">
          <div className="login-card">
            <div className="card-header">
              <h2 className="card-title">Welcome back</h2>
              <p className="card-subtitle">Sign in to your workspace</p>
            </div>

            {error && (
              <div className="login-error">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
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
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
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
                    Authenticating...
                  </span>
                ) : (
                  <span className="btn-content">
                    Sign In
                    <span className="btn-arrow">→</span>
                  </span>
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>New to DevOps Notes?</span>
            </div>

            <Link to="/register" className="register-link">
              Create your account
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
