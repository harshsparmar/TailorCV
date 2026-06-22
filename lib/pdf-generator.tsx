import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";

const BLUE = "#1e40af";        // tailwind blue-800 — name, section headers
const BLUE_700 = "#1d4ed8";    // tailwind blue-700 — company/institution/links
const DARK = "#111827";        // tailwind gray-900 — titles
const GRAY_800 = "#1f2937";    // tailwind gray-800 — skill labels
const GRAY = "#374151";        // tailwind gray-700 — body/bullet text
const GRAY_600 = "#4b5563";    // tailwind gray-600 — secondary text
const LIGHT_GRAY = "#6b7280";  // tailwind gray-500 — meta/dates
const BORDER = "#d1d5db";      // tailwind gray-300

// All sizes below are converted from the HTML preview's px values using the
// standard 1px = 0.75pt ratio (96px/in ÷ 72pt/in), so the PDF matches
// ResumePreview.tsx 1:1 at print scale.
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8.25,
    paddingTop: 24,    // py-8 (32px)
    paddingBottom: 24,
    paddingHorizontal: 30, // px-10 (40px)
    color: DARK,
    backgroundColor: "#ffffff",
  },
  // Header
  header: {
    marginBottom: 15,       // mb-5 (20px)
    borderBottomWidth: 3,   // border-b-4 (4px)
    borderBottomColor: BLUE,
    paddingBottom: 12,      // pb-4 (16px)
  },
  name: {
    fontSize: 22.5,         // text-3xl (30px)
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    letterSpacing: 0.9,     // tracking-wide / 0.04em
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,           // mt-2 (8px)
    columnGap: 9,           // gap-x-3 (12px)
    rowGap: 3,               // gap-y-1 (4px)
  },
  contactItem: {
    fontSize: 8.25,         // text-[11px]
    color: GRAY_600,
  },
  contactLink: {
    fontSize: 8.25,
    color: GRAY_600,
    textDecoration: "none",
  },
  socialLink: {
    fontSize: 8.25,
    color: BLUE_700,
    textDecoration: "none",
  },
  // Section
  section: {
    marginBottom: 15,       // mb-5 (20px)
  },
  sectionTitle: {
    fontSize: 8.25,         // text-[11px]
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    textTransform: "uppercase",
    letterSpacing: 0.99,    // tracking-[0.12em]
    borderBottomWidth: 1.5, // border-b-2 (2px)
    borderBottomColor: BLUE,
    paddingBottom: 3,       // pb-1 (4px)
    marginBottom: 9,        // mb-3 (12px)
  },
  // Summary
  summaryText: {
    fontSize: 8.625,        // text-[11.5px]
    color: GRAY,
    lineHeight: 1.625,      // leading-relaxed
  },
  // Experience
  expItem: {
    marginBottom: 12,       // space-y-4 (16px)
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  expTitleBlock: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 9,            // text-[12px]
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  companyName: {
    fontSize: 8.625,        // text-[11.5px]
    fontFamily: "Helvetica-Bold", // font-semibold
    color: BLUE_700,
  },
  expMeta: {
    fontSize: 7.875,        // text-[10.5px]
    color: LIGHT_GRAY,
    textAlign: "right",
  },
  bulletList: {
    marginTop: 4.5,         // ul mt-1.5 (6px) — experience only
  },
  bullet: {
    marginBottom: 3,        // space-y-1 (4px)
    paddingLeft: 2,
  },
  bulletText: {
    fontSize: 8.25,         // text-[11px]
    color: GRAY,
    lineHeight: 1.625,      // leading-relaxed
  },
  // Skills
  skillValue: {
    fontSize: 8.25,         // text-[11px]
    color: GRAY,
    lineHeight: 1.4,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 3,        // space-y-1 (4px)
    alignItems: "flex-start",
  },
  skillLabelInline: {
    fontSize: 8.25,         // text-[11px]
    fontFamily: "Helvetica-Bold",
    color: GRAY_800,
    width: 84,               // w-28 (112px)
    flexShrink: 0,
  },
  // Projects
  projectItem: {
    marginBottom: 9,        // space-y-3 (12px)
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  projectName: {
    fontSize: 9,            // text-[12px]
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  projectLink: {
    fontSize: 7.5,          // text-[10px]
    color: BLUE_700,
    textDecoration: "none",
  },
  projectDesc: {
    fontSize: 8.25,         // text-[11px]
    color: GRAY_600,
    marginBottom: 3,        // mb-1 (4px)
    fontFamily: "Helvetica-Oblique",
    lineHeight: 1.4,
  },
  techBadge: {
    fontSize: 7.875,        // text-[10.5px]
    color: LIGHT_GRAY,
    marginBottom: 3,        // mb-1 (4px)
  },
  // Education
  eduItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  eduLeft: {
    flex: 1,
  },
  degreeText: {
    fontSize: 9,            // text-[12px]
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  institutionText: {
    fontSize: 8.625,        // text-[11.5px]
    fontFamily: "Helvetica-Bold", // font-semibold
    color: BLUE_700,
  },
  eduMeta: {
    fontSize: 7.875,        // text-[10.5px]
    color: LIGHT_GRAY,
    textAlign: "right",
  },
  honorText: {
    fontSize: 7.875,        // text-[10.5px]
    color: GRAY_600,
    marginTop: 1,
  },
  // Certification
  certItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4.5,      // space-y-1.5 (6px)
  },
  certLeft: {
    flex: 1,
  },
  certName: {
    fontSize: 8.625,        // text-[11.5px]
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  certIssuer: {
    fontSize: 8.25,         // text-[11px]
    color: GRAY_600,
  },
  certDate: {
    fontSize: 7.875,        // text-[10.5px]
    color: LIGHT_GRAY,
    textAlign: "right",
  },
});

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletText}>
        <Text style={{ color: BLUE_700, fontFamily: "Helvetica-Bold" }}>{"• "}</Text>
        {text}
      </Text>
    </View>
  );
}

