import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { buildResumeHtml } from "@/lib/resume-html-template";
import type { ResumeData } from "@/types/resume";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume, jobTitle } = body as {
      resume: ResumeData;
      jobTitle: string;
      company: string;
    };

    if (!resume || !resume.personalInfo) {
      return NextResponse.json({ error: "Invalid resume data" }, { status: 400 });
    }

    const html = buildResumeHtml(resume);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    // Give Tailwind CDN time to generate styles
    await new Promise((r) => setTimeout(r, 1500));

    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    await browser.close();

    const name     = resume.personalInfo.name.replace(/\s+/g, "_");
    const filename = `${name}_Resume_${(jobTitle || "Optimized").replace(/\s+/g, "_")}.pdf`;

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[/api/download/pdf] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF. Please try again." },
      { status: 500 }
    );
  }
}
