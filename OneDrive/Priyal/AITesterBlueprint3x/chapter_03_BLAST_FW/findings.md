# Findings

## Research
- Next.js is the optimal choice for building a React UI that requires secure API key handling (Jira, Groq) and easy deployment to Vercel.
- Need a robust way to parse document attachments from Jira. If it's a PDF/Docx, we may need a parser library in the backend before sending text to Groq.

## Discoveries
- **Integrations:** Jira API (URL, token, email) and Groq API.
- **Source of Truth:** Data is within the Jira ID (including an attached test scenario document).
- **Delivery:** A React web application URL that the user can later upload to Vercel.
- **Persona:** 15-year automation engineer.

## Constraints
- Must not expose API keys in the frontend React code.
- Must handle file extraction from Jira attachments securely.
- Design must be highly premium and modern.
