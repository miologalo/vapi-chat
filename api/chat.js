export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }
  const body = req.body || {};
  const apiKey = body.apiKey;
  const model = body.model || "venice/deepseek-v4-flash";
  const messages = body.messages;
  const baseUrl = (body.baseUrl || "https://router.vapinetwork.ai/v1").replace(/\/+$/, "");

  if (!apiKey || typeof apiKey !== "string") {
    return res.status(400).json({ error: "API key missing — set your vAPI router key first." });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "No messages to send." });
  }

  try {
    const r = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages }),
      signal: AbortSignal.timeout(60000),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const msg = data?.error?.message || data?.error || `Router returned HTTP ${r.status}`;
      return res.status(r.status).json({ error: String(msg).slice(0, 300), status: r.status });
    }
    const content = data?.choices?.[0]?.message?.content || "";
    return res.status(200).json({ content, usage: data?.usage || null, model: data?.model || model });
  } catch (e) {
    return res.status(502).json({ error: "Router unreachable: " + String(e).slice(0, 120) });
  }
}
