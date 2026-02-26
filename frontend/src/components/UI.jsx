import React from 'react';

export function ScoreBadge({ score }) {
  const color = score >= 80 ? '#22d3a0' : score >= 50 ? '#fbbf24' : '#f87171';
  const label = score >= 80 ? 'Strong Match' : score >= 50 ? 'Good Match' : 'Partial Match';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: `3px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12,
        color, background: color + '15',
        boxShadow: '0 0 12px ' + color + '30',
      }}>
        {score}%
      </div>
      <span style={{ fontSize: 12, color, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

export function ProgressBar({ score }) {
  const color = score >= 80 ? '#22d3a0' : score >= 50 ? '#fbbf24' : '#f87171';
  const [width, setWidth] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div style={{ background: 'var(--border)', borderRadius: 999, height: 6, overflow: 'hidden', width: '100%' }}>
      <div style={{
        height: '100%', width: width + '%',
        background: 'linear-gradient(90deg, ' + color + '88, ' + color + ')',
        borderRadius: 999,
        transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 0 6px ' + color + '60',
      }} />
    </div>
  );
}

export function SkillTag({ skill, variant }) {
  const v = variant || 'default';
  const map = {
    default: ['var(--bg3)', 'var(--text2)', 'var(--border)'],
    matched: ['rgba(34,211,160,0.1)', '#22d3a0', 'rgba(34,211,160,0.3)'],
    missing: ['rgba(248,113,113,0.1)', '#f87171', 'rgba(248,113,113,0.3)'],
    nice: ['rgba(251,191,36,0.1)', '#fbbf24', 'rgba(251,191,36,0.3)'],
    accent: ['rgba(124,92,252,0.15)', '#c4b5fd', 'rgba(124,92,252,0.3)'],
    student: ['rgba(124,92,252,0.1)', '#a78bfa', 'rgba(124,92,252,0.25)'],
  };
  const [bg, color, border] = map[v] || map.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500,
      background: bg, color, border: '1px solid ' + border,
      whiteSpace: 'nowrap',
    }}>
      {v === 'matched' && '✓ '}
      {v === 'missing' && '✗ '}
      {skill}
    </span>
  );
}

export function TypeBadge({ type }) {
  const config = {
    internship: ['#a78bfa', 'rgba(167,139,250,0.12)', 'Internship'],
    'startup-role': ['#fb923c', 'rgba(251,146,60,0.12)', 'Startup Role'],
    hackathon: ['#22d3a0', 'rgba(34,211,160,0.12)', 'Hackathon'],
  };
  const [color, bg, label] = config[type] || config.internship;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
      color, background: bg, letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      {label}
    </span>
  );
}

export function Card({ children, style, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--card)',
        border: '1px solid ' + (hovered ? 'var(--border2)' : 'var(--border)'),
        borderRadius: 'var(--radius)',
        padding: 24,
        transition: 'all 0.2s ease',
        transform: hovered && onClick ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? 'var(--shadow)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...(style || {}),
      }}
    >
      {children}
    </div>
  );
}

export function Btn({ children, onClick, variant, size, style, disabled }) {
  const [hovered, setHovered] = React.useState(false);
  const v = variant || 'primary';
  const s = size || 'md';
  const sizeMap = {
    sm: { padding: '8px 16px', fontSize: 13 },
    md: { padding: '12px 22px', fontSize: 14 },
    lg: { padding: '16px 32px', fontSize: 16 },
  };
  const varMap = {
    primary: {
      background: hovered ? 'linear-gradient(135deg,#8b6dff,#7c5cfc)' : 'linear-gradient(135deg,#7c5cfc,#6b4de6)',
      color: '#fff',
      border: 'none',
      boxShadow: hovered ? '0 4px 20px rgba(124,92,252,0.5)' : '0 2px 10px rgba(124,92,252,0.3)',
    },
    secondary: {
      background: hovered ? 'var(--bg3)' : 'var(--bg2)',
      color: 'var(--text)',
      border: '1px solid ' + (hovered ? 'var(--border2)' : 'var(--border)'),
    },
    ghost: { background: 'transparent', color: hovered ? 'var(--text)' : 'var(--text2)', border: 'none' },
    green: {
      background: hovered ? 'rgba(34,211,160,0.2)' : 'rgba(34,211,160,0.1)',
      color: '#22d3a0',
      border: '1px solid rgba(34,211,160,0.3)',
    },
    danger: {
      background: 'rgba(248,113,113,0.1)',
      color: '#f87171',
      border: '1px solid rgba(248,113,113,0.3)',
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        borderRadius: 10,
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        outline: 'none',
        ...sizeMap[s],
        ...varMap[v],
        ...(style || {}),
      }}
    >
      {children}
    </button>
  );
}

export function Navbar({ page, setPage, studentProfile }) {
  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'profile', label: 'Profile' },
    { id: 'dashboard', label: 'Opportunities' },
    { id: 'recommendations', label: 'Recommendations' },
  ];
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <div onClick={() => setPage('landing')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18 }}>
            Bridge<span style={{ color: 'var(--accent)' }}>NE</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navItems.map(item => {
            const locked = !studentProfile && item.id !== 'landing' && item.id !== 'profile';
            return (
              <button key={item.id}
                onClick={() => !locked && setPage(item.id)}
                style={{
                  background: page === item.id ? 'var(--bg3)' : 'transparent',
                  border: '1px solid ' + (page === item.id ? 'var(--border)' : 'transparent'),
                  color: page === item.id ? 'var(--text)' : 'var(--text3)',
                  padding: '7px 14px', borderRadius: 8,
                  fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500,
                  cursor: locked ? 'not-allowed' : 'pointer',
                  opacity: locked ? 0.35 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {studentProfile ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', background: 'var(--bg3)', borderRadius: 999,
            border: '1px solid var(--border)',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), #22d3a0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>
              {(studentProfile.name || 'S')[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>{studentProfile.name || 'Student'}</span>
          </div>
        ) : (
          <Btn size="sm" onClick={() => setPage('profile')}>Get Started</Btn>
        )}
      </div>
    </nav>
  );
}
