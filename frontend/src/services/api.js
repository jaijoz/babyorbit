const API_BASE = '/api';

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

export function sendMessage(sessionId, message, onPartial, onComplete) {
  const url = `${API_BASE}/run_sse`;
  const body = JSON.stringify({
    app_name: 'orbit_coordinator',
    user_id: 'user',
    session_id: sessionId,
    new_message: { role: 'user', parts: [{ text: message }] }
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

      function read() {
        reader.read().then(({ done, value }) => {
          if (done) { onComplete(fullText || 'No response received.'); return; }
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                const text = data?.content?.parts?.[0]?.text;
                if (text) { fullText += text; onPartial(fullText); }
              } catch {}
            }
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
