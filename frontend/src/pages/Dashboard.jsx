import React, { useState, useEffect } from 'react';
import { matchOpportunities } from '../utils/api';
import { ProgressBar, ScoreBadge, SkillTag, TypeBadge, Btn } from '../components/UI';

const FILTERS = ['all', 'internship', 'startup-role', 'hackathon'];

export default function Dashboard({ studentProfile, setPage, setSelectedOpp, bookmarks, setBookmarks }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const skills = studentProfile?.skills || [];
        const data = await matchOpportunities(skills);
        setOpportunities(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, [studentProfile]);

  const toggleBookmark = (id) => {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  let filtered = opportunities;
  if (filter !== 'all') filtered = filtered.filter(o => o.type === filter);
  if (search.trim()) {
    const s = search.toLowerCase();
    filtered = filtered.filter(o =>
      o.title.toLowerCase().includes(s) ||
      o.company.toLowerCase().includes(s) ||
      o.requiredSkills.some(sk => sk.toLowerCase().includes(s))
    );
  }
  if (sortBy === 'score') filtered = [...filtered].sort((a, b) => b.score - a.score);
  if (sortBy === 'deadline') filtered = [...filtered].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  if (sortBy === 'bookmarks') filtered = [...filtered].sort((a, b) => (bookmarks.includes(b.id) ? 1 : 0) - (bookmarks.includes(a.id) ? 1 : 0));

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 16 }}>
      <div className="loader" />
      <p style={{ color: 'var(--text2)' }}>Finding your matches...</p>
    </div>
  );

  return (
    <div style={{ padding: '48px 24px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ animation: 'fadeUp 0.5s ease' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>
            Opportunities {studentProfile && <span style={{ color: 'var(--accent3)', fontSize: 22 }}>for {studentProfile.name}</span>}
          </h1>
          <p style={{ color: 'var(--text2)' }}>
            {studentProfile ? `Matched against ${studentProfile.skills.length} of your skills` : 'Browse all opportunities'}
            {' '}&mdash; {filtered.length} results
          </p>
        </div>
        {studentProfile && (
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '12px 20px',
            display: 'flex', gap: 20,
          }}>
            {[
              { label: 'Strong Match', count: opportunities.filter(o => o.score >= 80).length, color: '#22d3a0' },
              { label: 'Good Match', count: opportunities.filter(o => o.score >= 50 && o.score < 80).length, color: '#fbbf24' },
              { label: 'Partial', count: opportunities.filter(o => o.score < 50).length, color: '#f87171' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, company, or skill..."
          style={{
            flex: 1, minWidth: 220, padding: '10px 14px',
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text)', fontSize: 14,
            fontFamily: 'DM Sans, sans-serif', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />

        <div style={{ display: 'flex', gap: 4, background: 'var(--card)', borderRadius: 10, padding: 4 }}>
          {FILTERS.map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: filter === f ? 'var(--bg3)' : 'transparent',
                color: filter === f ? 'var(--text)' : 'var(--text3)',
                cursor: 'pointer', fontSize: 12, fontWeight: 500,
                fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {f === 'startup-role' ? 'Startup' : f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            padding: '9px 14px', background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text2)', fontSize: 13,
            fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="score">Sort: Best Match</option>
          <option value="deadline">Sort: Deadline</option>
          <option value="bookmarks">Sort: Bookmarked</option>
        </select>
      </div>

      {/* Opportunity grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {filtered.map((opp, i) => (
          <OpportunityCard
            key={opp.id}
            opp={opp}
            bookmarked={bookmarks.includes(opp.id)}
            onBookmark={() => toggleBookmark(opp.id)}
            onClick={() => { setSelectedOpp(opp); setPage('detail'); }}
            index={i}
            hasProfile={!!studentProfile}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--text2)' }}>
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>No results found</p>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

function OpportunityCard({ opp, bookmarked, onBookmark, onClick, index, hasProfile }) {
  const deadline = new Date(opp.deadline);
  const today = new Date();
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '22px',
        cursor: 'pointer', transition: 'all 0.2s ease',
        animation: 'fadeUp 0.4s ease ' + (index * 0.06) + 's both',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border2)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <TypeBadge type={opp.type} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={e => { e.stopPropagation(); onBookmark(); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 18, padding: 4, opacity: bookmarked ? 1 : 0.4,
              transition: 'opacity 0.2s',
            }}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {bookmarked ? 'Remove' : 'Save'}
          </button>
        </div>
      </div>

      {/* Title & company */}
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{opp.title}</h3>
      <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 14 }}>{opp.company}</p>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
          {opp.location}
        </span>
        <span style={{ fontSize: 12, color: opp.stipend ? 'var(--green)' : 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
          {opp.stipend}
        </span>
        <span style={{ fontSize: 12, color: daysLeft <= 7 ? '#f87171' : 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4 }}>
          {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
        </span>
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: hasProfile ? 16 : 0 }}>
        {opp.requiredSkills.slice(0, 4).map(s => (
          <SkillTag
            key={s}
            skill={s}
            variant={opp.matched?.includes(s) ? 'matched' : opp.missing?.includes(s) ? 'missing' : 'default'}
          />
        ))}
        {opp.requiredSkills.length > 4 && (
          <span style={{ fontSize: 12, color: 'var(--text3)', padding: '4px 6px' }}>+{opp.requiredSkills.length - 4} more</span>
        )}
      </div>

      {/* Score */}
      {hasProfile && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>Match Score</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: opp.score >= 80 ? '#22d3a0' : opp.score >= 50 ? '#fbbf24' : '#f87171' }}>
              {opp.score}%
            </span>
          </div>
          <ProgressBar score={opp.score} />
        </div>
      )}
    </div>
  );
}
