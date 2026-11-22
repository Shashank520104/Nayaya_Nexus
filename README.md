# ⚖️ NyayaNexus (न्यायनेक्सस)
### Multilingual Governance & Legal-Assistance AI Chatbot

> **Designing and refining prompts to help an AI chatbot understand multilingual queries, simplify legal information, explain government schemes, and provide clear, context-aware guidance while minimizing inaccurate responses.**

---

## 👥 Project Team & Engineering Ownership
Built collaboratively as a full-stack, end-to-end engineering project following **Model-View-Controller (MVC) Architecture**:

| Member | Role | Core Technical Ownership |
| :--- | :--- | :--- |
| **Shashank** | **Lead Architect & Backend Systems** | MVC Architecture, Google Gemini API Orchestration, Express Routers & Middlewares, Serverless configuration for Render & Vercel, Data Modeling (`SchemeModel`, `LegalModel`, `ChatSessionModel`). |
| **Shubh** | **Prompt Engineer & Legal Domain Specialist** | Prompt Pipeline Engineering, Anti-Hallucination Guardrails (`G-01` to `G-04`), BNS 2023 vs IPC 1860 Dual Statute Mapping, Prompt Studio Comparative Benchmarking. |
| **Ashutosh** | **Frontend Architect & UX Specialist** | Indic Multilingual UI, Web Speech API Integration (Voice STT & TTS), Interactive Scheme Eligibility Wizard, Live Legal Notice & RTI Draft Generator. |

---

## 🌟 Key Capabilities & Innovation Highlights

1. **Multilingual Vernacular Understanding:**
   - Heuristically recognizes queries in **Hindi (हिन्दी)**, **English**, **Bengali (বাংলা)**, **Telugu (తెలుగు)**, **Tamil (தமிழ்)**, **Marathi (मराठी)**, **Gujarati (ગુજરાતી)**, **Kannada (ಕನ್ನಡ)**, and **Punjabi (ਪੰਜਾਬੀ)** as well as **Hinglish**.
   - Responds in the exact script and colloquial tone of the citizen without intimidating legal jargon.

2. **Grounding in New Indian Criminal Laws (BNS 2023 & BNSS):**
   - India transitioned from IPC/CrPC to the **Bharatiya Nyaya Sanhita (BNS 2023)** and **Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)** on July 1, 2024.
   - NyayaNexus provides dual mapping (e.g., Cheating under Section 318 BNS / Section 420 IPC, Zero FIR under Section 173 BNSS / Section 154 CrPC) so citizens are never misled.

3. **Anti-Hallucination Guardrail Layer:**
   - **G-01 Bar Council Disclaimer:** Enforces compliance with Bar Council of India Rule 36. Reminds citizens to consult NALSA (15100) or licensed counsel for active litigation.
   - **G-02 Dual Statute Alignment:** Guarantees every legal section cited has cross-statute parity.
   - **G-03 Golden Hour Triage:** Immediately elevates the **1930 Cyber Fraud Helpline** and fund-freezing protocol when financial loss is detected.
   - **G-04 Statute Grounding Check:** Restricts AI inference to verified statutory datasets to prevent fictional citations.

4. **Dual Engine Execution (Online & Resilient Fallback):**
   - **Online Mode:** Powered by **Google Gemini 1.5 Flash** with low temperature (0.25) for factual accuracy.
   - **Offline / Zero-Key Mode:** Integrated with the **Nyaya Grounded Legal Engine**, providing 100% operational uptime, instant responses, and zero runtime crashes even without an API key!

5. **Citizen Tool Suite:**
   - **Interactive Scheme Eligibility Wizard:** Evaluates age, income, gender, occupation, and state to match citizens with central/state schemes (PM-Kisan, Ayushman Bharat, PMAY, SSY, MUDRA, etc.).
   - **Instant Legal Notice & RTI Generator:** Formats official RTI Section 6(1) applications, Consumer 15-day demand notices, Cheque bounce notices under Section 138 NI Act, and Police Zero FIR complaints. Ready to copy, download as `.txt`, or print.
   - **Prompt Engineering Studio:** Live sandbox comparing standard unprompted LLMs against the refined NyayaNexus prompt pipeline.

---

## 🏛️ MVC Architecture Overview

The codebase is strictly modular, humanized, and adheres to clean separation of concerns:

