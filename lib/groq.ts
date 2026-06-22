import Groq from "groq-sdk";
import type { ResumeData, ResumeGenerationResult } from "@/types/resume";
import { masterResume as defaultResume } from "./resume-data";
import { v4 as uuidv4 } from "uuid";

function resumeToText(resume: ResumeData): string {
  return [
    resume.summary,
    ...(resume.experience || []).flatMap((e) => [e.title, e.company, ...e.bullets]),
    ...Object.values(resume.skills || {}).flat(),
    ...(resume.projects || []).flatMap((p) => [p.name, p.description, ...p.bullets, ...(p.technologies || [])]),
    ...(resume.education || []).flatMap((e) => [e.degree, e.field, e.institution]),
    ...(resume.certifications || []).map((c) => c.name),
  ].filter(Boolean).join(" ").toLowerCase();
}

function calcAtsScore(resume: ResumeData, keywords: string[]): number {
  if (!keywords.length) return 0;
  const text = resumeToText(resume);
  let score = 0;
  for (const kw of keywords) {
    const normalized = kw.toLowerCase().trim();
    if (!normalized) continue;
    if (text.includes(normalized)) {
      score += 1;
    } else if (normalized.includes(" ")) {
      // partial credit: all individual words present
      const words = normalized.split(/\s+/).filter((w) => w.length > 2);
      if (words.length > 0 && words.every((w) => text.includes(w))) {
        score += 0.6;
      }
    }
  }
  return Math.min(100, Math.round((score / keywords.length) * 100));
}

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume optimizer. Your single goal is to maximise keyword coverage so the resume scores 90+ on any ATS checker, while keeping every claim 100% truthful.

CRITICAL RULES — EVERY RULE IS MANDATORY:

ACCURACY
1. NEVER fabricate experience, skills, certifications, or achievements not in the original resume
2. NEVER invent metrics or numbers — only reuse figures already in the original

KEYWORD COVERAGE (most important for ATS score)
3. MANDATORY FULL COVERAGE — every keyword in extractedRequirements.skills, extractedRequirements.technologies, and extractedRequirements.keywords MUST appear verbatim at least once in the optimizedResume. Before writing the JSON, mentally scan each keyword list and confirm coverage.
4. USE EXACT JD PHRASING — never substitute abbreviations for full terms the JD spells out. If JD says "continuous integration", write "continuous integration" not "CI". If JD uses "CI/CD pipelines", use that exact string.
5. If the JD uses both a full form AND an abbreviation (e.g., "CI/CD" and "Continuous Integration"), include BOTH in the resume so either form matches.
6. PRESERVE ATS PHRASES already in the master resume word-for-word (e.g. "scalable web applications", "RESTful API design", "MVC architecture", "security best practices").
7. EMBED the exact job title from the JD in the first sentence of the summary.
8. Reorder each skills array so JD-matching terms appear first; NEVER remove any existing skill; add JD skill terms that the candidate plausibly has based on their work history.

CONTENT VOLUME (more content = more keyword surface area)
9. Summary: 3–4 sentences, 65–90 words, embed the job title AND at least 8 distinct JD keywords.
10. KEEP ALL experience entries — never drop a role. Keep 3–5 bullets per role; choose bullets that can embed the most JD keywords.
11. Target 800–1100 total words across the full resume.

QUALITY
12. Use strong action verbs: developed, built, implemented, designed, integrated, architected, automated, optimized, deployed, collaborated, led, enhanced, streamlined.

RESPOND WITH ONLY VALID JSON — no markdown, no code blocks, no text outside the JSON object.`;

export async function generateOptimizedResume(
  jobDescription: string,
  resumeOverride?: ResumeData
): Promise<ResumeGenerationResult> {
  const masterResume = resumeOverride ?? defaultResume;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }

  const groq = new Groq({ apiKey });

  const userPrompt = `Analyze this job description and optimize the provided resume for maximum ATS compatibility.

JOB DESCRIPTION:
${jobDescription}

MASTER RESUME DATA:
${JSON.stringify(masterResume)}

