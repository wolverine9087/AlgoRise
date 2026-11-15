const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function groqJSON({ system, prompt, temperature = 0.3, maxCompletionTokens = 4096 }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw Object.assign(new Error("GROQ_API_KEY is not configured"), { statusCode: 503 });

  const response = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    signal: AbortSignal.timeout(60_000),
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      temperature,
      max_completion_tokens: maxCompletionTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error?.message || `Groq request failed (${response.status})`;
    throw Object.assign(new Error(message), { statusCode: response.status === 429 ? 429 : 502 });
  }

  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw Object.assign(new Error("Groq returned an empty response"), { statusCode: 502 });
  try {
    return JSON.parse(content);
  } catch {
    throw Object.assign(new Error("Groq returned invalid JSON"), { statusCode: 502 });
  }
}
