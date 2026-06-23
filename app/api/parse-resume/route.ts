import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import type { ResumeData } from "@/types/resume";

export const runtime = "nodejs";

const PARSE_SYSTEM_PROMPT = `You are an expert resume parser. Extract all information from the provided resume text and output it as a structured JSON object. Be thorough, accurate, and capture everything.

CRITICAL: Return ONLY valid JSON — no markdown, no code blocks, no text outside the JSON object.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isJSON = file.type === "application/json" || file.name.endsWith(".json");
    const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");

    if (!isJSON && !isPDF) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF or JSON file." },
        { status: 400 }
      );
    }

    let resumeData: ResumeData;

    // ── JSON: parse directly, no AI needed ──────────────────────────────────
    if (isJSON) {
      try {
        const parsed = JSON.parse(buffer.toString("utf-8")) as ResumeData;
        if (!parsed.personalInfo || !parsed.experience) {
          throw new Error(
            "Invalid resume JSON — missing required fields (personalInfo, experience)."
          );
        }
        resumeData = parsed;
      } catch (err) {
        return NextResponse.json(
          { error: err instanceof Error ? err.message : "Invalid JSON file." },
          { status: 400 }
        );
      }
    }

    // ── PDF: extract text then parse with Groq ───────────────────────────────
    else {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: "GROQ_API_KEY not configured." }, { status: 500 });
      }

      let extractedText: string;
      try {
        // Import from lib/pdf-parse.js (not the package root) to skip the
        // test-file loading that pdf-parse v1 does on require, which crashes
        // in Vercel's serverless environment.
        const pdfParse = require("pdf-parse/lib/pdf-parse.js") as (
          buffer: Buffer
        ) => Promise<{ text: string }>;
        const result = await pdfParse(buffer);
        extractedText = result.text;
      } catch (err) {
        console.error("[parse-resume] PDF parse error:", err);
        return NextResponse.json(
          {
            error: `Failed to read PDF: ${err instanceof Error ? err.message : String(err)}`,
          },
          { status: 400 }
        );
      }

      if (!extractedText.trim()) {
        return NextResponse.json(
          {
            error:
              "PDF appears empty or is image-based. Please upload a text-based (selectable text) PDF.",
          },
          { status: 400 }
        );
      }

      const groq = new Groq({ apiKey });

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: PARSE_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Parse every detail from this resume into the JSON structure below.

RESUME TEXT:
${extractedText.slice(0, 8000)}

Return this EXACT structure (use sequential IDs: exp1, exp2 … edu1 … proj1 … cert1 …):
{
  "personalInfo": {
    "name": "", "email": "", "phone": "", "location": "",
    "linkedin": "", "github": "", "portfolio": ""
  },
  "summary": "",
  "experience": [{
    "id": "exp1", "company": "", "title": "", "location": "",
    "startDate": "", "endDate": "", "bullets": []
  }],
  "education": [{
    "id": "edu1", "institution": "", "degree": "", "field": "",
    "location": "", "startDate": "", "endDate": "", "cgpa": "", "honors": []
  }],
  "skills": {
    "technical": [], "frameworks": [], "databases": [],
    "cloud": [], "tools": [], "soft": []
  },
  "projects": [{
    "id": "proj1", "name": "", "description": "",
    "technologies": [], "bullets": [], "link": "", "github": ""
  }],
  "certifications": [{
    "id": "cert1", "name": "", "issuer": "", "date": "", "description": ""
  }]
}

Rules:
- Put each bullet point as a separate string in the bullets array
- Skills categorization: technical = programming languages, frameworks = libraries/frameworks, databases = DB engines, cloud = cloud/hosting/DevOps, tools = dev tools/IDEs/design tools
- Leave optional string fields as empty string "" if not found; arrays as [] if empty
- Create one entry per work role, education entry, project, and achievement/certification
- CERTIFICATIONS: capture ALL entries from sections named "Certifications", "Academic and Extracurricular Achievements", "Achievements", "Awards", "Activities", or similar. For bullet-format entries like "• Name: Description   Date", put the word(s) before the colon as "name", the text after the colon as "description", and the date as "date". Never leave certifications as [] if such a section exists in the resume.
- Return ONLY the JSON object`,
          },
        ],
        temperature: 0.1,
        max_tokens: 6000,
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content;
      if (!text) {
        return NextResponse.json(
          { error: "AI failed to parse resume. Please try again." },
          { status: 500 }
        );
      }

      try {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        const jsonStr = start !== -1 && end !== -1 ? text.slice(start, end + 1) : text;
        resumeData = JSON.parse(jsonStr) as ResumeData;
      } catch {
        return NextResponse.json(
          { error: "Failed to parse AI response. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ resume: resumeData }, { status: 200 });
  } catch (error) {
    console.error("[/api/parse-resume] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process resume." },
      { status: 500 }
    );
  }
}
