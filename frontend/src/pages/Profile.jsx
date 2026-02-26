import React, { useState } from 'react';
import { Btn, SkillTag, Card } from '../components/UI';
import { extractSkills } from '../utils/api';

const SUGGESTED_SKILLS = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'CSS', 'HTML',
  'SQL', 'MongoDB', 'PostgreSQL', 'Docker', 'Git', 'AWS', 'Machine Learning',
  'TensorFlow', 'PyTorch', 'Figma', 'Swift', 'Pandas', 'Linux', 'CI/CD',
  'REST APIs', 'GraphQL', 'Solidity', 'Data Visualization', 'Statistics',
];

export default function Profile({ studentProfile, setStudentProfile, setPage }) {
  const [name, setName] = useState(studentProfile?.name || '');
  const [email, setEmail] = useState(studentProfile?.email || '');
  const [skills, setSkills] = useState(studentProfile?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [tab, setTab] = useState('manual');
  const [extracting, setExtracting] = useState(false);
  const [saved, setSaved] = useState(false);

  const addSkill = (s) => {
    const cleaned = s.trim();
    if (cleaned && !skills.find(sk => sk.toLowerCase() === cleaned.toLowerCase())) {
      setSkills([...skills, cleaned]);
    }
  };

  const removeSkill = (s) => setSkills(skills.filter(sk => sk !== s));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkill(skillInput);
        setSkillInput('');
      }
    }
  };

  const handleExtract = async () => {
    if (!resumeText.trim()) return;
    setExtracting(true);
    try {
      const { skills: extracted } = await extractSkills(resumeText);
      const newSkills = [...skills];
      extracted.forEach(s => {
        if (!newSkills.find(sk => sk.toLowerCase() === s.toLowerCase())) {
          newSkills.push(s);
        }
      });
      setSkills(newSkills);
      setTab('manual');
    } catch (e) {
      // fallback: simple local extraction
      const allSkills = SUGGESTED_SKILLS;
      const lower = resumeText.toLowerCase();
      const found = allSkills.filter(s => lower.includes(s.toLowerCase()));
      const newSkills = [...skills];
      found.forEach(s => {
        if (!newSkills.find(sk => sk.toLowerCase() === s.toLowerCase())) {
          newSkills.push(s);
        }
      });
      setSkills(newSkills);
      setTab('manual');
    }
    setExtracting(false);
  };

  const handleSave = () => {
    if (!name.trim() || skills.length === 0) return;
    setStudentProfile({ name, email, skills });
    setSaved(true);
    setTimeout(() => {
      setPage('dashboard');
    }, 800);
  };

  return (
    <div style={{ padding: '48px 24px', maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 40, animation: 'fadeUp 0.5s ease' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Your Profile</h1>
        <p style={{ color: 'var(--text2)' }}>Tell us who you are and what you can do. We'll handle the matching.</p>
      </div>

      {/* Basic info */}
      <Card style={{ marginBottom: 24, animation: 'fadeUp 0.5s ease 0.1s both' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Basic Info</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 8, fontWeight: 500 }}>
              Full Name *
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Alex Johnson"
              style={{
                width: '100%', padding: '10px 14px',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--text)', fontSize: 14,
                fontFamily: 'DM Sans, sans-serif',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 8, fontWeight: 500 }}>
              Email
            </label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="alex@university.edu"
              style={{
                width: '100%', padding: '10px 14px',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--text)', fontSize: 14,
                fontFamily: 'DM Sans, sans-serif',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card style={{ marginBottom: 24, animation: 'fadeUp 0.5s ease 0.2s both' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Skills</h2>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 20 }}>Add your skills manually or paste your resume text for auto-extraction.</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg2)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {['manual', 'resume'].map(t => (
            <button key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 20px', borderRadius: 8, border: 'none',
                background: tab === t ? 'var(--card)' : 'transparent',
                color: tab === t ? 'var(--text)' : 'var(--text3)',
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {t === 'manual' ? 'Manual Entry' : 'Paste Resume'}
            </button>
          ))}
        </div>

        {tab === 'manual' ? (
          <>
            {/* Input */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill and press Enter..."
                style={{
                  flex: 1, padding: '10px 14px',
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 8, color: 'var(--text)', fontSize: 14,
                  fontFamily: 'DM Sans, sans-serif', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <Btn onClick={() => { if (skillInput.trim()) { addSkill(skillInput); setSkillInput(''); } }} variant="secondary">
                Add
              </Btn>
            </div>

            {/* Added skills */}
            {skills.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>YOUR SKILLS ({skills.length})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {skills.map(s => (
                    <button key={s} onClick={() => removeSkill(s)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                      background: 'rgba(124,92,252,0.12)', color: '#a78bfa',
                      border: '1px solid rgba(124,92,252,0.25)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      {s} <span style={{ opacity: 0.6, fontSize: 14 }}>×</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>QUICK ADD</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SUGGESTED_SKILLS.filter(s => !skills.find(sk => sk.toLowerCase() === s.toLowerCase())).slice(0, 16).map(s => (
                  <button key={s} onClick={() => addSkill(s)} style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                    background: 'var(--bg3)', color: 'var(--text3)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.target.style.color = 'var(--text)'; e.target.style.borderColor = 'var(--border2)'; }}
                    onMouseLeave={e => { e.target.style.color = 'var(--text3)'; e.target.style.borderColor = 'var(--border)'; }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your resume text here... We'll automatically extract skills like React, Python, Docker, etc."
              rows={10}
              style={{
                width: '100%', padding: '12px 14px',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--text)', fontSize: 14,
                fontFamily: 'DM Sans, sans-serif', resize: 'vertical',
                outline: 'none', lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Btn onClick={handleExtract} disabled={!resumeText.trim() || extracting}>
                {extracting ? 'Extracting...' : 'Extract Skills'}
              </Btn>
              <span style={{ fontSize: 13, color: 'var(--text3)' }}>
                We'll scan for tech skills and frameworks automatically
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, animation: 'fadeUp 0.5s ease 0.3s both' }}>
        <Btn
          size="lg"
          onClick={handleSave}
          disabled={!name.trim() || skills.length === 0}
        >
          {saved ? 'Saved! Redirecting...' : 'Find My Matches'}
        </Btn>
        {(!name.trim() || skills.length === 0) && (
          <span style={{ fontSize: 13, color: 'var(--text3)' }}>
            {!name.trim() ? 'Enter your name' : 'Add at least one skill'} to continue
          </span>
        )}
      </div>
    </div>
  );
}
