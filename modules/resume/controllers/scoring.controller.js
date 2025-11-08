const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
// modules/resume/controllers/scoring.controller.js
// Simple keyword match % (Jaccard + frequency-ish scoring)
// modules/resume/controllers/scoring.controller.js
// ✅ Resume ATS Matching (Guaranteed stable)

const normalize = s =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const extractKeywords = text => {
  const words = normalize(text);
  const stop = new Set(["and","or","the","a","an","with","of","to","in","for","on","as","by","at"]);
  return new Set(words.filter(w => !stop.has(w) && w.length > 2));
};

exports.match = (req, res) => {
  try {
    const { resume = {}, jobDesc = "" } = req.body || {};

    const resumeSkills = Array.isArray(resume.skills) ? resume.skills : [];
    const resumeBag = new Set(normalize(resumeSkills.join(" ")));

    const jdBag = extractKeywords(jobDesc);

    if (jdBag.size === 0) {
      return res.status(200).json({
        ok: true,
        match: 0,
        covered: [],
        missing: []
      });
    }

    const covered = [];
    const missing = [];

    jdBag.forEach(k => {
      resumeBag.has(k) ? covered.push(k) : missing.push(k);
    });

    const match = Math.round((covered.length / (covered.length + missing.length)) * 100);

    return res.status(200).json({
      ok: true,
      match,
      covered,
      missing
    });

  } catch (err) {
    console.error("Scoring error:", err);
    return res.status(200).json({
      ok: true,
      match: 0,
      covered: [],
      missing: []
    });
  }
};

// -------------------------------------------
// ✅ 1. ATS SCORE CONTROLLER
// -------------------------------------------
exports.atsScore = async (req, res) => {
  const { resume } = req.body;

  if (!resume) return res.status(400).json({ error: "Resume missing" });

  const prompt = `
You are an ATS scoring system. Analyze the following resume and give a JSON output.

Resume:
${JSON.stringify(resume)}

Return ONLY JSON with:
{
  "ats_score": number 0-100,
  "breakdown": {
    "skills": number,
    "clarity": number,
    "structure": number,
    "action_verbs": number,
    "readability": number
  },
  "suggestions": array of strings
}
`;

  try {
    const output = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(output.choices[0].message.content);
    res.json(result);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "ATS scoring failed" });
  }
};


// -------------------------------------------
// ✅ 2. JOB MATCH CONTROLLER
// -------------------------------------------
exports.matchScore = async (req, res) => {
  const { resume, job_description } = req.body;

  if (!resume || !job_description)
    return res.status(400).json({ error: "Resume or JD missing" });

  const prompt = `
You are a career AI system. Compare the resume with the job description.

Resume:
${JSON.stringify(resume)}

Job Description:
${job_description}

Return ONLY JSON in the form:
{
  "match_percent": number 0-100,
  "matched_skills": array,
  "missing_skills": array,
  "suggestions": array
}
`;

  try {
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(result.choices[0].message.content));

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Job match scoring failed" });
  }
};
// modules/resume/controllers/scoring.controller.js
// Simple keyword match % (Jaccard + frequency-ish scoring)
