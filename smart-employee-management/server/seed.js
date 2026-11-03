import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "./models/User.js";
import Department from "./models/Department.js";
import Project from "./models/Project.js";
import ProjectTask from "./models/ProjectTask.js";
import ConfidenceTaskTemplate from "./models/ConfidenceTaskTemplate.js";
import EmployeeTaskAssignment from "./models/EmployeeTaskAssignment.js";
import Course from "./models/Course.js";
import TrainingProgress from "./models/TrainingProgress.js";
import JournalEntry from "./models/JournalEntry.js";
import Achievement from "./models/Achievement.js";
import Announcement from "./models/Announcement.js";
import Message from "./models/Message.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart_employee_db");
    console.log("Connected to MongoDB for seeding...");

    // Clear old data
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Project.deleteMany({}),
      ProjectTask.deleteMany({}),
      ConfidenceTaskTemplate.deleteMany({}),
      EmployeeTaskAssignment.deleteMany({}),
      Course.deleteMany({}),
      TrainingProgress.deleteMany({}),
      JournalEntry.deleteMany({}),
      Achievement.deleteMany({}),
      Announcement.deleteMany({}),
      Message.deleteMany({})
    ]);

    console.log("Cleared existing collections.");

    // 1. Password hashing
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);

    // 2. Create Users
    const adminUser = await User.create({
      name: "Arthur Pendelton (Admin)",
      email: "admin@company.com",
      password: passwordHash,
      role: "admin",
      department: "Administration",
      designation: "Chief Operations & Tech Admin",
      phone: "+1 (555) 019-2831",
      bio: "Oversees enterprise system administration, security controls, and departmental structure."
    });

    const hrUser = await User.create({
      name: "Helen Ross (HR)",
      email: "hr@company.com",
      password: passwordHash,
      role: "hr",
      department: "Human Resources",
      designation: "Head of People & Culture",
      phone: "+1 (555) 019-2832",
      bio: "Passionate about employee onboarding, workplace wellness, talent growth, and leadership."
    });

    const managerUser = await User.create({
      name: "Marcus Vance (Manager)",
      email: "manager@company.com",
      password: passwordHash,
      role: "manager",
      department: "Software Engineering",
      designation: "Engineering Team Lead",
      phone: "+1 (555) 019-2833",
      bio: "10+ years engineering lead dedicated to coaching new developers, agile delivery, and architecture."
    });

    const employeeUser = await User.create({
      name: "Emma Watson (New Recruit)",
      email: "employee@company.com",
      password: passwordHash,
      role: "employee",
      department: "Software Engineering",
      designation: "Junior Software Developer",
      phone: "+1 (555) 019-2834",
      bio: "Excited new recruit eager to master full-stack workflows, collaborate with peers, and build confidence.",
      manager: managerUser._id,
      onboardingStatus: "in-progress"
    });

    console.log("Created 4 primary role accounts (admin, hr, manager, employee). Password: password123");

    // 3. Create Departments
    const departments = await Department.insertMany([
      {
        name: "Software Engineering",
        code: "ENG",
        description: "Designs, architects, develops, and tests high-performance web applications and backend microservices.",
        manager: managerUser._id,
        responsibilities: [
          "Understand system architecture and existing codebase",
          "Develop clean, well-tested frontend and backend code",
          "Participate in agile sprints, peer code reviews, and standups",
          "Deploy reliable cloud services with CI/CD automation"
        ]
      },
      {
        name: "Human Resources",
        code: "HR",
        description: "Focuses on talent acquisition, onboarding programs, employee engagement, and positive workplace culture.",
        manager: hrUser._id,
        responsibilities: [
          "Design engaging onboarding pathways for recruits",
          "Organize learning seminars and wellness workshops",
          "Manage employee reviews, benefits, and workplace ethics"
        ]
      },
      {
        name: "Marketing",
        code: "MKT",
        description: "Drives product awareness, brand messaging, customer growth, and creative campaigns across digital channels.",
        manager: null,
        responsibilities: [
          "Conduct competitor analysis and audience research",
          "Create compelling content and social media campaigns",
          "Measure funnel conversions and brand reach"
        ]
      },
      {
        name: "Business Analysis",
        code: "BA",
        description: "Bridges business goals and technical solutions through requirements gathering and data analytics.",
        manager: null,
        responsibilities: [
          "Elicit functional and technical requirements from stakeholders",
          "Create user stories and workflow diagrams",
          "Analyze business KPIs and evaluate solution delivery"
        ]
      },
      {
        name: "UI/UX Design",
        code: "DES",
        description: "Crafts intuitive, accessible, and delightful digital user journeys and visual design systems.",
        manager: null,
        responsibilities: [
          "Conduct user usability testing and interviews",
          "Design wireframes, component libraries, and prototypes",
          "Collaborate with engineers for seamless UI implementation"
        ]
      }
    ]);

    console.log(`Created ${departments.length} departments.`);

    // 4. Create 30-Day New Recruit Confidence Building Journey Templates (Days 1 to 30)
    const thirtyDayTasks = [
      // Week 1 – Company Orientation
      {
        weekNumber: 1,
        dayNumber: 1,
        title: "Write a short self-introduction",
        description: "Share your background, educational journey, personal interests, and what you look forward to in this role.",
        instructions: "Compose a 150-250 word introduction covering your hobbies, tech interests, and what excites you about our company culture. Post it into the submission box.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },
      {
        weekNumber: 1,
        dayNumber: 2,
        title: "Learn about the company's history and values",
        description: "Explore the Company Onboarding hub to learn our founding story, vision, core values, and key milestones.",
        instructions: "Read the onboarding portal materials and summarize our top three company values with a brief note on how you plan to embody them.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },
      {
        weekNumber: 1,
        dayNumber: 3,
        title: "Understand your department and job responsibilities",
        description: "Review your department charter, key responsibilities, team hierarchy, and standard expectations.",
        instructions: "Review the department page. Write down the top 3 core responsibilities of your position and discuss any questions with your manager.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },
      {
        weekNumber: 1,
        dayNumber: 4,
        title: "Meet and introduce yourself to three colleagues",
        description: "Reach out to 3 colleagues across your department or adjacent teams via our internal messenger or a quick virtual coffee.",
        instructions: "Note the names, roles, and one interesting piece of advice each colleague shared with you during your intro.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },
      {
        weekNumber: 1,
        dayNumber: 5,
        title: "Explain your role in your own words",
        description: "Synthesize everything learned during your first week to summarize how your role contributes to company success.",
        instructions: "Draft an elevator pitch (under 2 minutes or 200 words) describing your role as if explaining it to a friend or client.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },
      {
        weekNumber: 1,
        dayNumber: 6,
        title: "Read company policies and code of conduct",
        description: "Familiarize yourself with company safety, privacy guidelines, communication ethics, and remote/hybrid work policies.",
        instructions: "Review the company handbook in the onboarding hub. Note down any policies you need clarification on.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },
      {
        weekNumber: 1,
        dayNumber: 7,
        title: "Complete a weekly reflection",
        description: "Reflect on your first full week, celebrate initial milestones, and acknowledge what felt easy vs challenging.",
        instructions: "Submit your weekly reflection journal covering what you learned, key highlights, and your personal goals for Week 2.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },

      // Week 2 – Communication and Teamwork
      {
        weekNumber: 2,
        dayNumber: 8,
        title: "Write a professional introduction email",
        description: "Draft a concise, professional broadcast email introducing yourself to the broader team or department mailing list.",
        instructions: "Include a polite greeting, your position, key focus areas, and an open invitation to collaborate. Submit the email text.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },
      {
        weekNumber: 2,
        dayNumber: 9,
        title: "Participate in a team meeting",
        description: "Attend your team standup or weekly sync, actively listen, and contribute at least one update or observation.",
        instructions: "Submit 2-3 key takeaways and action items noted during today's team discussion.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },
      {
        weekNumber: 2,
        dayNumber: 10,
        title: "Ask your manager three work-related questions",
        description: "Foster curiosity and build strong manager communication by preparing 3 thoughtful questions regarding team priorities.",
        instructions: "List the 3 questions you asked your manager and briefly summarize their guidance and answers.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },
      {
        weekNumber: 2,
        dayNumber: 11,
        title: "Complete a small task with a teammate",
        description: "Collaborate side-by-side with a peer on a joint deliverable, code review, or research task.",
        instructions: "Describe the collaborative session, the task tackled, and how you divided responsibility.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 2,
        dayNumber: 12,
        title: "Practice professional communication",
        description: "Master clear, empathetic, and constructive communication across Slack/messages, tickets, and document comments.",
        instructions: "Review the Communication Skills course module in Workplace Learning and submit 3 key rules for effective written communication.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 2,
        dayNumber: 13,
        title: "Explain something you learned in two minutes",
        description: "Practice micro-teaching: distill a tool, workflow, or concept you recently picked up into a concise explanation.",
        instructions: "Submit your 2-minute summary script or notes explaining the concept in plain English.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 2,
        dayNumber: 14,
        title: "Complete a weekly reflection",
        description: "Review your communication growth and collaboration milestones achieved throughout Week 2.",
        instructions: "Complete your reflection entry outlining teamwork successes, communication breakthroughs, and preparation for Week 3.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },

      // Week 3 – Practical Work and Project Handling
      {
        weekNumber: 3,
        dayNumber: 15,
        title: "Understand a sample project",
        description: "Dive into the repository or project brief of an active team initiative to understand its goals, architecture, and users.",
        instructions: "Submit an architectural summary outlining the core modules, tech stack, and user personas of the project.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 3,
        dayNumber: 16,
        title: "Identify project requirements",
        description: "Analyze project user stories and acceptance criteria to distinguish essential requirements from nice-to-haves.",
        instructions: "List 4-5 key functional requirements and 2 non-functional requirements (such as speed, security, or responsiveness).",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 3,
        dayNumber: 17,
        title: "Divide the project into smaller tasks",
        description: "Apply Work Breakdown Structure (WBS) principles to decompose a large deliverable into bite-sized actionable tickets.",
        instructions: "Submit a breakdown list of at least 5 sub-tasks with estimated hours and dependencies.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 3,
        dayNumber: 18,
        title: "Prepare a simple project timeline",
        description: "Map tasks onto a realistic timeline with milestones, checkpoints, and sprint buffer days.",
        instructions: "Outline a 2-week milestone schedule with deliverable dates and review checkpoints.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 3,
        dayNumber: 19,
        title: "Complete a beginner-level practical assignment",
        description: "Implement your assigned practical deliverable (code component, document, or graphic asset) according to spec.",
        instructions: "Submit your solution text, code snippet, or link to work for evaluation.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 3,
        dayNumber: 20,
        title: "Share a progress update with your manager",
        description: "Practice providing a clear, proactive status update using the standard 'Completed - In Progress - Blockers' format.",
        instructions: "Submit your formatted manager progress report.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 3,
        dayNumber: 21,
        title: "Complete a weekly reflection",
        description: "Reflect on project management, time estimation accuracy, and your ability to execute practical deliverables.",
        instructions: "Submit your Week 3 reflection noting what project execution strategies worked best for you.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },

      // Week 4 – Presentation and Confidence
      {
        weekNumber: 4,
        dayNumber: 22,
        title: "Prepare a short project report",
        description: "Draft a clean, executive summary of your practical work, outlining problem solved, solution approach, and outcomes.",
        instructions: "Submit a 1-page summary covering background, implementation details, challenges overcome, and future enhancements.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 4,
        dayNumber: 23,
        title: "Create a five-slide presentation",
        description: "Structure a concise 5-slide deck: Title/Problem, Solution Architecture, Key Features/Demo, Metrics & Value, Q&A.",
        instructions: "Submit the slide outline and speaking bullet points for each of the 5 slides.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 4,
        dayNumber: 24,
        title: "Practice presenting your work",
        description: "Rehearse your presentation out loud, timing yourself to stay within 7-10 minutes with clear pacing and tone.",
        instructions: "Submit notes from your rehearsal: your timing, tricky transition points, and how you polished your delivery.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 4,
        dayNumber: 25,
        title: "Present your work to your team",
        description: "Deliver your project presentation during the team showcase session or virtual demo meeting.",
        instructions: "Submit a summary of the presentation demo session, team attendee questions, and your responses.",
        category: "general-journey",
        department: "All",
        difficulty: "advanced"
      },
      {
        weekNumber: 4,
        dayNumber: 26,
        title: "Receive feedback from your manager",
        description: "Meet with your manager to receive constructive appraisal on your presentation style, content, and delivery.",
        instructions: "Summarize the constructive feedback and commendations provided by your manager.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 4,
        dayNumber: 27,
        title: "Improve your presentation based on feedback",
        description: "Incorporate the feedback received into an updated version of your slide deck or project documentation.",
        instructions: "List the specific adjustments made based on manager recommendations and submit the updated overview.",
        category: "general-journey",
        department: "All",
        difficulty: "intermediate"
      },
      {
        weekNumber: 4,
        dayNumber: 28,
        title: "Complete a final self-assessment",
        description: "Evaluate your growth across the 4 weeks: technical skills, workplace communication, teamwork, and confidence.",
        instructions: "Submit your comprehensive self-assessment comparing your Day 1 mindset to your current confidence level.",
        category: "general-journey",
        department: "All",
        difficulty: "beginner"
      },
      {
        weekNumber: 4,
        dayNumber: 29,
        title: "Complete a supervised mini-project (Part 1)",
        description: "Begin hands-on implementation of an end-to-end mini-project feature under mentor/manager guidance.",
        instructions: "Submit your implementation progress, component architecture, and integration tests for Part 1.",
        category: "general-journey",
        department: "All",
        difficulty: "advanced"
      },
      {
        weekNumber: 4,
        dayNumber: 30,
        title: "Final development review & graduation",
        description: "Finalize your supervised mini-project, submit full deliverables, and celebrate completion of the 30-Day Journey!",
        instructions: "Submit your final mini-project deliverable and overall 30-day program reflection for official sign-off.",
        category: "general-journey",
        department: "All",
        difficulty: "advanced"
      }
    ];

    // 5. Department-Specific Training Tasks
    const departmentTasks = [
      // Software Developer
      {
        title: "Understand the existing codebase",
        description: "Explore the directory structure, build scripts, environment variables, and core microservice endpoints.",
        instructions: "Clone repository, run development servers, inspect routes and controllers, and submit a brief architectural summary.",
        category: "department-specific",
        department: "Software Engineering",
        difficulty: "beginner"
      },
      {
        title: "Create a simple login page",
        description: "Build a responsive login component with form validation, error states, and JWT authentication handling.",
        instructions: "Submit your component code and explain how tokens are stored securely.",
        category: "department-specific",
        department: "Software Engineering",
        difficulty: "intermediate"
      },
      {
        title: "Identify and fix a beginner-level bug",
        description: "Investigate a sample issue ticket, reproduce the bug in local testing, write a fix, and verify with a test case.",
        instructions: "Submit your root-cause analysis, git diff patch, and verification steps.",
        category: "department-specific",
        department: "Software Engineering",
        difficulty: "intermediate"
      },
      {
        title: "Explain the application workflow",
        description: "Trace a full request lifecycle from client React state through HTTP API routes, middleware, and database queries.",
        instructions: "Submit a sequence diagram or step-by-step description of an API request/response cycle.",
        category: "department-specific",
        department: "Software Engineering",
        difficulty: "intermediate"
      },
      {
        title: "Present a small feature",
        description: "Prepare and demonstrate a feature you implemented to fellow engineers in a live demo or sprint review.",
        instructions: "Submit your demo notes, test coverage results, and key takeaways.",
        category: "department-specific",
        department: "Software Engineering",
        difficulty: "advanced"
      },

      // HR
      {
        title: "Create a sample employee profile",
        description: "Populate all essential HR data fields for an incoming employee adhering to company compliance rules.",
        instructions: "Submit a sample employee profile record with role, department, manager, and contact information.",
        category: "department-specific",
        department: "Human Resources",
        difficulty: "beginner"
      },
      {
        title: "Prepare an onboarding checklist",
        description: "Build a comprehensive 10-point checklist covering IT provisioning, paperwork, orientation, and mentor assignments.",
        instructions: "Submit your onboarding checklist in markdown or bullet format.",
        category: "department-specific",
        department: "Human Resources",
        difficulty: "beginner"
      },
      {
        title: "Draft an interview invitation email",
        description: "Compose a welcoming, clear, and professional interview invitation letter for prospective engineering candidates.",
        instructions: "Submit the email template with interview agenda, call links, and prep instructions.",
        category: "department-specific",
        department: "Human Resources",
        difficulty: "intermediate"
      },
      {
        title: "Prepare a sample attendance and progress report",
        description: "Compile and analyze an onboarding attendance summary identifying recruits needing additional support.",
        instructions: "Submit an executive summary report with recommendations for management.",
        category: "department-specific",
        department: "Human Resources",
        difficulty: "intermediate"
      },

      // Marketing
      {
        title: "Research competitors",
        description: "Analyze three top competitors in our market domain, noting their strengths, weaknesses, and marketing angles.",
        instructions: "Submit a competitor comparison matrix highlighting differentiation opportunities.",
        category: "department-specific",
        department: "Marketing",
        difficulty: "beginner"
      },
      {
        title: "Identify a target audience",
        description: "Develop 2 comprehensive buyer personas detailing demographics, pain points, motivations, and channels.",
        instructions: "Submit persona profiles including tech-readiness and value proposition fit.",
        category: "department-specific",
        department: "Marketing",
        difficulty: "beginner"
      },
      {
        title: "Create a sample social media post",
        description: "Craft a set of 3 engaging posts (LinkedIn, Twitter/X, Instagram) promoting our new product feature or team culture.",
        instructions: "Submit post copy, visual recommendations, and targeted hashtags.",
        category: "department-specific",
        department: "Marketing",
        difficulty: "intermediate"
      },
      {
        title: "Prepare a basic marketing campaign",
        description: "Outline a 4-week launch campaign including objectives, marketing channels, content calendar, and KPIs.",
        instructions: "Submit your campaign strategy brief.",
        category: "department-specific",
        department: "Marketing",
        difficulty: "advanced"
      },

      // Business Analyst
      {
        title: "Identify project requirements",
        description: "Interview a stakeholder or read a product brief to synthesize business goals into unambiguous technical requirements.",
        instructions: "Submit a structured list of core requirements with acceptance criteria.",
        category: "department-specific",
        department: "Business Analysis",
        difficulty: "beginner"
      },
      {
        title: "Prepare a requirement document",
        description: "Draft a Business Requirements Document (BRD) or PRD including scope, assumptions, user stories, and constraints.",
        instructions: "Submit your formal requirement specification document.",
        category: "department-specific",
        department: "Business Analysis",
        difficulty: "intermediate"
      },
      {
        title: "Create a simple workflow diagram",
        description: "Map an existing manual employee onboarding or task approval workflow into a clear BPMN or flowchart diagram.",
        instructions: "Submit workflow process steps, decision nodes, and actor swimlanes.",
        category: "department-specific",
        department: "Business Analysis",
        difficulty: "intermediate"
      },
      {
        title: "Analyze sample business data",
        description: "Examine employee onboarding completion and productivity metrics to detect patterns and improvement areas.",
        instructions: "Submit a quantitative analysis summarizing key findings and actionable next steps.",
        category: "department-specific",
        department: "Business Analysis",
        difficulty: "advanced"
      },

      // UI/UX Designer
      {
        title: "Review a website interface",
        description: "Conduct a heuristic evaluation of a web application screen against Nielsen's 10 usability heuristics.",
        instructions: "Submit your heuristic audit highlighting 3 friction points and practical recommendations.",
        category: "department-specific",
        department: "UI/UX Design",
        difficulty: "beginner"
      },
      {
        title: "Identify usability issues",
        description: "Analyze user navigation paths and identify areas where visual hierarchy, clarity, or accessibility could be enhanced.",
        instructions: "Submit a prioritized usability report with severity ratings.",
        category: "department-specific",
        department: "UI/UX Design",
        difficulty: "beginner"
      },
      {
        title: "Create a basic wireframe",
        description: "Produce low-fidelity wireframes for a new employee learning dashboard focusing on layout and content structure.",
        instructions: "Submit wireframe layout descriptions and information hierarchy rationale.",
        category: "department-specific",
        department: "UI/UX Design",
        difficulty: "intermediate"
      },
      {
        title: "Design a dashboard screen",
        description: "Design a high-fidelity dashboard screen utilizing modern typography, navy/slate color palette, and micro-interactions.",
        instructions: "Submit your design system tokens, color palette choices, and component specs.",
        category: "department-specific",
        department: "UI/UX Design",
        difficulty: "advanced"
      }
    ];

    const allTemplates = await ConfidenceTaskTemplate.insertMany([...thirtyDayTasks, ...departmentTasks]);
    console.log(`Inserted ${allTemplates.length} total task templates (30-day journey + department tasks).`);

    // 6. Create Workplace Learning Courses
    const courses = await Course.insertMany([
      {
        title: "Mastering Professional Communication",
        category: "Communication",
        description: "Learn how to write impactful emails, conduct engaging meetings, and communicate effectively across remote and in-person teams.",
        duration: "35 mins",
        icon: "MessageSquare",
        lessons: [
          {
            title: "Clear and Concise Written Communication",
            content: "Learn the BLUF (Bottom Line Up Front) framework for emails and workplace messages. Avoid jargon and emphasize clarity.",
            keyTakeaway: "Put your main request or point in the very first sentence.",
            durationMinutes: 10
          },
          {
            title: "Active Listening in Meetings",
            content: "Techniques to listen without interrupting, summarizing what you heard, and asking clarifying questions.",
            keyTakeaway: "Reflect back the speaker's key message before proposing an alternative.",
            durationMinutes: 12
          },
          {
            title: "Non-Verbal and Tone Awareness",
            content: "Understanding tone in written chat, camera presence in virtual standups, and body language.",
            keyTakeaway: "Use positive framing and polite emojis where appropriate to soften text tone.",
            durationMinutes: 13
          }
        ]
      },
      {
        title: "High-Performance Teamwork & Collaboration",
        category: "Teamwork",
        description: "Build trust with peers, embrace diverse perspectives, and deliver outstanding cross-functional outcomes.",
        duration: "40 mins",
        icon: "Users",
        lessons: [
          {
            title: "Psychological Safety in Teams",
            content: "Why great teams encourage healthy questions, open disagreement, and fast learning without blame.",
            keyTakeaway: "Never hesitate to say 'I do not know, but I will find out'.",
            durationMinutes: 12
          },
          {
            title: "Collaborative Problem Solving",
            content: "Techniques for brainstorming, pair programming, and collaborative review sessions.",
            keyTakeaway: "Focus on solving the problem together rather than defending your original idea.",
            durationMinutes: 14
          },
          {
            title: "Cross-Functional Synergy",
            content: "Working effectively with design, product management, QA, and business stakeholders.",
            keyTakeaway: "Understand the other discipline's goals and constraints to find win-win solutions.",
            durationMinutes: 14
          }
        ]
      },
      {
        title: "Time Management and Deep Work Habits",
        category: "Time Management",
        description: "Master the Eisenhower matrix, time-blocking, and eliminating distractions to produce high-value output consistently.",
        duration: "30 mins",
        icon: "Clock",
        lessons: [
          {
            title: "Eisenhower Matrix Prioritization",
            content: "Categorizing tasks into Urgent vs Important. Focusing your best energy on Important non-urgent tasks.",
            keyTakeaway: "Plan your top 3 daily priorities every morning before opening Slack.",
            durationMinutes: 10
          },
          {
            title: "Pomodoro & Deep Work Sprints",
            content: "Protecting 90-minute blocks of uninterrupted focus for complex problem solving.",
            keyTakeaway: "Turn off non-critical notifications during your deep work hours.",
            durationMinutes: 10
          },
          {
            title: "Managing Context Switching",
            content: "How multitasking destroys productivity and how to batch communications.",
            keyTakeaway: "Batch message checking to 2-3 designated windows per workday.",
            durationMinutes: 10
          }
        ]
      },
      {
        title: "Analytical Problem-Solving in the Workplace",
        category: "Problem-Solving",
        description: "Apply the 5 Whys, root-cause analysis, and hypothesis-driven debugging to solve complex challenges.",
        duration: "45 mins",
        icon: "CheckCircle",
        lessons: [
          {
            title: "Root Cause Analysis & 5 Whys",
            content: "Moving past immediate symptoms to identify the fundamental systemic cause of an issue.",
            keyTakeaway: "Ask 'Why?' five times until you reach the root process or design flaw.",
            durationMinutes: 15
          },
          {
            title: "Hypothesis-Driven Testing",
            content: "Formulating a testable hypothesis before making changes to code or processes.",
            keyTakeaway: "Document what you expect to observe before running an experiment.",
            durationMinutes: 15
          },
          {
            title: "Post-Mortems and Continuous Learning",
            content: "Running blameless post-incident reviews to ensure errors become learning assets for the organization.",
            keyTakeaway: "Fix the system, not the person.",
            durationMinutes: 15
          }
        ]
      },
      {
        title: "Professional Workplace Behavior and Ethics",
        category: "Professional Behavior",
        description: "Learn accountability, respectful communication, punctuality, and ethical conduct in a modern enterprise.",
        duration: "30 mins",
        icon: "Shield",
        lessons: [
          {
            title: "Accountability and Ownership",
            content: "Taking ownership of deliverables, communicating deadlines early, and following through.",
            keyTakeaway: "If a deadline is at risk, notify stakeholders immediately with an updated plan.",
            durationMinutes: 10
          },
          {
            title: "Respect and Inclusivity",
            content: "Treating all colleagues with dignity, valuing diversity, and adhering to workplace anti-harassment standards.",
            keyTakeaway: "Create an environment where everyone feels welcomed and respected.",
            durationMinutes: 10
          },
          {
            title: "Data Privacy and Confidentiality",
            content: "Safeguarding company IP, customer personal data, and system credentials.",
            keyTakeaway: "Never share sensitive company information or credentials insecurely.",
            durationMinutes: 10
          }
        ]
      },
      {
        title: "Project Management Fundamentals for Recruits",
        category: "Project Management",
        description: "Understand Agile, Scrum, Kanban, sprints, tickets, and how to deliver deliverables smoothly with your team.",
        duration: "45 mins",
        icon: "Kanban",
        lessons: [
          {
            title: "Agile & Scrum Overview",
            content: "Understanding sprint cycles, user stories, story points, and daily standups.",
            keyTakeaway: "A sprint is a steady cadence for iterative progress and feedback.",
            durationMinutes: 15
          },
          {
            title: "Managing Task Boards (Kanban)",
            content: "Tracking work across To Do, In Progress, In Review, and Done. Limiting Work-In-Progress (WIP).",
            keyTakeaway: "Keep your board tickets updated in real-time so the team knows current status.",
            durationMinutes: 15
          },
          {
            title: "Handling Scope and Blockers",
            content: "Identifying scope creep and raising blockers immediately to your Scrum Master or Manager.",
            keyTakeaway: "Never sit silently on a blocker for more than an hour without asking for help.",
            durationMinutes: 15
          }
        ]
      },
      {
        title: "Dynamic Presentation Skills & Demos",
        category: "Presentation Skills",
        description: "Master slide design, storytelling, voice projection, and handling tough questions with grace.",
        duration: "40 mins",
        icon: "Tv",
        lessons: [
          {
            title: "Structuring Your Presentation Narrative",
            content: "The classic arc: Hook, Problem Statement, Solution, Proof/Demo, Call to Action.",
            keyTakeaway: "Start with why the audience should care within the first 60 seconds.",
            durationMinutes: 12
          },
          {
            title: "Slide Design Best Practices",
            content: "Keeping slides uncluttered. High contrast, large fonts, visuals over walls of text.",
            keyTakeaway: "One main idea per slide with minimal bullet points.",
            durationMinutes: 14
          },
          {
            title: "Overcoming Stage Fright and Handling Q&A",
            content: "Breathing techniques, rehearsing transitions, and acknowledging questions gracefully.",
            keyTakeaway: "If you do not know an answer during Q&A, say 'Great question, let me research that and follow up today'.",
            durationMinutes: 14
          }
        ]
      },
      {
        title: "Building Workplace Confidence & Resilience",
        category: "Workplace Confidence",
        description: "Conquer imposter syndrome, welcome constructive feedback, celebrate micro-wins, and build lasting professional confidence.",
        duration: "35 mins",
        icon: "Smile",
        lessons: [
          {
            title: "Overcoming Imposter Syndrome",
            content: "Recognizing that every senior expert was once a beginner. Replacing negative self-talk with curiosity.",
            keyTakeaway: "You were hired because of your potential and intelligence. You belong here.",
            durationMinutes: 10
          },
          {
            title: "Turning Feedback into Superpowers",
            content: "Viewing constructive feedback as a fast-track roadmap for personal mastery rather than personal criticism.",
            keyTakeaway: "Say 'Thank you for this feedback, how can I best demonstrate improvement?'",
            durationMinutes: 12
          },
          {
            title: "Celebrating Micro-Wins and Journaling",
            content: "Recording daily accomplishments in your Confidence Journal to visualize compound growth over 30 days.",
            keyTakeaway: "Small daily progress compounds into massive professional confidence.",
            durationMinutes: 13
          }
        ]
      }
    ]);

    console.log(`Created ${courses.length} workplace learning courses.`);

    // 7. Create Achievement Badges
    const achievements = await Achievement.insertMany([
      {
        title: "Team Player",
        badgeCode: "team-player",
        description: "Demonstrated exemplary collaborative spirit, assisted teammates, and fostered trust across the organization.",
        icon: "Users",
        color: "#10b981",
        recipients: [
          {
            employee: employeeUser._id,
            awardedBy: managerUser._id,
            awardedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            note: "Great enthusiasm pairing up with teammates during Week 2 orientation!"
          }
        ]
      },
      {
        title: "Good Communicator",
        badgeCode: "good-communicator",
        description: "Recognized for clear, polite, and effective written and verbal communication in team meetings and client interactions.",
        icon: "MessageSquare",
        color: "#3b82f6",
        recipients: [
          {
            employee: employeeUser._id,
            awardedBy: hrUser._id,
            awardedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            note: "Excellent self-introduction and active participation in the onboarding session."
          }
        ]
      },
      {
        title: "Goal Achiever",
        badgeCode: "goal-achiever",
        description: "Consistently delivered assigned development milestones on or ahead of scheduled deadlines.",
        icon: "CheckCircle",
        color: "#8b5cf6",
        recipients: []
      },
      {
        title: "Confident Presenter",
        badgeCode: "confident-presenter",
        description: "Successfully prepared and delivered an engaging presentation showcasing technical project deliverables.",
        icon: "Award",
        color: "#f59e0b",
        recipients: []
      },
      {
        title: "Quick Learner",
        badgeCode: "quick-learner",
        description: "Rapidly absorbed unfamiliar technical concepts and completed onboarding learning modules with high proficiency.",
        icon: "Zap",
        color: "#ec4899",
        recipients: [
          {
            employee: employeeUser._id,
            awardedBy: managerUser._id,
            awardedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: "Completed initial learning courses in record time with thoughtful reflections."
          }
        ]
      },
      {
        title: "Problem Solver",
        badgeCode: "problem-solver",
        description: "Applied analytical rigor and perseverance to debug, isolate, and resolve tricky technical or operational bottlenecks.",
        icon: "HelpCircle",
        color: "#06b6d4",
        recipients: []
      }
    ]);

    console.log(`Created ${achievements.length} achievement badges.`);

    // 8. Assign 30-Day Tasks and Department Tasks to Demo Employee
    // Let's populate Days 1 to 5 as completed, Day 6 as submitted, Day 7 in-progress, and rest pending
    const createdAssignments = [];
    const templatesList = await ConfidenceTaskTemplate.find({ category: "general-journey" }).sort({ dayNumber: 1 });

    const now = Date.now();
    for (let i = 0; i < templatesList.length; i++) {
      const tpl = templatesList[i];
      let status = "pending";
      let completionPercentage = 0;
      let submissionText = "";
      let feedback = "";
      let rating = null;
      let completedAt = null;

      if (tpl.dayNumber <= 4) {
        status = "completed";
        completionPercentage = 100;
        completedAt = new Date(now - (6 - tpl.dayNumber) * 24 * 60 * 60 * 1000);
        submissionText = `Completed Day ${tpl.dayNumber}: I accomplished all steps described in the guidelines and verified with my team.`;
        feedback = "Outstanding initiative! Keep up this high standard of work.";
        rating = 5;
      } else if (tpl.dayNumber === 5) {
        status = "submitted";
        completionPercentage = 90;
        submissionText = "Here is my 2-minute elevator pitch summarizing my junior software developer role and how I support team sprint goals.";
      } else if (tpl.dayNumber === 6) {
        status = "in-progress";
        completionPercentage = 40;
      }

      const assignment = await EmployeeTaskAssignment.create({
        template: tpl._id,
        assignedTo: employeeUser._id,
        assignedBy: managerUser._id,
        dueDate: new Date(now + tpl.dayNumber * 24 * 60 * 60 * 1000),
        status,
        completionPercentage,
        submissionText,
        feedback,
        rating,
        completedAt
      });
      createdAssignments.push(assignment);
    }

    // Also assign Software Developer specific tasks
    const devTemplates = await ConfidenceTaskTemplate.find({
      category: "department-specific",
      department: "Software Engineering"
    });
    for (const tpl of devTemplates) {
      await EmployeeTaskAssignment.create({
        template: tpl._id,
        assignedTo: employeeUser._id,
        assignedBy: managerUser._id,
        dueDate: new Date(now + 14 * 24 * 60 * 60 * 1000),
        status: "pending",
        completionPercentage: 0
      });
    }

    console.log(`Assigned 30-day journey and department tasks to ${employeeUser.name}.`);

    // 9. Sample Training Progress
    await TrainingProgress.create([
      {
        employee: employeeUser._id,
        course: courses[0]._id,
        completedLessons: [0, 1, 2],
        isCompleted: true,
        completedAt: new Date(now - 2 * 24 * 60 * 60 * 1000)
      },
      {
        employee: employeeUser._id,
        course: courses[1]._id,
        completedLessons: [0, 1],
        isCompleted: false
      }
    ]);

    // 10. Sample Journal Entries
    await JournalEntry.insertMany([
      {
        employee: employeeUser._id,
        date: new Date(now - 3 * 24 * 60 * 60 * 1000),
        learnedToday: "Learned how the internal repository branches are set up and how pull request approvals work.",
        completedToday: "Set up my local development environment and ran all frontend test suites.",
        challengesFaced: "Encountered initial environment variable mismatch with MongoDB connection string.",
        improveTomorrow: "Spend 20 minutes reviewing code styling guidelines before submitting my next PR.",
        mood: "confident"
      },
      {
        employee: employeeUser._id,
        date: new Date(now - 2 * 24 * 60 * 60 * 1000),
        learnedToday: "Understood our Scrum sprint cycle and how tickets move across the Kanban board.",
        completedToday: "Attended daily standup and introduced myself to two senior engineers.",
        challengesFaced: "Remembering all acronyms used during the sprint planning meeting.",
        improveTomorrow: "Create a personal glossary of company acronyms and terms.",
        mood: "motivated"
      },
      {
        employee: employeeUser._id,
        date: new Date(now - 1 * 24 * 60 * 60 * 1000),
        learnedToday: "Completed the Professional Communication course and learned the BLUF framework.",
        completedToday: "Drafted my 2-minute elevator pitch for Day 5 task.",
        challengesFaced: "Condensing complex thoughts into clear bullet points without rambling.",
        improveTomorrow: "Practice speaking my pitch out loud in front of a mirror or with a peer.",
        mood: "confident"
      }
    ]);

    // 11. Sample Project & Tasks
    const sampleProject = await Project.create({
      title: "Employee Portal Next-Gen Feature Release",
      description: "Implementing interactive learning journeys, task progress trackers, and real-time feedback widgets for company onboarding.",
      department: "Software Engineering",
      manager: managerUser._id,
      members: [managerUser._id, employeeUser._id],
      deadline: new Date(now + 21 * 24 * 60 * 60 * 1000),
      status: "in-progress",
      progress: 45
    });

    await ProjectTask.insertMany([
      {
        project: sampleProject._id,
        title: "Design Responsive Navbar & Sidebar Component",
        description: "Create an intuitive navigation bar with brand logo, active page indicator, user role pill, and logout action.",
        assignedTo: employeeUser._id,
        assignedBy: managerUser._id,
        dueDate: new Date(now + 3 * 24 * 60 * 60 * 1000),
        priority: "high",
        status: "completed",
        submissionText: "Implemented clean responsive sidebar and topbar adhering to navy/white palette.",
        feedback: "Super clean implementation! Great responsiveness.",
        completedAt: new Date(now - 1 * 24 * 60 * 60 * 1000)
      },
      {
        project: sampleProject._id,
        title: "Implement Task Submission Modal with Feedback Display",
        description: "Allow new recruits to write their submission text, attach files, and view their manager's feedback score.",
        assignedTo: employeeUser._id,
        assignedBy: managerUser._id,
        dueDate: new Date(now + 6 * 24 * 60 * 60 * 1000),
        priority: "medium",
        status: "in-progress"
      }
    ]);

    // 12. Sample Announcements
    await Announcement.insertMany([
      {
        title: "Welcome to our Fall 2026 New Recruit Cohort!",
        content: "We are thrilled to welcome our newest team members across Engineering, Marketing, HR, and Design! Please explore your 30-Day Confidence Journey and reach out if you have questions.",
        author: hrUser._id,
        department: "All",
        priority: "important"
      },
      {
        title: "All-Hands Company Showcase This Friday at 3:00 PM",
        content: "Join us for our monthly showcase where new recruits and product teams will share demos and key learnings.",
        author: adminUser._id,
        department: "All",
        priority: "general"
      }
    ]);

    // 13. Sample Messages
    await Message.insertMany([
      {
        sender: managerUser._id,
        recipient: employeeUser._id,
        content: "Hi Emma, welcome to the engineering team! Please let me know once you finish your Day 5 submission.",
        read: true
      },
      {
        sender: employeeUser._id,
        recipient: managerUser._id,
        content: "Thank you Marcus! I just submitted Day 5 for your review. Looking forward to your thoughts!",
        read: true
      }
    ]);

    console.log("Database seeded successfully with comprehensive demo data!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
