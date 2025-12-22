<div align="center">

# 🎯 ApplyAI

### Your AI-Powered Job Application Arsenal

*Stop sending generic applications. Start landing interviews.*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Claude](https://img.shields.io/badge/Claude-AI-orange?style=for-the-badge&logo=anthropic)](https://anthropic.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Roadmap](#-roadmap)

</div>

---

## 🤔 The Problem

Job hunting is broken:
- 📝 Writing cover letters from scratch for every application is exhausting
- 🎤 Interview prep is scattered across notes, docs, and your memory
- 🔍 You forget which answers worked well for which question types
- 📊 No way to track what's working and what isn't

## 💡 The Solution

**ApplyAI** is your personal job application command center:

1. **Store once** — Upload your resume and build a Q&A bank of your best answers
2. **Generate instantly** — Paste a job description, get a tailored cover letter in seconds
3. **Prepare smarter** — AI pulls your most relevant experiences for each interview
4. **Track everything** — See your pipeline, success rates, and improve over time

---

## ✨ Features

| Feature | Description | Status |
|---------|-------------|--------|
| 📄 **Resume Vault** | Parse and store your resume, searchable by skills & experience | 🔨 Building |
| 💬 **Q&A Bank** | Your best answers to common questions, tagged and searchable | 🔨 Building |
| 📝 **Cover Letter Generator** | Tailored letters matching your experience to job requirements | ⏳ Planned |
| 🎤 **Interview Prep** | Likely questions + your personalized answers using RAG | ⏳ Planned |
| 📊 **Gap Analysis** | What they want vs. what you have + how to address gaps | ⏳ Planned |
| 📋 **Application Tracker** | Track status, notes, and outcomes for every application | ⏳ Planned |

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | Next.js 15 (App Router) | Full-stack React with API routes, server components |
| **Language** | TypeScript | Type safety, better DX, fewer runtime bugs |
| **Database** | Supabase (PostgreSQL) | Managed Postgres with built-in auth, realtime, and pgvector |
| **Vector Search** | pgvector | Semantic search through Q&A bank for relevant answer retrieval |
| **ORM** | Drizzle | Type-safe, lightweight, SQL-like syntax |
| **AI** | Claude API (Anthropic) | Advanced reasoning for cover letters and interview prep |
| **Styling** | Tailwind CSS | Utility-first, rapid UI development |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm / npm / yarn
- Supabase account (free tier works)
- Anthropic API key

### Installation
```bash
# Clone the repository
git clone https://github.com/lmagsino/applyai.git
cd applyai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📐 Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         ApplyAI                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Next.js   │  │   Drizzle   │  │      Claude AI      │  │
│  │   Frontend  │◄─┤     ORM     │◄─┤   Cover Letters     │  │
│  │             │  │             │  │   Interview Prep    │  │
│  └─────────────┘  └──────┬──────┘  └─────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│               ┌─────────────────────┐                        │
│               │      Supabase       │                        │
│               │  PostgreSQL + pgvec │                        │
│               └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure
```
applyai/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   └── health/         # Health check endpoint
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── lib/                    # Core business logic
│   ├── ai/                 # Claude AI integration
│   ├── db/                 # Database connection & schema
│   └── services/           # Feature services
├── types/                  # Shared TypeScript types
└── public/                 # Static assets
```

---

## 🗺 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Next.js 15
- [x] TypeScript configuration
- [x] Project architecture
- [ ] Database schema design
- [ ] Supabase integration

### Phase 2: Core Features
- [ ] Resume parser & storage
- [ ] Q&A Bank CRUD operations
- [ ] Semantic search with pgvector

### Phase 3: AI Generation
- [ ] Cover letter generator
- [ ] Interview prep with RAG
- [ ] Gap analysis

### Phase 4: Polish
- [ ] Application tracker
- [ ] Dashboard UI
- [ ] Analytics & insights

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to open an issue.

---

## 📄 License

MIT © [Leodegario Magsino Jr.]

---

<div align="center">

**Built with ☕ and Claude**

*Because job hunting shouldn't feel like a full-time job*

</div>
EOF