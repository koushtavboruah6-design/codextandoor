// In development, the proxy in package.json forwards /api to localhost:3001
// In production, the backend serves the frontend, so /api works on same origin
const BASE = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : '/api';

export async function matchOpportunities(skills) {
  const res = await fetch(`${BASE}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills }),
  });
  if (!res.ok) throw new Error('Match failed');
  return res.json();
}

export async function matchSingle(id, skills) {
  const res = await fetch(`${BASE}/match/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills }),
  });
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

export async function getRecommendations(skills) {
  const res = await fetch(`${BASE}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills }),
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function extractSkills(text) {
  const res = await fetch(`${BASE}/extract-skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
