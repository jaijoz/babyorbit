const API_BASE = '/api';

function extractTextFromEvent(data) {
  const direct = data?.content?.parts?.[0]?.text;
  if (direct) return direct;

  const candidateText = data?.candidate?.content?.parts?.[0]?.text;
  if (candidateText) return candidateText;

  const chunkText = data?.partial_response?.content?.parts?.[0]?.text;
  if (chunkText) return chunkText;

  if (typeof data?.text === 'string' && data.text.trim()) return data.text;

  return '';
}

function parseSseBlock(block) {
  const dataLines = block
    .split('\n')
    .filter(line => line.startsWith('data:'))
    .map(line => line.replace(/^data:\s?/, ''));

  if (dataLines.length === 0) return null;

  const payload = dataLines.join('\n').trim();
  if (!payload || payload === '[DONE]') return null;

  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export async function createSession() {
  const res = await fetch(`${API_BASE}/apps/orbit_coordinator/users/user/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: {} })
  });
  if (res.status === 429) throw new Error('RATE_LIMIT');
  if (!res.ok) throw new Error(`Session error: ${res.status}`);
  return res.json();
}

/**
 * Send a message, optionally with file parts.
 * fileParts: array of ADK-compatible part objects, e.g.
 *   { inline_data: { mime_type: 'image/png', data: '<base64>' } }
 *   { text: '[File: report.txt]\n<content>' }
 */
export function sendMessage(sessionId, message, fileParts = [], onPartial, onComplete) {
  const url = `${API_BASE}/run_sse`;

  const parts = [];
  if (message) parts.push({ text: message });
  parts.push(...fileParts);

  const body = JSON.stringify({
    app_name: 'orbit_coordinator',
    user_id: 'user',
    session_id: sessionId,
    new_message: { role: 'user', parts }
  });

  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    .then(res => {
      if (res.status === 429) {
        onComplete('⚠️ I\'m a bit overwhelmed right now! The AI service is rate-limited. Please wait 30-60 seconds and try again. 🙏');
        return;
      }
      if (!res.ok) {
        onComplete('⚠️ Something went wrong. Please try again in a moment.');
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      function read() {
        reader.read().then(({ done, value }) => {
          if (done) {
            if (buffer.trim()) {
              const blocks = buffer.split('\n\n');
              for (const block of blocks) {
                const data = parseSseBlock(block);
                if (!data) continue;
                const text = extractTextFromEvent(data);
                if (text) { fullText += text; onPartial(fullText); }
              }
            }
            onComplete(fullText || 'No response received.');
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const blocks = buffer.split('\n\n');
          buffer = blocks.pop() || '';

          for (const block of blocks) {
            const data = parseSseBlock(block);
            if (!data) continue;
            const text = extractTextFromEvent(data);
            if (text) { fullText += text; onPartial(fullText); }
          }

          read();
        }).catch(() => {
          if (fullText) onComplete(fullText);
          else onComplete('⚠️ Connection lost. The AI service may be busy. Please wait a moment and try again.');
        });
      }
      read();
    })
    .catch(err => {
      if (err.message === 'RATE_LIMIT') {
        onComplete('⚠️ I\'m a bit overwhelmed right now! The AI service is rate-limited. Please wait 30-60 seconds and try again. 🙏');
      } else {
        onComplete('⚠️ Could not connect to BabyOrbit. Please check your connection and try again.');
      }
    });
}
