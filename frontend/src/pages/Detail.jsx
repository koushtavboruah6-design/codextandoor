import React, { useState, useEffect } from 'react';
import { matchSingle } from '../utils/api';
import { ScoreBadge, ProgressBar, SkillTag, TypeBadge, Btn, Card } from '../components/UI';

export default function Detail({ opp: initialOpp, studentProfile, setPage, bookmarks, setBookmarks }) {
  const [opp, setOpp] = useState(initialOpp);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialOpp) return;
    async function load() {
      if (!studentProfile) return;
      setLoading(true);
      try {
        const data = await matchSingle(initialOpp.id, studentProfile.skills);
        setOpp(data);
      } catch (e) {
        setOpp(initialOpp);
      }
      setLoading(false);
    }
    load();
  }, [initialOpp?.id]);

  if (!opp) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <p style={{ color: 'var(--text2)' }}>No opportunity selected.</p>
      <Btn onClick={() => setPage('dashboard')} style={{ marginTop: 16 }}>Back to Dashboard</Btn>
    </div>
  );

  const isBookmarked = bookmarks.includes(opp.id);
  const deadline = new Date(opp.deadline);
  const today = new Date();
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  return (
    <div style={{ padding: '48px 24px', maxWidth: 860, margin: '0 auto' }}>
      {/* Back */}
      <button
        onClick={() => setPage('dashboard')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer',
          fontSize: 14, marginBottom: 28, fontFamily: 'DM Sans, sans-serif',
          padding: 0, transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
      >
        ← Back to Opportunities
      </button>

      {/* Header card */}
      <Card style={{ marginBottom: 24, animation: 'fadeUp 0.5s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              <TypeBadge type={opp.type} />
              {daysLeft <= 7 && daysLeft > 0 && (
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', fontWeight: 600 }}>
                  Closing soon
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, lineHeight: 1.2 }}>{opp.title}</h1>
            <p style={{ fontSize: 16, color: 'var(--text2)', fontWeight: 500 }}>{opp.company}</p>
          </div>

          {studentProfile && (
            <div style={{ textAlign: 'center' }}>
              {loading ? (
                <div className="loader" style={{ width: 32, height: 32 }} />
              ) : (
                <ScoreBadge score={opp.score || 0} />
              )}
            </div>
          )}
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20, padding: '16px 0', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {[
            { label: opp.location },
            { label: opp.stipend },
            { label: daysLeft > 0 ? `${daysLeft} days left (${opp.deadline})` : `Deadline: ${opp.deadline}` },
          ].map((m, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, color: 'var(--text2)' }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* Match bar */}
        {studentProfile && !loading && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>Overall Match</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: opp.score >= 80 ? '#22d3a0' : opp.score >= 50 ? '#fbbf24' : '#f87171' }}>
                {opp.matched?.length || 0} of {opp.requiredSkills?.length || 0} required skills matched
              </span>
            </div>
            <ProgressBar score={opp.score || 0} />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <Btn>Apply Now</Btn>
          <Btn
            variant={isBookmarked ? 'green' : 'secondary'}
            onClick={() => setBookmarks(prev => prev.includes(opp.id) ? prev.filter(b => b !== opp.id) : [...prev, opp.id])}
          >
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Btn>
          <Btn variant="secondary" onClick={() => setPage('recommendations')}>
            Get Skills
          </Btn>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Description */}
        <Card style={{ animation: 'fadeUp 0.5s ease 0.1s both' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>About This Role</h2>
          <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: 14 }}>{opp.description}</p>

          {opp.tags && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>
              {opp.tags.map(tag => (
                <span key={tag} style={{
                  padding: '3px 10px', borderRadius: 999, fontSize: 11,
                  background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)',
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Skills breakdown */}
        <Card style={{ animation: 'fadeUp 0.5s ease 0.15s both' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Required Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {opp.requiredSkills.map(s => (
              <SkillTag
                key={s}
                skill={s}
                variant={studentProfile ? (opp.matched?.includes(s) ? 'matched' : 'missing') : 'default'}
              />
            ))}
          </div>

          {opp.niceToHave && (
            <>
              <h3 style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8, marginTop: 8, fontWeight: 600 }}>NICE TO HAVE</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {opp.niceToHave.map(s => <SkillTag key={s} skill={s} variant="nice" />)}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Skill Gap Analysis */}
      {studentProfile && (
        <Card style={{ animation: 'fadeUp 0.5s ease 0.2s both' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Skill Gap Analysis</h2>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 20 }}>A breakdown of how your skills compare to what's needed.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Matched', value: opp.matched?.length || 0, color: '#22d3a0', icon: '✓' },
              { label: 'Missing', value: opp.missing?.length || 0, color: '#f87171', icon: '✗' },
              { label: 'Nice to Have', value: opp.niceToHave?.length || 0, color: '#fbbf24', icon: '◎' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'var(--bg2)', borderRadius: 12, padding: 16, textAlign: 'center',
                border: '1px solid var(--border)',
              }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {opp.matched && opp.matched.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#22d3a0', fontWeight: 600, marginBottom: 8 }}>✓ SKILLS YOU HAVE</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {opp.matched.map(s => <SkillTag key={s} skill={s} variant="matched" />)}
              </div>
            </div>
          )}

          {opp.missing && opp.missing.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#f87171', fontWeight: 600, marginBottom: 8 }}>✗ SKILLS TO LEARN</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {opp.missing.map(s => <SkillTag key={s} skill={s} variant="missing" />)}
              </div>
              <div style={{ marginTop: 12 }}>
                <Btn size="sm" onClick={() => setPage('recommendations')}>
                  Get Learning Resources
                </Btn>
              </div>
            </div>
          )}

          {opp.missing && opp.missing.length === 0 && (
            <div style={{
              background: 'rgba(34,211,160,0.08)', border: '1px solid rgba(34,211,160,0.2)',
              borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div>
                <p style={{ color: '#22d3a0', fontWeight: 600, fontSize: 14 }}>You match all required skills!</p>
                <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 2 }}>You're a strong candidate. Go ahead and apply!</p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
