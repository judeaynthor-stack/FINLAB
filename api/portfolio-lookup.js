export default async function handler(req, res) {
  const q = String(req.query?.q || '').trim();
  const token = process.env.EODHD_API_TOKEN;

  res.setHeader('Cache-Control','s-maxage=21600, stale-while-revalidate=86400');

  if (!token) {
    return res.status(503).json({
      ok:false,
      message:'Lookup automatico non configurato: manca EODHD_API_TOKEN.'
    });
  }
  if (q.length < 2) {
    return res.status(400).json({ok:false,message:'Inserisci almeno un ticker o ISIN.'});
  }

  const base='https://eodhd.com/api';
  const headers={'Accept':'application/json','User-Agent':'FINLAB Portfolio Analyzer'};

  try {
    const searchUrl = `${base}/search/${encodeURIComponent(q)}?api_token=${encodeURIComponent(token)}&fmt=json&limit=8&type=all`;
    const searchRes = await fetch(searchUrl,{headers});
    if(!searchRes.ok) throw new Error('Provider search error');
    const matches = await searchRes.json();
    if(!Array.isArray(matches)||!matches.length) {
      return res.status(404).json({ok:false,message:'Nessuno strumento trovato per questo ticker o ISIN.'});
    }

    const preferred = matches.find(x => x.isPrimary) || matches[0];
    const symbol = preferred.Code && preferred.Exchange ? `${preferred.Code}.${preferred.Exchange}` : preferred.Code;
    if(!symbol) throw new Error('Identificativo provider non disponibile');

    const fundUrl = `${base}/v1.1/fundamentals/${encodeURIComponent(symbol)}?api_token=${encodeURIComponent(token)}&fmt=json`;
    const fundRes = await fetch(fundUrl,{headers});
    const fundamentals = fundRes.ok ? await fundRes.json() : {};

    const general = fundamentals.General || {};
    const etf = fundamentals.ETF_Data || {};
    const highlights = fundamentals.Highlights || {};
    const splits = fundamentals.SplitsDividends || {};

    const rawType = String(general.Type || preferred.Type || '').toLowerCase();
    const category = rawType.includes('etf') ? 'ETF'
      : rawType.includes('common stock') || rawType.includes('stock') || rawType.includes('equity') ? 'Azione'
      : rawType.includes('fund') ? 'Fondo'
      : rawType.includes('crypto') ? 'Crypto'
      : (general.Type || preferred.Type || 'Altro');

    const sector = general.Sector || general.GicSector || '';
    let dividendYield = null;
    if (category === 'ETF') dividendYield = Number(etf.Yield);
    else dividendYield = Number(highlights.DividendYield ?? splits.ForwardAnnualDividendYield);
    if (!Number.isFinite(dividendYield)) dividendYield = null;
    if (dividendYield !== null && dividendYield < 1) dividendYield *= 100;

    let ter = null;
    if (category === 'ETF') {
      ter = Number(etf.Ongoing_Charge ?? etf.NetExpenseRatio);
      if (Number.isFinite(ter) && ter < 1) ter *= 100;
      if (!Number.isFinite(ter)) ter = null;
    }

    const geoMap = {};
    const addGeo = (name, weight) => {
      const w=Number(weight);
      if(!name || !Number.isFinite(w) || w<=0) return;
      geoMap[name]=(geoMap[name]||0)+w;
    };

    if (category === 'ETF') {
      const regions = etf.World_Regions || {};
      for (const [name,v] of Object.entries(regions)) {
        if (v && typeof v === 'object') addGeo(name, v.Equity_ ?? v.Equity ?? v.Net_Assets_ ?? v.Net_Assets);
      }

      const holdings = etf.Holdings || etf.Top_10_Holdings || {};
      if (holdings && typeof holdings === 'object') {
        for (const h of Object.values(holdings)) {
          if (!h || typeof h !== 'object') continue;
          addGeo(h.Country || h.Region, h.Assets_ ?? h.Weight ?? h.Equity_ ?? h.Net_Assets_);
        }
      }
    }

    if (!Object.keys(geoMap).length) {
      addGeo(general.CountryName || preferred.Country, 100);
    }

    const geography = Object.entries(geoMap)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,10)
      .map(([name,weight])=>({name,weight:Number(weight.toFixed(2))}));

    const instrument = {
      symbol,
      isin: general.ISIN || preferred.ISIN || '',
      name: general.Name || preferred.Name || symbol,
      category,
      sector: sector || 'Non disponibile',
      geography,
      ter,
      dividendYield
    };

    return res.status(200).json({ok:true,instrument});
  } catch (err) {
    return res.status(502).json({
      ok:false,
      message:'Il provider non ha restituito dati utilizzabili. Riprova con ticker o ISIN completo.'
    });
  }
}
