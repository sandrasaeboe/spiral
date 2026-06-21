const KEY = process.env.REACT_APP_GROQ_API_KEY;

export async function analyzeThought(text) {
  const prompt = `You are a CBT therapist. Analyse the following thought and respond ONLY with a JSON object, no explanations, no backticks.
Thought: "${text}"
Respond with exactly this format:
{"trap_label":"name of the cognitive distortion, choose ONE of: Catastrophising, Mind reading, Black and white thinking, Overgeneralisation, Emotional reasoning, Personalisation, Mental filter, Should statements","trap_icon":"one emoji","description":"2-3 sentences objectively explaining what is happening","reframe":"2-3 sentences with an objective reframe","second_trap":"secondary distortion or null","exercise_text":"a concrete CBT exercise in 3-4 sentences"}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: 'Respond ONLY with JSON.' }, { role: 'user', content: prompt }], temperature: 0.4, max_tokens: 800 })
  });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '';
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}