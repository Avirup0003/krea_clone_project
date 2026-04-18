# 🚀 NextFlow – Krea.ai Inspired Node-Based Workflow Editor

A modern **node-based workflow editor** inspired by Krea.ai, built using **Next.js, React Flow, Tailwind CSS, and Gemini AI**.
This project allows users to visually create workflows by connecting nodes like **Text, Image, Video, LLM, Crop, and Extract Frame**.

---

## ✨ Features

* 🎯 Drag & Drop Node Editor (React Flow)
* 🔗 Connect nodes visually (DAG structure)
* 🤖 LLM Integration (Google Gemini API)
* 🖼️ Image Upload & Preview
* 🎥 Video Upload & Frame Extraction (API-ready)
* ✂️ Image Cropping (API-ready)
* 🔐 Authentication using Clerk
* 🗄️ Workflow Storage using Prisma + PostgreSQL
* 📊 Workflow Execution History Panel
* 🎨 Modern UI inspired by Krea.ai (Dark + Glassmorphism)

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React Flow, Tailwind CSS
* **State Management:** Zustand
* **Backend:** Next.js API Routes
* **AI Integration:** Google Generative AI (Gemini)
* **Auth:** Clerk
* **Database:** Prisma + PostgreSQL
* **Workflow Engine:** Trigger.dev (concept-based integration)

---

## 📁 Project Structure

```text
nextflow/
├── prisma/
│   └── schema.prisma         # PostgreSQL database schema and models
├── public/                   # Static assets and icons
├── src/
│   ├── app/                  # Next.js 14 App Router
│   │   ├── api/              # API Routes (Trigger.dev webhooks, workflow CRUD)
│   │   ├── sign-in/          # Clerk Authentication pages
│   │   ├── sign-up/          # Clerk Authentication pages
│   │   ├── layout.tsx        # Global layout and Auth providers
│   │   └── page.tsx          # Main React Flow canvas interface
│   ├── components/           # Reusable UI Components
│   │   ├── nodes/            # Custom React Flow Nodes (LlmNode, ImageNode, etc.)
│   │   ├── Header.tsx        # Top navigation (Export/Import, Save)
│   │   └── LeftSidebar.tsx   # Draggable node palette
│   ├── store/
│   │   └── useStore.ts       # Zustand global state management
│   └── trigger/              # Trigger.dev background tasks (FFmpeg, Gemini)
├── .env.local                # Secret environment variables (Ignored in Git)
├── package.json              # Project dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS styling and theme configuration
└── tsconfig.json             # TypeScript strict mode configuration
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/nextflow.git
cd nextflow
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_database_url
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public
```

---

### 4. Setup Database

```bash
npx prisma generate
npx prisma db push
```

---

### 5. Run Project

```bash
npm run dev
```

Open:

```
http://localhost:3000/editor
```

---

## 🧠 Workflow Example

### Branch A:

* Upload Image → Crop → LLM → Product Description

### Branch B:

* Upload Video → Extract Frame

### Final:

* Combine outputs using LLM → Marketing Post

---

## 🔌 API Endpoints

| Endpoint       | Description              |
| -------------- | ------------------------ |
| `/api/llm`     | Runs Gemini AI model     |
| `/api/trigger` | Workflow execution layer |
| `/api/crop`    | Image cropping           |
| `/api/extract` | Video frame extraction   |
| `/api/save`    | Save workflow to DB      |

---

## 🚧 Current Limitations

* Crop & Extract APIs are mock implementations
* No real FFmpeg integration yet
* Parallel DAG execution simplified

---

## 🚀 Future Improvements

* 🎥 Real FFmpeg video processing
* ⚡ Parallel workflow execution engine
* 💾 Load saved workflows
* 📡 Real Trigger.dev integration
* 🎯 Snap-to-grid canvas

---

## 📸 UI Inspiration

Inspired by **Krea.ai Node Editor UI**
Dark theme with smooth interactions and modern UX.

---

## 👨‍💻 Author

**Avirup Biswas**
