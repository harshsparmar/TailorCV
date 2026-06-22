import { NextRequest, NextResponse } from "next/server";
import { generateDOCX } from "@/lib/docx-generator";
import type { ResumeData } from "@/types/resume";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume, jobTitle, company } = body as {
      resume: ResumeData;
      jobTitle: string;
      company: string;
    };

    if (!resume || !resume.personalInfo) {
      return NextResponse.json({ error: "Invalid resume data" }, { status: 400 });
    }

    const docxBuffer = await generateDOCX(resume, jobTitle || "Position", company || "Company");
    const name = resume.personalInfo.name.replace(/\s+/g, "_");
    const filename = `${name}_Resume_${jobTitle?.replace(/\s+/g, "_") || "Optimized"}.docx`;

    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": docxBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("[/api/download/docx] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate DOCX. Please try again." },
      { status: 500 }
    );
  }
}
