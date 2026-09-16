const OFFICIAL_DOMAINS = [
  'bancaditalia.it',
  'economiapertutti.bancaditalia.it',
  'consob.it',
  'esma.europa.eu',
  'ecb.europa.eu'
];

const SYSTEM_PROMPT = `Sei FINLAB AI, il tutor di educazione finanziaria della piattaforma FINLAB.

FILOSOFIA:
- FINLAB educa, non fa consulenza finanziaria e non dice all'utente cosa comprare, vendere o detenere.
- Il tuo compito è aiutare l'utente a capire i concetti e a ragionare in autonomia.
- Non trasformare una spiegazione educativa in una raccomandazione personalizzata.

FONTI:
- Per le domande finanziarie devi basare le informazioni fattuali sulle fonti ufficiali consultate tramite la ricerca web.
- Le fonti ammesse sono esclusivamente: Banca d'Italia / Economia per tutti, CONSOB, ESMA ed ECB.
- Se una domanda riguarda un concetto presente nei capitoli FINLAB, usa anche il contesto FINLAB fornito dall'applicazione, ma verifica i fatti tramite le fonti ufficiali quando la domanda è sostanziale.
- Non usare blog, forum, social, siti commerciali o fonti non istituzionali.
- Se le fonti ufficiali disponibili non sono sufficienti per rispondere con sicurezza, dichiaralo invece di inventare.
- Distingui sempre fatti, esempi ipotetici e interpretazioni.

STILE:
- Rispondi in italiano salvo richiesta diversa.
- Sii chiaro, didattico e proporzionato alla domanda.
- Parti da una spiegazione semplice; aggiungi dettagli solo se utili.
- Quando possibile usa un esempio concreto.
- Non promettere rendimenti e non prevedere con certezza i mercati.
- Alla fine, quando utile, suggerisci una domanda di approfondimento, non un'azione di investimento.

SCOPO DELLA V0.5:
Sei un AI Tutor. Non hai ancora le funzioni di analisi del portafoglio, simulatore collegato, Goal Planner, Emergency Fund Planner, Strategy Lab o News Explainer. Non fingere di averle.`;

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.end(JSON.stringify(body));
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-10)
    .map(m => ({ role: m.role, content: m.content.slice(0, 5000) }));
}

function addSource(sources, url, title) {
  if (!url) return;
  let domain = '';
  try { domain = new URL(url).hostname.replace(/^www\./, ''); } catch { return; }
  if (!OFFICIAL_DOMAINS.some(d => domain === d || domain.endsWith(`.${d}`))) return;
  if (!sources.some(s => s.url === url)) sources.push({ title: title || domain, url });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Metodo non consentito.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json(res, 503, {
      error: 'FINLAB AI non è ancora configurata. Aggiungi OPENAI_API_KEY nelle variabili d’ambiente di Vercel.'
    });
  }

  const body = req.body || {};
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) return json(res, 400, { error: 'Scrivi una domanda prima di inviare.' });
  if (message.length > 4000) return json(res, 400, { error: 'La domanda è troppo lunga. Riducila a 4.000 caratteri.' });

  const history = cleanHistory(body.history);
  const context = typeof body.context === 'string' ? body.context.slice(0, 6000) : '';
  const input = [
    ...history,
    {
      role: 'user',
      content: context
        ? `Contesto FINLAB rilevante:\n${context}\n\nDomanda dell'utente:\n${message}`
        : message
    }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.FINLAB_AI_MODEL || 'gpt-5.6-luna',
        instructions: SYSTEM_PROMPT,
        input,
        tools: [{ type: 'web_search', filters: { allowed_domains: OFFICIAL_DOMAINS } }],
        tool_choice: 'auto',
        include: ['web_search_call.action.sources'],
        max_output_tokens: 1200
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('OpenAI Responses API error:', data);
      return json(res, 502, { error: 'Non riesco a ottenere una risposta in questo momento. Riprova tra poco.' });
    }

    const text = typeof data.output_text === 'string' ? data.output_text.trim() : '';
    if (!text) return json(res, 502, { error: 'La risposta dell’AI è vuota. Riprova.' });

    const sources = [];
    for (const item of Array.isArray(data.output) ? data.output : []) {
      if (item.type === 'web_search_call') {
        const action = item.action;
        for (const source of Array.isArray(action?.sources) ? action.sources : []) {
          addSource(sources, source.url, source.title);
        }
      }
      for (const content of Array.isArray(item.content) ? item.content : []) {
        for (const annotation of Array.isArray(content.annotations) ? content.annotations : []) {
          if (annotation.type === 'url_citation') addSource(sources, annotation.url, annotation.title);
        }
      }
    }

    return json(res, 200, { answer: text, sources: sources.slice(0, 5) });
  } catch (error) {
    console.error('FINLAB AI runtime error:', error);
    return json(res, 500, { error: 'Si è verificato un errore inatteso. Riprova tra poco.' });
  }
};
