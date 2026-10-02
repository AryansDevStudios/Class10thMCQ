# 📝 Class 10 MCQ Examination Portal

> Real-time academic assessment and MCQ testing platform built for CBSE Class 10 students, featuring tamper-proof server timers, anti-cheat monitoring, and KaTeX mathematical rendering.

[![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.167-FF4154?style=for-the-badge&logo=tanstack)](https://tanstack.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase_Firestore-12.13-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![KaTeX](https://img.shields.io/badge/KaTeX-LaTeX_Math-00D084?style=for-the-badge&logo=latex&logoColor=white)](https://katex.org/)
[![Status](https://img.shields.io/badge/Status-Production_Ready-brightgreen?style=for-the-badge)]()

---

## 📖 Overview

**Class10thMCQ** is an examination portal and evaluation system designed specifically for CBSE Class 10 curricula across Sections A, B, and H. Powered by TanStack Start, React 19, and Firebase Firestore, the portal delivers a controlled, tamper-resistant testing environment equipped with synchronized server time offsets, automated submission locks, and student integrity logging.

Educators can seamlessly manage exam schedules, write questions with real-time KaTeX LaTeX preview, upload question sets in bulk via JSON, monitor ongoing test sessions with live WebSocket-grade Firestore listeners, and export complete student score reports to Microsoft Excel and formatted PDF documents.

---

## ✨ Features

- **Class 10 Section Management**: Built-in roster workflows supporting Class 10 sections (**A**, **B**, and **H**) and strict 4-digit student identification numbers (`Sr. No.`).
- **Tamper-Resistant Server Timer**: Computes server-to-client clock drift offsets using Firestore `serverTimestamp()` (`serverNow - Date.now()`). Device clock manipulation cannot prolong the test; the system enforces instant auto-submission upon window expiration (`serverNow >= test.endAt`).
- **Anti-Cheat Integrity Suite**:
  - **Tab Switch & Blur Tracking**: Detects browser visibility changes (`document.visibilitychange`) and window blurs, continuously updating the student's infraction count (`tabSwitches`) on the proctor dashboard.
  - **Dynamic Answer Shuffling**: Shuffles answer choices per student based on a recorded randomized seed to inhibit collusion.
- **KaTeX Mathematical & Science Formula Support**: Full LaTeX math rendering support via `react-katex` for geometry, algebra, trigonometry, and scientific notations.
- **Live Proctoring & Real-Time Grading**: Faculty observe live submissions, real-time scores, and tab-switch violations via Firebase `onSnapshot` real-time synchronization.
- **Comprehensive Grade Reporting**:
  - **Excel Spreadsheets (.xlsx)**: Generates full gradebooks with per-question correctness matrices using SheetJS.
  - **Printable PDF Cards**: Generates formatted, print-ready scorecards and result summaries via `jspdf` and `jspdf-autotable`.
- **Bulk Examination Importer**: Create assessments through an interactive form or import full tests via structured JSON files.

---

## 🛠️ Tech Stack

### Web & Application Core
- **Framework**: TanStack Start 1.167 (Full-Stack React Framework with Server Functions)
- **Routing**: `@tanstack/react-router` 1.168
- **UI & State**: React 19.2 & React DOM, `@tanstack/react-query` 5.83
- **Styling**: Tailwind CSS 4.2 with Slate & Blue color architecture
- **Component Primitives**: Radix UI, Lucide React, Sonner notifications

### Formatting & Document Generation
- **LaTeX Math Engine**: `katex` 0.17 & `react-katex`
- **Spreadsheet Engine**: SheetJS (`xlsx`)
- **PDF Generation**: `jspdf` 4.2 & `jspdf-autotable` 5.0
- **Form Management**: React Hook Form 7.71 with Zod 3.24 schema validation

### Backend & Cloud Infrastructure
- **Database & Auth**: Firebase Firestore 12.13 (Server heartbeats, real-time query listeners)
- **Deployment**: Netlify Edge Serverless (`netlify.toml`)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (or **Bun**)
- **Firebase Project**: Configured Firestore database instance

### Installation & Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AryansDevStudios/Class10thMCQ.git
   cd Class10thMCQ
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Running Locally

- **Development server**:
  ```bash
  npm run dev
  ```
  Open [http://localhost:5173](http://localhost:5173) in your browser.

- **Production build & local preview**:
  ```bash
  npm run build
  npm run preview
  ```

---

## 📁 Project Structure

```plaintext
Class10thMCQ/
├── firestore.rules.txt          # Firebase security rules definition
├── netlify.toml                 # Netlify deployment configuration
├── package.json                 # Node dependencies and project scripts
├── src/
│   ├── components/              # Radix UI components & custom widgets
│   │   ├── LatexRenderer.tsx    # KaTeX math rendering wrapper
│   │   └── ui/                  # Buttons, form controls, dialogs
│   ├── lib/
│   │   ├── auth.ts              # Student auth session management
│   │   └── firebase.ts          # Firebase SDK client initialization
│   ├── routes/                  # TanStack Start file-based routing
│   │   ├── __root.tsx           # Application shell and navbar
│   │   ├── index.tsx            # Portal welcome & landing page
│   │   ├── student.login.tsx    # Student portal authentication
│   │   ├── student.register.tsx # Class 10 registration (Sections A, B, H)
│   │   ├── student.index.tsx    # Student dashboard & active tests
│   │   ├── student.test.$testId.tsx # Secure examination hall & timer
│   │   ├── admin.index.tsx      # Educator authentication & dashboard
│   │   ├── admin.tests.new.tsx  # Exam builder & JSON importer
│   │   └── admin.tests.$testId.results.tsx # Live monitor & export
│   └── server.functions/        # TanStack server functions & verification
└── vite.config.ts               # Vite build and TanStack plugin configuration
```

---

## 🔒 Examination Integrity Features

1. **Authoritative Expiry**: Submissions past the deadline computed by `serverTimestamp()` are rejected server-side.
2. **Tab-Switch Auditing**: Any blur event or tab change increments the proctor violation counter.
3. **Session Hardening**: Prevents re-attempting or concurrent submissions from duplicate devices.

---

## 📄 License

Proprietary — Internal examination software developed for AryansDevStudios educational platforms.
