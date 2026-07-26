# Deployment & Setup Guide

This document describes how to deploy **ProjectPilot.AI** to cloud hosting services (Vercel, Render, Railway) and set up local offline large language models.

---

## 1. Environment Configurations Reference
Create a `.env` file in the `backend/` directory with the following variables:

| Variable Name | Description | Default Value |
| :--- | :--- | :--- |
| `PORT` | The port Express backend gateway listens on. | `5000` |
| `OLLAMA_HOST` | Local host connection URL for Ollama instances. | `http://localhost:11434` |
| `OLLAMA_TIMEOUT_MS` | Max execution duration allowed before Ollama fails. | `30000` |
| `LMSTUDIO_HOST` | Local host connection URL for LM Studio instances. | `http://localhost:1234` |
| `LMSTUDIO_TIMEOUT_MS` | Max execution duration allowed before LM Studio fails. | `30000` |
| `HUGGINGFACE_API_KEY` | Secret access token for Hugging Face inference APIs. | *Optional* |
| `HUGGINGFACE_TIMEOUT_MS` | Max execution duration allowed for Hugging Face. | `20000` |
| `GROQ_API_KEY` | Secret access key for Groq cloud API gateways. | *Optional* |
| `GROQ_TIMEOUT_MS` | Max execution duration allowed for Groq. | `15000` |

---

## 2. Optional Local Ollama Setup
To use local offline AI capabilities:
1. **Download Ollama**: Install Ollama on your system from [ollama.com](https://ollama.com/).
2. **Download Models**: Run the following commands in your terminal to download supported models:
   ```bash
   ollama pull qwen3:8b
   ollama pull llama3.1:8b
   ```
3. **Start Ollama Service**: Verify that Ollama runs in the background. You can confirm by querying:
   ```bash
   curl http://localhost:11434/api/tags
   ```

---

## 3. Frontend Deployment (Vercel)
The React client can be deployed directly to Vercel as a static web site:
1. **Prepare Build Settings**:
   - Build Command: `npm run build` (Note: Ensure that the `shared` module is compiled first in your monorepo context. In Vercel, compile the client by setting the root build command to: `npm run build:shared && npm run build --prefix frontend`).
   - Output Directory: `frontend/dist`
2. **Setup Proxy Rewrites**: In production, the proxy configuration in Vite is bypassed. To redirect requests to your cloud API gateway, configure a `vercel.json` file in the root directory:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-backend-gateway.com/api/:path*"
       }
     ]
   }
   ```

---

## 4. Backend Deployment (Render or Railway)
The Node/Express gateway runs inside a standard server environment:
1. **Deploy to Render**:
   - Create a Web Service connected to your repository.
   - Build Command: `npm run build:shared && npm run build --prefix backend`
   - Start Command: `node backend/dist/index.js`
   - Add environment variables corresponding to the backend table parameters.
2. **Deploy to Railway**:
   - Create a new project on Railway.
   - Deploy your repository directly.
   - Set Build Command to compile backend assets and start using `node backend/dist/index.js`.
