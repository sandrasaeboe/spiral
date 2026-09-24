// Serverless function on Vercel: keeps the Groq API key on the server.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const text = typeof req.body?.text === 'string' ? req.body.text.trim().slice(0, 2000) : '';
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const key = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;
  if (!key) return res.status(500).json({ error: 'Server is missing GROQ_API_KEY' });

  const prompt = `You are a CBT therapist. Analyse the following thought and respond ONLY with a JSON object, no explanations, no backticks.
Thought: "${text}"
Respond with exactly this format:
{"trap_label":"name of the cognitive distortion, choose ONE of: Catastrophising, Mind reading, Black and white thinking, Overgeneralisation, Emotional reasoning, Personalisation, Mental filter, Should statements","trap_icon":"one emoji","description":"2-3 sentences objectively explaining what is happening","reframe":"2-3 sentences with an objective reframe","second_trap":"secondary distortion or null","exercise_text":"a concrete CBT exercise in 3-4 sentences"}`;

  try {
    const groq = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model: 'openai/gpt-oss-120b', reasoning_effort: 'low', response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'Respond ONLY with JSON.' }, { role: 'user', content: prompt }], temperature: 0.4, max_tokens: 800 })
    });
    if (!groq.ok) {
      console.error('Groq error', groq.status, await groq.text());
      return res.status(502).json({ error: 'AI service error' });
    }
    const data = await groq.json();
    const raw = data.choices?.[0]?.message?.content || '';
    return res.status(200).json(JSON.parse(raw.replace(/```json|```/g, '').trim()));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Analysis failed' });
  }
}