function SkillRow({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.skillRow}>
      <Text style={styles.skillLabelInline}>{label}:</Text>
      <Text style={{ ...styles.skillValue, flex: 1 }}>{items.join(" • ")}</Text>
    </View>
  );
}

function ResumeDocument({ resume }: { resume: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resume;

  return (
    <Document
      title={`${personalInfo.name} - Resume`}
      author={personalInfo.name}
      subject="Resume"
      keywords="resume, cv"
    >
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <View style={styles.contactRow}>
            <Link src={`mailto:${personalInfo.email}`} style={styles.contactLink}>
              {personalInfo.email}
            </Link>
            <Text style={styles.contactItem}>|</Text>
            <Link src={`tel:${personalInfo.phone.replace(/\s+/g, "")}`} style={styles.contactLink}>
              {personalInfo.phone}
            </Link>
            <Text style={styles.contactItem}>|</Text>
            <Text style={styles.contactItem}>{personalInfo.location}</Text>
            {personalInfo.linkedin && (
              <>
                <Text style={styles.contactItem}>|</Text>
                <Link
                  src={`https://${personalInfo.linkedin.replace(/^https?:\/\//, "")}`}
                  style={styles.socialLink}
                >
                  {personalInfo.linkedin}
                </Link>
              </>
            )}
            {personalInfo.github && (
              <>
                <Text style={styles.contactItem}>|</Text>
                <Link
                  src={`https://${personalInfo.github.replace(/^https?:\/\//, "")}`}
                  style={styles.socialLink}
                >
                  {personalInfo.github}
                </Link>
              </>
            )}
            {personalInfo.portfolio && (
              <>
                <Text style={styles.contactItem}>|</Text>
                <Link
                  src={`https://${personalInfo.portfolio.replace(/^https?:\/\//, "")}`}
                  style={styles.socialLink}
                >
                  {personalInfo.portfolio}
                </Link>
              </>
            )}
          </View>
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {experience.map((exp, idx) => (
              <View key={exp.id} style={[styles.expItem, idx === experience.length - 1 ? { marginBottom: 0 } : {}]}>
                <View style={styles.expHeader}>
                  <View style={styles.expTitleBlock}>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.companyName}>{exp.company}</Text>
                  </View>
                  <View>
                    <Text style={styles.expMeta}>
                      {exp.startDate} – {exp.endDate}
                    </Text>
                    <Text style={styles.expMeta}>{exp.location}</Text>
                  </View>
                </View>
                <View style={styles.bulletList}>
                  {exp.bullets.filter((b) => b.trim()).map((bullet, i) => (
                    <Bullet key={i} text={bullet} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <SkillRow label="Languages" items={skills.technical || []} />
            <SkillRow label="Frameworks" items={skills.frameworks || []} />
            <SkillRow label="Databases" items={skills.databases || []} />
            <SkillRow label="Cloud" items={skills.cloud || []} />
            <SkillRow label="Tools" items={skills.tools || []} />
            <SkillRow label="Soft Skills" items={skills.soft || []} />
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj, idx) => (
              <View key={proj.id} style={[styles.projectItem, idx === projects.length - 1 ? { marginBottom: 0 } : {}]}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{proj.name}</Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {proj.link && (
                      <Link
                        src={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
                        style={styles.projectLink}
                      >
                        Project Link ↗
                      </Link>
                    )}
                    {proj.github && (
                      <Link
                        src={`https://${proj.github.replace(/^https?:\/\//, "")}`}
                        style={styles.projectLink}
                      >
                        {proj.github}
                      </Link>
                    )}
                  </View>
                </View>
                <Text style={styles.projectDesc}>{proj.description}</Text>
                {proj.technologies && proj.technologies.length > 0 && (
                  <Text style={styles.techBadge}>
                    Tech: {proj.technologies.join(" • ")}
                  </Text>
                )}
                {proj.bullets.filter((b) => b.trim()).map((bullet, i) => (
                  <Bullet key={i} text={bullet} />
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, idx) => (
              <View key={edu.id}>
                <View style={[styles.eduItem, idx === education.length - 1 ? { marginBottom: 0 } : {}]}>
                  <View style={styles.eduLeft}>
                    <Text style={styles.degreeText}>
                      {edu.degree && edu.field
                        ? `${edu.degree} in ${edu.field}`
                        : edu.degree || edu.field || ""}
                    </Text>
                    <Text style={styles.institutionText}>{edu.institution}</Text>
                    {edu.cgpa && (
                      <Text style={styles.honorText}>CGPA: {edu.cgpa}</Text>
                    )}
                    {edu.honors?.map((h, i) => (
                      <Text key={i} style={styles.honorText}>
                        {h}
                      </Text>
                    ))}
                  </View>
                  <View>
                    <Text style={styles.eduMeta}>
                      {edu.startDate} – {edu.endDate}
                    </Text>
                    <Text style={styles.eduMeta}>{edu.location}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Academic & Extracurricular Achievements */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic and Extracurricular Achievements</Text>
            {certifications.map((cert, idx) => (
              <View key={cert.id} style={[styles.certItem, idx === certifications.length - 1 ? { marginBottom: 0 } : {}]}>
                <View style={styles.certLeft}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  {cert.issuer ? (
                    <Text style={styles.certIssuer}>{cert.issuer}</Text>
                  ) : null}
                </View>
                {cert.date ? (
                  <View>
                    <Text style={styles.certDate}>{cert.date}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function generatePDF(resume: ResumeData): Promise<Buffer> {
  const doc = <ResumeDocument resume={resume} />;
  return renderToBuffer(doc);
}
