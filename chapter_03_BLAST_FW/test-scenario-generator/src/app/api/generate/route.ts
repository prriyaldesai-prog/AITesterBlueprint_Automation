import { NextResponse } from 'next/server';
import axios from 'axios';
import Groq from 'groq-sdk';
import mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    const { jiraUrl, jiraEmail, jiraToken, groqKey, jiraId } = await req.json();

    if (!jiraUrl || !jiraEmail || !jiraToken || !groqKey || !jiraId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');
    
    // 1. Parse Jira Base URL safely
    let baseJiraUrl = jiraUrl;
    try {
      baseJiraUrl = new URL(jiraUrl).origin;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid Jira URL format' }, { status: 400 });
    }

    // 2. Fetch Jira Issue Details
    const issueRes = await axios.get(`${baseJiraUrl}/rest/api/3/issue/${jiraId}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json'
      }
    });

    const issue = issueRes.data;
    if (!issue || !issue.fields) {
      throw new Error('Jira API returned an invalid response (missing fields). Verify the Jira ID and credentials.');
    }

    const summary = issue.fields.summary || '';
    const description = issue.fields.description || '';
    const attachments = issue.fields.attachment || [];

    let attachmentContent = '';

    // 2. Fetch Attachment Content if available
    if (attachments.length > 0) {
      const attachment = attachments[0];
      const attachmentUrl = attachment.content;
      const filename = attachment.filename || '';

      try {
        if (filename.toLowerCase().endsWith('.docx')) {
          const attachRes = await axios.get(attachmentUrl, {
            headers: { Authorization: `Basic ${auth}` },
            responseType: 'arraybuffer'
          });
          const result = await mammoth.extractRawText({ buffer: attachRes.data });
          attachmentContent = result.value;
        } else {
          const attachRes = await axios.get(attachmentUrl, {
            headers: { Authorization: `Basic ${auth}` },
            responseType: 'text'
          });
          attachmentContent = attachRes.data;
        }
      } catch (e) {
        console.error('Error fetching attachment:', e);
        attachmentContent = '[Could not extract attachment text.]';
      }
    }

    // 3. Generate Scenarios with Groq
    const groq = new Groq({ apiKey: groqKey });
    
    const promptContext = `
Jira Ticket: ${jiraId}
Summary: ${summary}
Description: ${JSON.stringify(description)}

Attachment Document Content:
${attachmentContent}

Based on the above context, generate a comprehensive Test Strategy and Scenario document.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a 15-year veteran automation engineer. Provide a detailed, professional test strategy and test scenarios based on the user\'s Jira context. Format the output in clean Markdown.'
        },
        {
          role: 'user',
          content: promptContext
        }
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const scenarios = chatCompletion.choices[0]?.message?.content || 'No scenarios generated.';

    return NextResponse.json({ success: true, scenarios });

  } catch (error: any) {
    console.error('API Route Error:', error.response?.data || error.message);
    return NextResponse.json({ 
      error: error.response?.data?.errorMessages?.[0] || error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