```
Nayaya_Nexus/
├── server.js                      # Server entry point (Render & Vercel compatible)
├── app.js                         # Express configuration, EJS setup & middlewares
├── vercel.json                    # Vercel serverless deployment config
├── render.yaml                    # Render Web Service blueprint
├── package.json                   # Dependencies, engines & scripts
├── .env.example                   # Environment variable template
│
├── config/
│   ├── app.config.js              # Ports, team metadata, statutory disclaimer
│   └── languages.config.js        # Supported Indic languages & speech locales
│
├── data/
│   ├── schemes.json               # 10+ verified central & state welfare schemes
│   ├── legalCorpus.json           # BNS, BNSS, Consumer Act, RTI, Cyber Law dataset
│   ├── promptTemplates.json       # Layered system prompts, guardrails & benchmarks
│   ├── helplines.json             # 24x7 verified statutory helplines (112, 1930, 15100, etc.)
│   └── sampleQueries.json         # Multilingual query suggestions
│
├── models/                        # [M] MODEL LAYER: Data schemas & domain queries
│   ├── schemeModel.js             # Scheme querying & rule-based eligibility evaluation
│   ├── legalModel.js              # Legal corpus search & BNS/IPC mapping
│   ├── promptModel.js             # System prompts & guardrail matrices
│   ├── draftModel.js              # Legal notice and RTI form schemas
│   └── chatSessionModel.js        # In-memory session tracking & prompt inspector snapshots
│
├── views/                         # [V] VIEW LAYER: Modular EJS templates & partials
│   ├── partials/
│   │   ├── head.ejs               # Meta tags, fonts, Marked.js, CSS includes
│   │   ├── navbar.ejs             # Sticky navigation, language switcher & theme toggle
│   │   └── footer.ejs             # Statutory disclaimers, helplines & team credits
│   ├── index.ejs                  # Public citizen empowerment landing page
│   ├── chat.ejs                   # Multilingual chatbot with voice mic & prompt inspector
│   ├── schemes.ejs                # Schemes directory & interactive eligibility wizard
│   ├── legal-guide.ejs            # BNS 2023 vs IPC explorer & citizen rights
│   ├── draft-generator.ejs        # RTI & Legal Notice live maker with preview
│   ├── prompt-studio.ejs          # Prompt Engineering laboratory & comparison benchmark
│   ├── team.ejs                   # Shashank, Shubh & Ashutosh project showcase
│   └── 404.ejs                    # Clean error handler
│
├── controllers/                   # [C] CONTROLLER LAYER: Orchestrates input & models
│   ├── chatController.js          # Handles prompt compilation & AI response stream
│   ├── schemeController.js        # Filters schemes & checks citizen eligibility
│   ├── legalController.js         # Delivers BNS explorer & emergency helplines
│   ├── draftController.js         # Generates downloadable legal notices
│   ├── promptStudioController.js  # Runs Raw vs Refined prompt benchmarks
│   └── teamController.js          # Renders team portfolio and architecture
│
├── services/                      # REUSABLE BUSINESS LOGIC
│   ├── promptEngine.js            # 4-stage prompt compilation & context injection
│   ├── geminiService.js           # Google Gemini AI caller with safe fallback
│   ├── legalGroundingService.js   # Deterministic legal knowledge generator
│   ├── schemeMatchingService.js   # Citizen profile demographic evaluator
│   └── draftGeneratorService.js   # Formal legal draft compiler
│
├── middlewares/
│   ├── errorHandler.js            # 404 and global error handling
│   └── rateLimiter.js             # In-memory burst protection for AI endpoints
│
└── public/                        # STATIC ASSETS
    ├── css/                       # Modular CSS stylesheets (variables, style, chat, schemes, studio)
    └── js/                        # Vanilla ES6 scripts (main, speech, chat, schemes, drafts, promptStudio)
```

---

## 🚀 Step-by-Step Deployment Guide

You can deploy NyayaNexus for **free** on **Render** or **Vercel** in under 5 minutes.

### Option 1: Deploying to Render (Recommended for Express Web Services)

Render natively runs Node.js web services with zero configuration.

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit for NyayaNexus"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/NyayaNexus.git
   git push -u origin main
   ```

2. **Create a Free Account on Render:**
   - Go to [render.com](https://render.com) and sign up with your GitHub account.

3. **Create a New Web Service:**
   - In the Render Dashboard, click **New +** → **Web Service**.
   - Select **Build and deploy from a Git repository**.
   - Connect your `NyayaNexus` GitHub repository.

4. **Configure Service Settings:**
   - **Name:** `nyayanexus`
   - **Region:** Any (e.g., *Singapore* or *Oregon*)
   - **Branch:** `main`
   - **Root Directory:** Leave blank (default)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`

