import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../utils/api';
import { Card, Btn, SkillTag, ProgressBar, TypeBadge } from '../components/UI';

const TIPS = [
  { title: 'Build Projects', desc: 'Create 2-3 portfolio projects using your target skills. GitHub presence matters more than certificates.' },
  { title: 'Take Online Courses', desc: 'Platforms like Coursera, Scrimba, and The Odin Project offer free, high-quality curriculum.' },
  { title: 'Contribute to OSS', desc: 'Open source contributions show real-world experience and collaboration skills.' },
  { title: 'Write About It', desc: 'Blogging or posting on LinkedIn about what you\'re learning signals engagement and communication.' },
  { title: 'Apply Early & Often', desc: 'Don\'t wait until you feel "ready". Apply for roles where you match 60%+ and learn the rest on the job.' },
  { title: 'Track Your Progress', desc: 'Set weekly learning goals. Even 1 hour/day compounds fast over 3 months.' },
];

export default function Recommendations({ studentProfile, setPage, setSelectedOpp }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!studentProfile) return;
      setLoading(true);
      try {
        const result = await getRecommendations(studentProfile.skills);
        setData(result);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, [studentProfile]);

  if (!studentProfile) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Set up your profile first</h2>
      <p style={{ color: 'var(--text2)', marginBottom: 24 }}>We need to know your skills to generate recommendations.</p>
      <Btn onClick={() => setPage('profile')}>Build My Profile</Btn>
    </div>
  );

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 16 }}>
      <div className="loader" />
      <p style={{ color: 'var(--text2)' }}>Analyzing your skill gaps...</p>
    </div>
  );

  return (
    <div style={{ padding: '48px 24px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 40, animation: 'fadeUp 0.5s ease' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Recommendations</h1>
        <p style={{ color: 'var(--text2)' }}>
          Based on your {studentProfile.skills.length} skills, here's how to unlock more opportunities.
        </p>
      </div>

      {/* Your skills summary */}
      <Card style={{ marginBottom: 24, animation: 'fadeUp 0.5s ease 0.05s both' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Your Current Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {studentProfile.skills.map(s => <SkillTag key={s} skill={s} variant="student" />)}
        </div>
        <Btn size="sm" variant="secondary" onClick={() => setPage('profile')} style={{ marginTop: 14 }}>
          Edit Skills
        </Btn>
      </Card>

      {/* Top skills to learn */}
      {data?.recommended && data.recommended.length > 0 && (
        <div style={{ marginBottom: 32, animation: 'fadeUp 0.5s ease 0.1s both' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Skills to Learn Next</h2>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 20 }}>
            Ranked by how many more opportunities each skill will unlock.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {data.recommended.map((rec, i) => (
              <SkillRecommendation key={rec.skill} rec={rec} rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Near-match opportunities */}
      {data?.nearMatches && data.nearMatches.length > 0 && (
        <div style={{ marginBottom: 32, animation: 'fadeUp 0.5s ease 0.15s both' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Almost There</h2>
          <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 20 }}>
            Opportunities where you're 40–79% matched. Learn 1-2 skills to qualify.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {data.nearMatches.map((opp, i) => (
              <NearMatchCard
                key={opp.id}
                opp={opp}
                index={i}
                onClick={() => { setSelectedOpp(opp); setPage('detail'); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div style={{ animation: 'fadeUp 0.5s ease 0.2s both' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Pro Tips</h2>
        <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 20 }}>
          Strategies to accelerate your job search and skill development.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {TIPS.map((tip, i) => (
            <Card key={i} style={{ animation: 'fadeUp 0.4s ease ' + (i * 0.08) + 's both' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{tip.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.6 }}>{tip.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillRecommendation({ rec, rank }) {
  const [hovered, setHovered] = React.useState(false);
  const rankColors = ['#fbbf24', '#94a3b8', '#b45309'];
  const rankColor = rank <= 3 ? rankColors[rank - 1] : 'var(--text3)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--card)', border: '1px solid ' + (hovered ? 'var(--border2)' : 'var(--border)'),
        borderRadius: 14, padding: 20,
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? 'var(--shadow)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18,
            color: rankColor, width: 28,
          }}>#{rank}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{rec.skill}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
              Unlocks <span style={{ color: '#22d3a0', fontWeight: 600 }}>{rec.opportunitiesUnlocked}</span> more opportunities
            </div>
          </div>
        </div>
      </div>

      {rec.resource && (
        <div style={{
          background: 'var(--bg2)', borderRadius: 8, padding: '10px 12px',
          border: '1px solid var(--border)', marginTop: 8,
        }}>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>RECOMMENDED RESOURCE</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{rec.resource.platform}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>{rec.resource.time}</div>
        </div>
      )}
    </div>
  );
}

function NearMatchCard({ opp, onClick }) {
  const deadline = new Date(opp.deadline);
  const today = new Date();
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border2)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <TypeBadge type={opp.type} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>{opp.score}% match</span>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{opp.title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 12 }}>{opp.company} · {opp.location}</p>

      <ProgressBar score={opp.score} />

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, color: '#f87171', fontWeight: 600, marginBottom: 6 }}>Missing:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {opp.missing.slice(0, 3).map(s => (
            <span key={s} style={{
              padding: '3px 8px', borderRadius: 999, fontSize: 11,
              background: 'rgba(248,113,113,0.1)', color: '#f87171',
              border: '1px solid rgba(248,113,113,0.2)',
            }}>
              {s}
            </span>
          ))}
          {opp.missing.length > 3 && (
            <span style={{ fontSize: 11, color: 'var(--text3)', padding: '3px 4px' }}>+{opp.missing.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}
