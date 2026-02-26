require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API from environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();

// CORS — allow all origins in dev, restrict via FRONTEND_URL in production
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : true;

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

const opportunities = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'opportunities.json'), 'utf8')
);

const ALL_SKILLS = [
  "React", "JavaScript", "TypeScript", "CSS", "HTML", "Git", "Node.js", "MongoDB", "REST APIs",
  "PostgreSQL", "Docker", "Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL", "Pandas",
  "Statistics", "Data Visualization", "Linux", "CI/CD", "Kubernetes", "AWS", "Solidity", "Figma",
  "UI/UX Design", "Swift", "Xcode", "iOS Development", "OOP", "GraphQL", "Redis", "Firebase", "Vue",
  "Angular", "Express", "Django", "Flask", "Spring Boot", "Java", "C++", "C#", "Go", "Rust", "PHP",
  "Ruby", "Scala", "Kotlin", "R", "MATLAB", "Tableau", "Power BI", "Spark", "NLP", "CUDA", "Web3.js",
  "Ethers.js", "Terraform", "Jenkins", "GitLab CI", "GitHub Actions", "Selenium", "Jest", "Pytest"
];

const LEARNING_RESOURCES = {
  "React": { platform: "Scrimba", url: "https://scrimba.com/learn/learnreact", time: "~20 hrs" },
  "Node.js": { platform: "The Odin Project", url: "https://www.theodinproject.com/paths/full-stack-javascript", time: "~30 hrs" },
  "Python": { platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", time: "~25 hrs" },
  "Machine Learning": { platform: "Coursera (Andrew Ng)", url: "https://www.coursera.org/learn/machine-learning", time: "~60 hrs" },
  "Docker": { platform: "Docker Docs", url: "https://docs.docker.com/get-started/", time: "~10 hrs" },
  "SQL": { platform: "SQLZoo", url: "https://sqlzoo.net", time: "~12 hrs" },
  "TypeScript": { platform: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/", time: "~8 hrs" },
  "AWS": { platform: "AWS Free Tier + Tutorials", url: "https://aws.amazon.com/getting-started/", time: "~20 hrs" },
  "Figma": { platform: "Figma Academy", url: "https://www.figma.com/resources/learn-design/", time: "~10 hrs" },
  "MongoDB": { platform: "MongoDB University", url: "https://university.mongodb.com", time: "~15 hrs" },
  "Swift": { platform: "Apple Dev Tutorials", url: "https://developer.apple.com/tutorials/swiftui", time: "~30 hrs" },
  "Git": { platform: "Atlassian Git Tutorials", url: "https://www.atlassian.com/git/tutorials", time: "~6 hrs" },
};

function normalizeSkill(s) {
  return s.toLowerCase().replace(/[.\s-]/g, '');
}

function matchSkills(studentSkills, requiredSkills) {
  const normStudent = studentSkills.map(normalizeSkill);
  const matched = [];
  const missing = [];

  for (const req of requiredSkills) {
    if (normStudent.includes(normalizeSkill(req))) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  }

  const score = requiredSkills.length > 0
    ? Math.round((matched.length / requiredSkills.length) * 100)
    : 0;

  return { matched, missing, score };
}

app.post('/api/match', (req, res) => {
  const { skills } = req.body;
  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({ error: 'skills array required' });
  }
  const results = opportunities.map(opp => {
    const { matched, missing, score } = matchSkills(skills, opp.requiredSkills);
    return { ...opp, matched, missing, score };
  });
  results.sort((a, b) => b.score - a.score);
  res.json(results);
});

app.post('/api/match/:id', (req, res) => {
  const opp = opportunities.find(o => o.id === req.params.id);
  if (!opp) return res.status(404).json({ error: 'Not found' });
  const { skills } = req.body;
  const { matched, missing, score } = matchSkills(skills || [], opp.requiredSkills);
  res.json({ ...opp, matched, missing, score });
});

app.post('/api/recommendations', (req, res) => {
  const { skills } = req.body;
  if (!skills) return res.status(400).json({ error: 'skills required' });

  const missingCount = {};
  for (const opp of opportunities) {
    const { missing } = matchSkills(skills, opp.requiredSkills);
    for (const s of missing) {
      missingCount[s] = (missingCount[s] || 0) + 1;
    }
  }

  const recommended = Object.entries(missingCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([skill, count]) => ({
      skill,
      opportunitiesUnlocked: count,
      resource: LEARNING_RESOURCES[skill] || null,
    }));

  const nearMatches = opportunities
    .map(opp => {
      const { matched, missing, score } = matchSkills(skills, opp.requiredSkills);
      return { ...opp, matched, missing, score };
    })
    .filter(o => o.score >= 40 && o.score < 80)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  res.json({ recommended, nearMatches });
});

app.post('/api/extract-skills', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Extract all explicit and implicit technical skills, tools, programming languages, and frameworks from the following resume text. Focus on technical skills (e.g., React, Python, Docker, Figma, Data Analysis, SEO) rather than soft skills.
    
    Resume Text:
    ${text}
    
    Return ONLY a raw JSON array of strings containing the unique skill names. Do not use markdown backticks or any other formatting, just the raw JSON like: ["Skill 1", "Skill 2"]`;

    const result = await model.generateContent(prompt);
    let output = result.response.text();
    output = output.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedSkills = JSON.parse(output);

    if (Array.isArray(parsedSkills)) {
      return res.json({ skills: parsedSkills });
    } else {
      throw new Error("Parsed output is not an array");
    }
  } catch (error) {
    console.error("Gemini API error or parsing error:", error);
    const lowerText = text.toLowerCase();
    const found = ALL_SKILLS.filter(skill =>
      lowerText.includes(skill.toLowerCase())
    );
    return res.json({ skills: found });
  }
});

// ── Serve React frontend build in production ──────────────────────────────────
const frontendBuild = path.join(__dirname, 'public');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