5. **Set Environment Variables:**
   Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `GEMINI_API_KEY`: *(Optional)* Paste your Google Gemini API key if you have one. If omitted, NyayaNexus automatically runs on its built-in Grounded Legal Engine!

6. **Deploy:**
   - Click **Create Web Service**.
   - Render will build and deploy your app in about 1-2 minutes.
   - Your live link will be: `https://nyayanexus.onrender.com`.

---

### Option 2: Deploying to Vercel

NyayaNexus is pre-configured with `vercel.json` and a serverless Express handler.

1. **Install Vercel CLI (or use Vercel Web Dashboard):**
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI:**
   From the project root directory, run:
   ```bash
   vercel
   ```
   Follow the interactive prompts:
   - *Set up and deploy?* **Y**
   - *Which scope?* Select your personal account
   - *Link to existing project?* **N**
   - *Project name:* `nyayanexus`
   - *In which directory is your code located?* `./`
   - *Want to modify settings?* **N**

3. **Or Deploy via Vercel Web Dashboard:**
   - Go to [vercel.com](https://vercel.com) and log in with GitHub.
   - Click **Add New...** → **Project**.
   - Import your `NyayaNexus` repository.
   - Under **Environment Variables**, add:
     - `NODE_ENV`: `production`
     - `GEMINI_API_KEY`: *(Optional)* Your Gemini API key.
   - Click **Deploy**.
   - Your live link will be: `https://nyayanexus.vercel.app`.

---

## 💻 Local Development Setup

To run NyayaNexus on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/NyayaNexus.git
   cd NyayaNexus
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the project root:
   ```env
   PORT=3000
   NODE_ENV=development
   GEMINI_API_KEY=
   GEMINI_MODEL=gemini-1.5-flash
   ```

4. **Start the local server:**
   ```bash
   # Development mode with hot-reloading:
   npm run dev

   # Standard production start:
   npm start
   ```

5. **Open in your browser:**
   ```
   http://localhost:3000
   ```

---

## 🧪 Testing the Modules

Once running, you can test every capability:

1. **Chatbot (`/chat`):**
   - Test in Hindi: *"अगर पुलिस मेरी चोरी की FIR दर्ज न करे तो Zero FIR कैसे कराएं?"*
   - Test in English: *"I lost ₹45,000 in an online UPI scam 20 minutes ago. What should I do right now?"*
   - Test Voice: Click the microphone icon to dictate your question in Hindi or English.
   - Test Prompt Inspector: Click the microscope icon in the top right of the chat window to view the exact system prompt, citations, and active guardrails.

2. **Schemes Explorer (`/schemes`):**
   - Click **"Check My Eligibility"** button.
   - Enter: Age `30`, Income `₹1,80,000`, Gender `Female`, Occupation `Farmer`.
   - Click **Evaluate** → see real-time match scores for PM-Kisan, Ayushman Bharat, and Ladli Behna.

3. **Legal Guide & BNS Explorer (`/legal`):**
   - View the side-by-side transition from IPC 1860 to BNS 2023.
   - Check Zero FIR, arrest rights for women after sunset, and 24x7 emergency helplines.

4. **RTI & Legal Notice Generator (`/drafts`):**
   - Select **RTI Application (Section 6(1))** or **Consumer Demand Notice**.
   - Fill in your grievance details and click **Generate Formal Draft**.
   - Copy to clipboard or download as a `.txt` file ready to submit.

5. **Prompt Studio (`/prompt-studio`):**
   - Inspect the 4-layer prompt engineering pipeline.
   - Run side-by-side comparisons between a **Naive Raw Prompt** and the **NyayaNexus Refined Prompt** to see how hallucinations are eliminated.

---

## 📜 Statutory Legal Notice (Bar Council of India)

NyayaNexus is an educational and civic awareness system designed to assist Indian citizens in understanding public governance schemes, constitutional rights, and statutory procedures. In compliance with **Bar Council of India Rule 36**, NyayaNexus does not provide formal legal advocacy or represent clients in judicial proceedings. Citizens requiring free statutory legal counsel should contact the **National Legal Services Authority (NALSA) at Helpline 15100** or visit their nearest District Legal Services Authority (DLSA).

---

© 2026 **NyayaNexus**. Created by **Shashank**, **Shubh**, and **Ashutosh**. Licensed under the [MIT License](LICENSE).
