# Project Constitution (gemini.md)

## Data Schemas

**1. UI Input Payload:**
```json
{
  "jiraId": "string (e.g., KAN-4)"
}
```

**2. Jira API Interaction (Source of Truth):**
```json
{
  "issueId": "KAN-4",
  "summary": "string",
  "description": "string",
  "attachments": [
    {
      "id": "string",
      "filename": "string",
      "content": "extracted text/base64 from attachment"
    }
  ]
}
```

**3. Groq API Payload (LLM Generation):**
```json
{
  "model": "mixtral-8x7b-32768", 
  "messages": [
    {
      "role": "system",
      "content": "You are a 15-year veteran automation engineer. Generate professional, comprehensive test scenarios..."
    },
    {
      "role": "user",
      "content": "Context from Jira KAN-4 and attached document: [TEXT]. Generate scenarios."
    }
  ]
}
```

**4. UI Output Payload (Final Result):**
```json
{
  "jiraId": "KAN-4",
  "status": "success | error",
  "testScenarios": "markdown string or structured JSON array containing the generated scenarios"
}
```

## Behavioral Rules
1. **Persona:** Act as a 15-year veteran automation engineer. Output must be highly professional, emphasizing robust testing practices, edge cases, and maintainability.
2. **Security:** API keys (Jira, Groq) must be handled securely (e.g., environment variables, not hardcoded in the frontend).
3. **Design:** The React UI must be modern, highly aesthetic, using dynamic animations, glassmorphism, and premium color palettes.
4. **Architecture:** Use a framework like Next.js to handle both the React UI and the secure backend API routes for Groq/Jira integration, making it easy to deploy to Vercel.

## Architectural Invariants
- Frontend: React (Next.js App Router recommended for Vercel deployment).
- Styling: Custom CSS / Tailwind (if requested) focusing on premium UX.
- Backend/API: Next.js Serverless Functions to securely interact with Jira and Groq APIs avoiding CORS and exposing secrets.
