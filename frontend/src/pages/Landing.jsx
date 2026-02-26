import React from 'react';
import { Btn } from '../components/UI';

export default function Landing({ setPage }) {
  const features = [
    { title: 'Smart Matching', desc: 'Get a match score for every opportunity based on your actual skills.' },
    { title: 'Skill Gap Analysis', desc: 'See exactly which skills you\'re missing and what to learn next.' },
    { title: 'Personalized Recs', desc: 'Discover the highest-ROI skills to unlock more opportunities.' },
    { title: 'Instant Results', desc: 'Upload your resume or type skills — results in seconds.' },
  ];

  const stats = [
    { value: '10+', label: 'Curated Opportunities' },
    { value: '60+', label: 'Tracked Skills' },
    { value: '100%', label: 'Free to Use' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        padding: '80px 24px',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(34,211,160,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Floating orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '8%',
          width: 12, height: 12, borderRadius: '50%',
          background: 'var(--accent)', opacity: 0.4,
          animation: 'float 3s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '12%',
          width: 8, height: 8, borderRadius: '50%',
          background: '#22d3a0', opacity: 0.5,
          animation: 'float 4s ease-in-out infinite 1s',
        }} />
        <div style={{
          position: 'absolute', bottom: '25%', left: '15%',
          width: 6, height: 6, borderRadius: '50%',
          background: '#fbbf24', opacity: 0.4,
          animation: 'float 5s ease-in-out infinite 2s',
        }} />

        <div style={{ textAlign: 'center', maxWidth: 760, position: 'relative', animation: 'fadeUp 0.7s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', background: 'rgba(124,92,252,0.1)',
            border: '1px solid rgba(124,92,252,0.25)', borderRadius: 999,
            fontSize: 13, color: 'var(--accent3)', marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3a0', display: 'inline-block' }} />
            Built for students. Powered by smart matching.
          </div>

          <h1 style={{
            fontSize: 'clamp(44px, 7vw, 80px)',
            fontWeight: 800, letterSpacing: '-0.03em',
            lineHeight: 1.05, marginBottom: 24,
          }}>
            Find opportunities
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #7c5cfc, #22d3a0)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              that fit your skills
            </span>
          </h1>

          <p style={{
            fontSize: 18, color: 'var(--text2)', maxWidth: 560, margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Upload your resume or enter your skills. BridgeNE matches you with internships,
            startup roles, and hackathons — and shows you exactly how to close the gap.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn size="lg" onClick={() => setPage('profile')}>
              Build My Profile
            </Btn>
            <Btn size="lg" variant="secondary" onClick={() => setPage('dashboard')}>
              Browse Opportunities
            </Btn>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 40, justifyContent: 'center', marginTop: 64,
            padding: '24px 40px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 16, border: '1px solid var(--border)',
          }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--accent3)' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>How it works</h2>
            <p style={{ color: 'var(--text2)', fontSize: 16 }}>Three steps to find your perfect opportunity</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 16, padding: 28,
                animation: 'fadeUp 0.5s ease ' + (i * 0.1) + 's both',
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
            Ready to launch your career?
          </h2>
          <p style={{ color: 'var(--text2)', marginBottom: 32, fontSize: 16 }}>
            Takes less than 2 minutes to set up your profile and start matching.
          </p>
          <Btn size="lg" onClick={() => setPage('profile')}>Get Started — It's Free</Btn>
        </div>
      </section>
    </div>
  );
}
