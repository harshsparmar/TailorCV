import type { ResumeData } from "@/types/resume";

export const masterResume: ResumeData = {
  personalInfo: {
    name: "Harsh Parmar",
    email: "harshsparmar03@gmail.com",
    phone: "+918160532047",
    location: "Anand, Gujarat, India",
    linkedin: "linkedin.com/in/harshsparmar",
  },

  summary:
    "Full-Stack Web Developer with 1+ year of professional experience building scalable web applications using PHP, Laravel, and modern JavaScript technologies. Proven ability to develop enterprise-grade systems with secure architecture, MVC design patterns, cloud deployment, and workflow automation. Strong background in backend development (PHP, Laravel, MySQL, RESTful API design) and frontend implementation (React, Tailwind CSS, JavaScript, jQuery), with hands-on experience containerizing and deploying applications using Docker and AWS.",

  experience: [
    {
      id: "exp1",
      company: "ekZero Enterprise Software Services Pvt Ltd.",
      title: "Associate Software Developer",
      location: "Vadodara, Gujarat",
      startDate: "May 2025",
      endDate: "Present",
      bullets: [
        "Develop and maintain core modules implementing business logic using MVC architecture for an Australia-based solar company's scalable web application built with PHP, Laravel, MySQL, and jQuery",
        "Integrate AWS S3 for secure and efficient file storage and retrieval, enhancing system reliability, scalability, and security best practices",
        "Design and optimize MySQL database schemas and queries to improve application performance and data integrity",
        "Collaborate with cross-functional teams using agile methodologies to deliver features on schedule and ensure high availability of production systems",
      ],
    },
    {
      id: "exp2",
      company: "Dhyey Consulting Services Pvt. Ltd.",
      title: "Application Developer Intern",
      location: "Vadodara, Gujarat",
      startDate: "Jan 2025",
      endDate: "Apr 2025",
      bullets: [
        "Developed ERP-related applications using Microsoft Power Platform, focusing on PowerApps Canvas Apps and Power Pages for enterprise clients",
        "Designed user-centric interfaces and automated workflows using Power Automate and Dataverse to enhance operational efficiency and reduce manual effort",
        "Integrated SharePoint data sources with PowerApps to enable real-time data access across distributed systems",
      ],
    },
    {
      id: "exp3",
      company: "Varenya Maritime Services Pvt. Ltd.",
      title: "Web Developer Intern",
      location: "Vadodara, Gujarat",
      startDate: "Oct 2023",
      endDate: "Dec 2024",
      bullets: [
        "Developed frontend interfaces using HTML, CSS, JavaScript, and jQuery and RESTful API design backend using PHP and Laravel's MVC architecture",
        "Managed MySQL databases including schema design, query optimization, and data manipulation to ensure scalable web applications",
        "Collaborated with team members using agile methodologies to deliver projects on schedule, contributing ideas to enhance project outcomes and team productivity",
        "Implemented security best practices in web forms and data handling to protect user information",
      ],
    },
    {
      id: "exp4",
      company: "SVIT, Vasad — Prakarsh",
      title: "UI/UX Designer",
      location: "Vasad, Gujarat",
      startDate: "Dec 2022",
      endDate: "Mar 2023",
      bullets: [
        "Designed and implemented the UI/UX for the Prakarsh 2023 event website using Figma, elevating user engagement through innovative interface design",
        "Acquired proficiency in Figma and Canva, enabling versatile design solutions across web and print media",
      ],
    },
  ],

  education: [
    {
      id: "edu1",
      institution: "Sardar Vallabhbhai Patel Institute of Technology (SVIT), Vasad",
      degree: "Bachelor of Engineering (B.E.)",
      field: "Information Technology",
      location: "Vasad, Gujarat",
      startDate: "2021",
      endDate: "2025",
      cgpa: "8.83 CGPA",
      honors: [
        "Gujarat Technological University (GTU)",
        "6th Rank in Workshop Skills — 1st Semester",
        "Represented GTU at All India Inter University Woodball Tournament",
      ],
    },
  ],

  skills: {
    technical: [
      "PHP",
      "JavaScript",
      "HTML",
      "CSS",
      "jQuery",
      "SQL",
      "Node.js",
      "React",
      "RESTful API design",
    ],
    frameworks: [
      "Laravel",
      "Tailwind CSS",
      "PowerApps (Canvas App)",
      "Power Pages",
      "Power Automate",
      "MVC architecture",
    ],
    databases: ["MySQL", "SQLite", "Dataverse", "SharePoint"],
    cloud: ["AWS (S3, EC2)", "Docker", "Render", "CI/CD pipelines"],
    tools: [
      "Git",
      "GitHub",
      "Figma",
      "Canva",
      "VS Code",
    ],
    soft: [
      "teamwork",
      "collaboration",
      "communication",
      "problem solving",
      "mentoring",
      "agile methodologies",
      "scrum methodologies",
      "code review",
    ],
  },

  projects: [
    {
      id: "proj1",
      name: "SecureVault — Enterprise-Grade Document Management System",
      description:
        "Enterprise-grade document management system with role-based access control, secure previews, and containerized deployment",
      technologies: ["Laravel", "PHP", "Tailwind CSS", "SQLite", "Docker", "Render"],
      bullets: [
        "Architected role-based access control for uploaders and viewers to enforce secure document management and security best practices",
        "Implemented secure in-browser previews for PDF, DOCX, XLSX, PPTX, and TXT formats with sandboxed, AJAX-restricted modules",
        "Designed time-bound signed URL mechanisms and private storage policies to prevent unauthorized file sharing across distributed systems",
        "Containerized and deployed the scalable web application using Docker with CI/CD automation on Render for high availability",
      ],
      link: "https://securevault-document-portal.onrender.com",
    },
    {
      id: "proj2",
      name: "Logo Flow — Custom Logo Creation Tool",
      description:
        "Interactive web application for designing and customizing logos with real-time preview and icon library integration",
      technologies: ["React", "JavaScript", "Iconify API", "Tailwind CSS", "HTML"],
      bullets: [
        "Developed a user-friendly React interface for designing and customizing logos with real-time preview",
        "Integrated Iconify API to browse and select from a wide range of icons with React color picker for customization",
        "Implemented easy download of finalized logo designs, enabling seamless user workflow",
      ],
      link: "https://logoflow.vercel.app/",
    },
  ],

  certifications: [
    {
      id: "ach1",
      name: "Event Crew Member — BGMI Event, Prakarsh 24",
      issuer: "SVIT, Vasad — contributed to successful organization and execution",
      date: "Feb 2024",
    },
    {
      id: "ach2",
      name: "All India Inter University Woodball Tournament",
      issuer: "Represented Gujarat Technological University (GTU) at AIU level",
      date: "Apr 2023",
    },
    {
      id: "ach3",
      name: "NSS Volunteer — Divyang Khel Mahakumbh",
      issuer: "National Service Scheme, Vadodara — 5 days of dedicated service",
      date: "Apr 2022",
    },
    {
      id: "ach4",
      name: "Workshop Top Student — 6th Rank in Workshop Skills",
      issuer: "SVIT, Vasad — 1st Semester Engineering",
      date: "Feb 2022",
    },
  ],
};
