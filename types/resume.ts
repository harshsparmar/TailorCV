export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  cgpa?: string;
  honors?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  bullets: string[];
  link?: string;
  github?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description?: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface SkillsSection {
  technical?: string[];
  frameworks?: string[];
  databases?: string[];
  cloud?: string[];
  tools?: string[];
  soft?: string[];
  languages?: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillsSection;
  projects: Project[];
  certifications?: Certification[];
}

export interface ExtractedRequirements {
  skills: string[];
  technologies: string[];
  responsibilities: string[];
  experience: string[];
  keywords: string[];
}

export interface ResumeGenerationResult {
  id: string;
  timestamp: string;
  jobTitle: string;
  company: string;
  originalResume: ResumeData;
  optimizedResume: ResumeData;
  atsScore: number;
  originalScore: number;
  addedKeywords: string[];
  extractedRequirements: ExtractedRequirements;
  suggestions: string[];
  jobDescription: string;
}

export interface GenerateRequest {
  jobDescription: string;
}

export interface DownloadRequest {
  resume: ResumeData;
  jobTitle: string;
  company: string;
}
