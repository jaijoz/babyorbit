const API_BASE = '/api';
const APP_NAME = 'orbit_coordinator';
const USER_ID = 'user';

export async function createSession() {
  const res = await fetch(`${API_BASE}/apps/${APP_NAME}/users/${USER_ID}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  return res.json();
}

export async function sendMessage(sessionId, message, onChunk, onDone) {
  const res = await fetch(`${API_BASE}/run_sse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_name: APP_NAME,
      user_id: USER_ID,
      session_id: sessionId,
      new_message: { role: 'user', parts: [{ text: message }] },
      streaming: false
    })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.content && data.content.parts) {
            for (const part of data.content.parts) {
              if (part.text) {
                fullText += part.text;
                onChunk(fullText);
              }
            }
          }
        } catch (e) {}
      }
    }
  }
  onDone(fullText);
}
