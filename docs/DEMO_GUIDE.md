# Demo Walkthrough Guide (3-Minute Presentation)

This script outlines a concise presentation walkthrough for recruiters and interview panels.

---

## ⏱️ Timeline overview
- **0:00 - 0:30**: Introduction & Problem Statement
- **0:30 - 1:00**: Architecture Overview
- **1:00 - 1:45**: Profile Intake & Blueprint Generation
- **1:45 - 2:30**: Settings, Custom Configurations, and Fallback Failover
- **2:30 - 3:00**: Saved Bookmarks, History Logs, and Summary

---

## 🎤 Presentation Script

### 1. Introduction & Problem Statement (0:00 - 0:30)
* **Goal**: State the project purpose clearly.
* **Script**:
  > *"Hi everyone, today I am presenting ProjectPilot.AI. Software engineering candidates struggle to capture attention with simple portfolio projects. They need to build production-grade architectures, but designing them from scratch takes weeks. ProjectPilot AI solves this by functioning as an autonomous system architect. It evaluates a developer's skills and dynamically designs 5 distinct capstone blueprints."*

### 2. Architecture Overview (0:30 - 1:00)
* **Goal**: Highlight the technical layout.
* **Script**:
  > *"Architecturally, this is a TypeScript monorepo. It features a React-Vite dashboard client and a secure Express gateway. The backend maps requests through a cascading failover queue across multiple AI engines, like Ollama and LM Studio. It implements structured tracing, Zod validations, and features an offline template fallback engine that scores 50 curated templates if local AI instances are offline."*

### 3. Profile Intake & Blueprint Generation (1:00 - 1:45)
* **Goal**: Demonstrate active generation.
* **Script**:
  > *"Let's see it in action. I'll navigate to 'Generate', enter my name, and specify developer skills like TypeScript and Go, using React and Express. I'll select 'AI & RAG' as the domain, set difficulty to 'Advanced', and hit submit. The client displays a 6-step progress overlay, showing active pings, prompt assembly, validation checks, and rendering."*
  *(Show results panel)*
  > *"Here are the 5 custom blueprints. Let's inspect 'RepoPilot AI'. We can see detailed taglines, resume points, directories structure, database tables, and interview questions. I can click 'Bookmark' to save this for later reference."*

### 4. Settings & Fallback Failover (1:45 - 2:30)
* **Goal**: Show settings flexibility and the priority fallback loop.
* **Script**:
  > *"Now let's review 'Settings'. We support Light, Dark, and AMOLED themes. We can customize the primary gateway provider and timeout windows. Let's see what happens if I configure an offline port target to simulate a connection timeout."*
  *(Simulate server offline)*
  > *"When the primary server is unavailable, the Express gateway automatically intercepts the timeout error, logs it with a unique requestId, and instantly routes the query to the next provider in the queue, falling back to the local templates engine without disrupting the client UI."*

### 5. Bookmarks, History Logs, and Summary (2:30 - 3:00)
* **Goal**: Conclude the demo.
* **Script**:
  > *"Lastly, I'll visit the 'Saved' page. We have two sections: 'Saved Blueprints' storing bookmarked projects, and 'History' which logs previous generations. I can load old blueprints instantly with one click. In summary, ProjectPilot.AI showcases complex software engineering features like cascading fallbacks, schema validations, and clean structured architectures. Thank you!"*
