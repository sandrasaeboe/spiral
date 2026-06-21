const KEY = process.env.REACT_APP_GROQ_API_KEY;


export async function analyzeThought(text) {
  const prompt = `Du är en KBT-terapeut. Analysera följande tanke och svara ENDAST med ett JSON-objekt, inga förklaringar, inga backticks.

Tanke: "${text}"

Svara med exakt detta format:
{"trap_label":"namn på tankefällan på svenska, välj EN av: Katastrofiering, Tankeläsning, Svartvitt tänkande, Övergeneralisering, Känslomässigt resonerande, Personalisering, Filtrerande, Bör-tänkande","trap_icon":"ett emoji","description":"2-3 meningar som objektivt förklarar vad som händer","reframe":"2-3 meningar med en objektiv omramning","second_trap":"sekundär tankefälla eller null","exercise_text":"en konkret KBT-övning på 3-4 meningar"}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${KEY}` },
    body:JSON.stringify({ model:'llama-3.3-70b-versatile', messages:[{role:'system',content:'Svara ENDAST med JSON.'},{role:'user',content:prompt}], temperature:0.4, max_tokens:800 })
  });
  if (!res.ok) throw new Error('API fel');
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '';
  return JSON.parse(raw.replace(/```json|```/g,'').trim());
}
