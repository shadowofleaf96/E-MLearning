# 🎓 E-MLearning (Lumina Learning) — Enterprise Multi-Tenant SaaS LMS

> **A modern, scalable, multi-tenant Software-as-a-Service (SaaS) Learning Management System (LMS) built for educational institutions, corporate academies, and independent educators.**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Express%20%2B%20TypeScript-green?style=flat&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Prisma-blue?style=flat&logo=postgresql)](https://www.prisma.io/)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini%20Flash-orange?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe%20Subscriptions-purple?style=flat&logo=stripe)](https://stripe.com/)

---

## 🌟 Overview

**E-MLearning (Lumina Learning)** is a full-featured, enterprise-grade cloud LMS engineered with a multi-tenant architecture. Every tenant (institution, university, or company) enjoys dedicated tenant branding, domain/subdomain isolation, customizable themes, and independent user directories.

The platform provides dedicated, tailored workspaces for:
1. **Super Admins** — Global platform management, tenant provisioning, security auditing, and plan subscriptions.
2. **Tenant Admins** — White-label branding, domain mapping, tenant-wide user management, and analytics.
3. **Instructors** — Rich curriculum builder, AI course generator, assignment rubric grading, direct student messaging, and drip scheduling.
4. **Students** — Interactive video/doc player, note-taking, peer discussions, assignment submissions, exams, gamification (XP/badges/streaks), and certificates.

---

## 🚀 Key Feature Matrix

### 1. 🏢 Multi-Tenancy & White-Labeling
- **Domain & Subdomain Isolation**: Automatic tenant context resolution via HTTP Host header (`tenant.domain.com` or custom CNAME).
- **Custom Branding**: Tenant-specific primary/secondary colors, logos (light & dark), favicons, and mission statements.
- **Tenant Subscription Plans**: Self-serve or admin-assigned plans (`free`, `starter`, `pro`, `enterprise`) integrated with Stripe billing.

### 2. 🤖 AI-Powered Course Creator
- **Gemini AI Integration**: Powered by `@google/generative-ai` with prompt fallback resilience.
- **Instant Curriculum Generation**: Enter a topic, level, and lesson count to automatically generate complete modules, structured lessons, and lesson outlines.
- **AI Lesson Content Drafter**: Drafts rich Markdown explanations, learning objectives, and key takeaways for any lesson title with one click.

### 3. 👨‍🏫 Instructor Suite & Productivity
- **Curriculum Drag-and-Drop Builder**: Sortable modules and lessons powered by `@dnd-kit`.
- **Course Content Drip Scheduling**: Set future release dates (`publishAt`) on modules or lessons to release content sequentially or on a schedule.
- **Assignment & Rubric Grading System**:
  - Create project milestones and assignments with customizable multi-criteria rubrics.
  - Review student submissions with file/link attachments.
  - Assign numeric grades with qualitative instructor feedback.
- **1:1 In-Platform Direct Messaging**:
  - Live threaded direct conversations between students and instructors.
  - Unread message counters in the navbar and sidebar.
  - Real-time conversation history and automatic read-receipts.

### 4. 🎓 Immersive Student Learning Experience
- **Interactive Player**: Supports YouTube embeds, direct video links, PDF documents, and rich text lessons.
- **Time-Spent Verification**: Configurable minimum time requirement before unlocking completion to ensure authentic learning.
- **Sequential Module Locking**: Automatic unlocking of sequential modules upon completing prerequisite lessons.
- **Synchronized Personal Notes**: Database-persisted student notes with auto-save and local fallback.
- **Course & Lesson Discussions (Q&A)**: Ask questions per course/lesson, upvote insightful responses, and mark official solutions.
- **5-Star Course Reviews & Ratings**: Submit verified reviews and view interactive 5-star distribution breakdowns.
- **Wishlist & Bookmarks**: Save courses for later with quick-access tabs in student learning hub.
- **Global Search (Cmd + K)**: Universal keyboard-accessible omnisearch across courses, lessons, discussions, and instructors.

### 5. 🎮 Gamification & Engagement
- **Experience Points (XP)**: Earn XP for completing lessons, passing exams, and completing courses.
- **Dynamic Levels & Streaks**: Daily login bonus streak calculation and real-time level progression.
- **Badge Awards**: Milestone achievements (e.g., *Fast Learner*, *Quiz Master*, *Consistent Scholar*).

### 6. 🛡️ Admin & Operational Tools
- **Course Moderation & Governance**: Multi-stage review workflow (Draft -> Pending Review -> Approved / Revision Required / Rejected) with audit logs and feedback comments.
- **Targeted Broadcast Campaigns**: Compose and dispatch announcement campaigns targeted to All Users, Students, Instructors, or specific Course Cohorts.
- **Revenue & Payout Queue**: Track platform net revenue and instructor payout requests with review modal and automated notifications.
- **Nested Category Hierarchy & Tags**: Unlimited multi-level category trees with parent-child relationships and keyword tag assignments.

### 7. 🛤️ Learning Paths, Prerequisites & Live Classrooms
- **Learning Paths & Bundles**: Group multiple related courses into structured career tracks with auto-enrollment into bundled courses and sequence progress visualization.
- **Course Prerequisites**: Cross-course dependencies blocking student enrollments until foundational prerequisite courses are completed.
- **Live Video Classrooms (`/live/[sessionId]`)**: High-performance interactive video classroom supporting WebRTC live streaming (Jitsi Meet engine) and interactive Studio Stage, camera/mic/screen-share controls, real-time live chat drawer, and attendance tracking.
- **Mobile Responsive Workspaces**: Responsive slide-over curriculum drawer on mobile viewports for student learn workspace, touch targets, and responsive layouts across all portals.

---

## 🏗️ Architecture & Tech Stack

### Frontend (`/client`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Material Design 3 design tokens
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + React Hooks
- **Drag & Drop**: `@dnd-kit/core` & `@dnd-kit/sortable`
- **Icons**: `lucide-react` & Google Material Symbols
- **Notifications**: `react-toastify`
- **Internationalization**: Multi-locale routing (`en`, `fr`, `ar`) with RTL support

### Backend (`/server`)
- **Runtime**: Node.js (v20+) with TypeScript
- **Framework**: Express.js with modular feature architecture (`/src/modules/`)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Database**: PostgreSQL (Cloud-hosted on Aiven)
- **Validation**: [Zod](https://zod.dev/) schemas on request bodies, queries, and params
- **Security**: JWT authentication, bcrypt password hashing, CORS, rate limiting, and helmet

---

## 📂 Project Structure

```
E-MLearning/
├── client/                               # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/[locale]/                 # Localized Next.js App Router
│   │   │   ├── (public)/                 # Landing, catalog, course details
│   │   │   ├── student/                  # Student dashboard, learn player, messages
│   │   │   ├── instructor/               # Course builder, assignments, analytics
│   │   │   ├── admin/                    # Tenant admin settings, branding, users
│   │   │   └── super-admin/              # Multi-tenant directory, global analytics
│   │   ├── components/                   # Shared UI, layout, modals, navigation
│   │   ├── modules/                      # Modular domain features
│   │   │   ├── ai/                       # AI generator modals and services
│   │   │   ├── assignments/              # Student submission & instructor grading UI
│   │   │   ├── courses/                  # Course builder, curriculum, progress
│   │   │   ├── discussions/              # Q&A forum components
│   │   │   ├── gamification/             # Badges, levels, XP counters
│   │   │   ├── messaging/                # Direct messaging dual-pane chat
│   │   │   └── reviews/                  # 5-star review components
│   │   ├── services/                     # Axios API clients & endpoints
│   │   └── store/                        # Redux Toolkit slices
├── server/                               # Express.js + Prisma Backend
│   ├── prisma/
│   │   └── schema.prisma                 # Multi-tenant PostgreSQL Prisma schema
│   ├── src/
│   │   ├── modules/                      # Backend domain modules
│   │   │   ├── ai/                       # Gemini AI course & lesson generation
│   │   │   ├── assignments/              # Assignment creation, submission, grading
│   │   │   ├── bookmarks/                # Student wishlist & bookmarks
│   │   │   ├── courses/                  # Course CRUD & catalog
│   │   │   ├── discussions/              # Q&A forum & reply threads
│   │   │   ├── exams/                    # Quizzes & grading engine
│   │   │   ├── gamification/             # XP & badge awards
│   │   │   ├── messaging/                # 1:1 Direct messaging service
│   │   │   ├── modules/                  # Course modules & drip scheduling
│   │   │   ├── progress/                 # Sequential locking & note persistence
│   │   │   └── reviews/                  # Review submissions & moderation
│   │   ├── shared/                       # Prisma client, AppError, middleware
│   │   ├── tests/                        # Automated backend test suites
│   │   │   ├── sprint1_verify.ts         # Phase 1 & 6.5 verification
│   │   │   └── phase2_verify.ts          # Phase 2 messaging & assignment verification
│   │   └── app.ts                        # Express server entrypoint
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: `v20.x` or later
- **npm** / **bun** / **yarn**
- **PostgreSQL**: Local or cloud database (e.g. Aiven, Supabase, Neon)

### 1. Database Setup
```bash
cd server
cp .env.example .env
# Set DATABASE_URL in server/.env
npx prisma db push
npx prisma generate
```

### 2. Backend Startup
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Startup
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:3000
```

### 4. Running Automated Verification
```bash
cd server
npx tsx src/tests/sprint1_verify.ts    # Tests Phase 1 (Reviews, Discussions, Search, Notes)
npx tsx src/tests/phase2_verify.ts     # Tests Phase 2 (Messaging, Assignments, Drip Schedule)
```

---

## 🗺️ Roadmap & Phase Completion

| Phase | Description | Status |
|:---|:---|:---:|
| **Phase 1: Student Engagement** | Reviews, Course Discussions, Notes persistence, Wishlist, Global Cmd+K Search | ✅ Completed |
| **Phase 2: Instructor Productivity** | Direct 1:1 Messaging, Assignment & Rubric Grading, Drip Content Scheduling | ✅ Completed |
| **Phase 3: Admin Operations** | Course Moderation & Revision Workflow, Broadcast Campaigns, Revenue & Payouts, Categories & Tags | ✅ Completed |
| **Phase 4: Advanced Learning** | Learning paths, Course prerequisites, Live video integrations | ⏳ Next Up |
| **Phase 5: Platform Completeness** | WebSockets notifications, Student learning analytics, Public webhook API | 📋 Planned |

---

## 📄 License
MIT © E-Tactiques LMS