Return a JSON object with EXACTLY this structure:
{
  "jobTitle": "extracted job title from JD",
  "company": "extracted company name from JD (or 'Not Specified' if not found)",
  "extractedRequirements": {
    "skills": ["<every hard skill mentioned in JD, use exact phrasing>"],
    "technologies": ["<every technology, tool, platform mentioned in JD>"],
    "responsibilities": ["<key responsibility phrases from JD>"],
    "experience": ["<experience requirements>"],
    "keywords": ["<ALL important ATS keywords from JD including soft skills, methodologies, and domain terms>"]
  },
  "optimizedResume": {
    "personalInfo": <copy exactly from master resume>,
    "summary": "<3-4 sentences, 65-90 words. FIRST sentence MUST contain the exact job title from the JD. Embed AT LEAST 8 distinct JD keywords naturally across the sentences. Example: 'Results-driven [EXACT JOB TITLE] with X years of experience in [JD keyword 1], [JD keyword 2], and [JD keyword 3]...'>",
    "experience": [
      {
        "id": "<same id — ALL roles must be present, never skip>",
        "company": "<same>",
        "title": "<same>",
        "location": "<same>",
        "startDate": "<same>",
        "endDate": "<same>",
        "bullets": ["<3-5 bullets per role. Rewrite each bullet to embed JD keywords using EXACT JD phrasing. Never remove an entire role.>"]
      }
    ],
    "education": "<copy exactly from master resume>",
    "skills": {
      "technical": ["<JD-matching skills FIRST using EXACT JD terms, then remaining skills from master — NEVER remove any>"],
      "frameworks": ["<JD-matching frameworks FIRST — NEVER remove any>"],
      "databases": ["<JD-matching databases FIRST — NEVER remove any>"],
      "cloud": ["<JD-matching cloud services FIRST using exact provider names from JD — NEVER remove any>"],
      "tools": ["<JD-matching tools FIRST — NEVER remove any>"],
      "soft": ["<EVERY soft skill keyword from JD must be here: e.g. communication, problem solving, teamwork, leadership, collaboration, agile, etc.>"]
    },
    "projects": [
      {
        "id": "<same id>",
        "name": "<same>",
        "description": "<rewrite to embed JD keywords naturally>",
        "technologies": ["<same array>"],
        "bullets": ["<2-4 bullets embedding JD keywords>"],
        "link": "<copy EXACTLY from master resume, even if it says 'Link' — never remove or change>",
        "github": "<copy EXACTLY from master resume — never remove or change>"
      }
    ],
    "certifications": "<copy exactly from master resume>"
  },
  "addedKeywords": ["<list EVERY keyword/phrase from the JD that now appears in the optimized resume but was NOT present verbatim in the original master resume — these are highlighted yellow in the preview so list all of them>"],
  "suggestions": [
    "Actionable suggestion 1",
    "Actionable suggestion 2",
    "Actionable suggestion 3",
    "Actionable suggestion 4"
  ]
}`;

  // Primary model can be overridden via GROQ_MODEL env var.
  // Check https://console.groq.com/docs/models for currently available IDs.
  // Primary model can be overridden via GROQ_MODEL env var.
  // Each model family has its own independent rate-limit quota on Groq.
  // llama-3.1-8b-instant removed: hard 6K TPM limit always fails our ~10K token prompt.
  const primaryModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const MODELS = [
    primaryModel,                                    // Llama 3.3 70B — primary
    "qwen/qwen3-32b",                                // Qwen family — separate quota
    "meta-llama/llama-4-scout-17b-16e-instruct",    // Llama 4 family — separate quota
    "openai/gpt-oss-20b",                            // OpenAI OSS family — separate quota
  ].filter((m, i, arr) => arr.indexOf(m) === i);

  let text: string | null = null;
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 8192,
        response_format: { type: "json_object" },
      });
      text = completion.choices[0]?.message?.content ?? null;
      if (text) break;
    } catch (err: unknown) {
      lastError = err;
      const e = err as { status?: number; error?: { code?: string } };
      const skip = e?.status === 429 || e?.status === 413 || e?.error?.code === "model_decommissioned";
      if (skip) continue;
      throw err;
    }
  }

  if (!text) {
    if (lastError) throw lastError;
    throw new Error("Empty response from Groq API. Please try again.");
  }

  let parsed: {
    jobTitle?: string;
    company?: string;
    extractedRequirements?: {
      skills?: string[];
      technologies?: string[];
      responsibilities?: string[];
      experience?: string[];
      keywords?: string[];
    };
    originalScore?: number;
    atsScore?: number;
    optimizedResume?: ResumeGenerationResult["optimizedResume"];
    addedKeywords?: string[];
    suggestions?: string[];
  };

  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const jsonStr = jsonStart !== -1 && jsonEnd !== -1 ? text.slice(jsonStart, jsonEnd + 1) : text;
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }

  const optimizedResume = parsed.optimizedResume ?? masterResume;
  const allKeywords = Array.from(new Set([
    ...(parsed.extractedRequirements?.skills || []),
    ...(parsed.extractedRequirements?.technologies || []),
    ...(parsed.extractedRequirements?.keywords || []),
  ].map((k) => k.toLowerCase().trim()).filter(Boolean)));
  const originalScore = calcAtsScore(masterResume, allKeywords);
  const atsScore      = calcAtsScore(optimizedResume, allKeywords);

  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    jobTitle: parsed.jobTitle || "Position",
    company: parsed.company || "Company",
    originalResume: masterResume,
    optimizedResume,
    atsScore,
    originalScore,
    addedKeywords: parsed.addedKeywords || [],
    extractedRequirements: {
      skills: parsed.extractedRequirements?.skills || [],
      technologies: parsed.extractedRequirements?.technologies || [],
      responsibilities: parsed.extractedRequirements?.responsibilities || [],
      experience: parsed.extractedRequirements?.experience || [],
      keywords: parsed.extractedRequirements?.keywords || [],
    },
    suggestions: parsed.suggestions || [],
    jobDescription,
  };
}
