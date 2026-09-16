const fs = require('fs');
const path = require('path');
const source = fs.readFileSync('source.html', 'utf8');

function extractTag(html, tag, predicate = () => true) {
  const openRe = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
  let m;
  while ((m = openRe.exec(html))) {
    if (!predicate(m[0])) continue;
    const start = m.index;
    const tokenRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
    tokenRe.lastIndex = openRe.lastIndex;
    let depth = 1, t;
    while ((t = tokenRe.exec(html))) {
      if (t[0].startsWith('</')) depth--;
      else if (!t[0].endsWith('/>')) depth++;
      if (depth === 0) return html.slice(start, tokenRe.lastIndex);
    }
  }
  return '';
}
function topLevelSections(body) {
  const out = [];
  const tokenRe = /<\\/?section\\b[^>]*>/gi;
  let depth = 0, start = -1, t;
  while ((t = tokenRe.exec(body))) {
    if (!t[0].startsWith('</')) {
      if (depth === 0) start = t.index;
      depth++;
    } else {
      depth--;
      if (depth === 0 && start >= 0) {
        const html = body.slice(start, tokenRe.lastIndex);
        const id = (html.match(/<section\\b[^>]*\\bid=["']([^"']+)["']/i) || [])[1] || '';
        out.push({ id, html });
        start = -1;
      }
    }
  }
  return out;
}
function replaceNav(html, links) {
  return html.replace(/<nav\\b([^>]*class=["'][^"']*navlinks[^"']*["'][^>]*)>[\\s\\S]*?<\\/nav>/i,
    (_, attrs) => `<nav${attrs}>${links.map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}</nav>`);
}
function replaceMobileNav(html, links) {
  return html.replace(/<nav\\b([^>]*id=["']appNav["'][^>]*)>[\\s\\S]*?<\\/nav>/i,
    (_, attrs) => `<nav${attrs}>${links.map(([href, icon, text]) => `<a href="${href}"><span class="app-nav-icon">${icon}</span><span>${text}</span></a>`).join('')}</nav>`);
}
const head = (source.match(/<head>[\\s\\S]*?<\\/head>/i) || ['<head></head>'])[0];
const body = (source.match(/<body[^>]*>([\\s\\S]*?)<\\/body>/i) || ['', ''])[1];
const header = extractTag(body, 'header');
const footer = extractTag(body, 'footer');
const mobileNav = extractTag(body, 'nav', tag => /\\bid=["']appNav["']/i.test(tag));
const scripts = [...body.matchAll(/<script\\b[^>]*>[\\s\\S]*?<\\/script>/gi)].map(m => m[0]).join('\\n');
const sections = topLevelSections(body);
const byId = id => sections.find(x => x.id === id)?.html || '';
const reviews = sections.filter(x => /^review0[1-8]$/.test(x.id)).map(x => x.html).join('');
const hero = (sections.find(x => !x.id && /class=["'][^"']*\\bhero\\b/i.test(x.html))?.html || '')
  .replace(/href=["']#percorso["']/g, 'href="/impara/"')
  .replace(/href=["']#strumenti["']/g, 'href="/simulatore/"')
  .replace(/href=["']#inizio["']/g, 'href="/impara/"');
const platform = sections.find(x => !x.id && /class=["'][^"']*\\bplatform-strip\\b/i.test(x.html))?.html || '';
const studyTeaser = `<section class="section" id="studio-intro"><div class="wrap"><div class="eyebrow">01 — PERCORSO DI STUDIO</div><h2>Impara un concetto alla volta.</h2><p class="lead">Otto capitoli progressivi, 93 lezioni, esempi semplici, quiz e fonti istituzionali. Il percorso completo è raccolto in una pagina dedicata, così la homepage rimane essenziale.</p><a class="btn primary" href="/impara/">Inizia a studiare →</a></div></section>`;
const simTeaser = `<section class="section" id="simula-intro"><div class="wrap"><div class="eyebrow">02 — SIMULA</div><h2>Metti i concetti nei numeri.</h2><p class="lead">Un simulatore semplice per esplorare, in uno scenario ipotetico, come capitale, versamenti, tempo, rendimento e inflazione possono influenzare un risultato.</p><div class="sim-intro"><strong>Vuoi provare?</strong><p>Apri il simulatore dedicato e costruisci il tuo scenario.</p></div><a class="btn primary" href="/simulatore/">Apri il simulatore →</a></div></section>`;

const glossaryAddon = `<style>
.glossary-shell{margin-top:34px}.glossary-tools{display:flex;gap:18px;align-items:end;margin-top:28px;padding:18px;background:#0d0d0b;border:1px solid var(--line)}.glossary-search{flex:1}.glossary-search label{display:block;font-size:10px;letter-spacing:.14em;color:var(--gold);font-weight:800;margin-bottom:7px}.glossary-search input{width:100%;background:#11110f;border:1px solid #3a3832;color:var(--white);padding:12px 14px;font:inherit;border-radius:2px;outline:none}.glossary-search input:focus{border-color:#6a6458}.glossary-search span{display:block;font-size:11px;color:#77736b;margin-top:7px}.glossary-index{display:flex;gap:5px;flex-wrap:wrap;max-width:390px}.glossary-letter{border:1px solid #302f2b;background:transparent;color:#aaa69d;width:29px;height:29px;cursor:pointer;font-size:11px}.glossary-letter:hover,.glossary-letter.active{border-color:var(--gold);color:var(--white)}.glossary-list{display:grid;gap:7px;margin-top:18px}.glossary-item{background:#0d0d0b;border:1px solid var(--line)}.glossary-term{width:100%;border:0;background:transparent;color:var(--white);padding:15px 17px;display:flex;justify-content:space-between;gap:16px;text-align:left;cursor:pointer;font:normal 18px Georgia,serif}.glossary-term span:last-child{color:var(--gold);font-family:Inter,ui-sans-serif,system-ui;font-size:16px}.glossary-definition{display:none;padding:0 17px 17px;color:#aaa69d;font-size:13px;line-height:1.6}.glossary-item.open .glossary-definition{display:block}.glossary-source{display:inline-block;margin-top:10px;color:var(--gold);font-size:11px;text-decoration:none}.glossary-empty{padding:24px;border:1px dashed #403d35;color:#88847c;text-align:center}@media(max-width:650px){.glossary-tools{display:block}.glossary-index{max-width:none;margin-top:14px}.glossary-term{font-size:16px}}
</style><section class="section glossary-shell" id="glossario"><div class="wrap"><div class="eyebrow">GLOSSARIO</div><h2>Le parole della finanza.</h2><p class="lead">Un riferimento rapido per trovare il significato dei principali termini incontrati nel percorso. Cerca una parola e apri la definizione.</p><div class="glossary-tools"><div class="glossary-search"><label for="glossarySearch">CERCA NEL GLOSSARIO</label><input id="glossarySearch" type="search" placeholder="Es. inflazione, ETF, rischio, dividendo…"/><span id="glossaryCount">0 termini</span></div><div class="glossary-index" id="glossaryIndex" aria-label="Indice alfabetico"></div></div><div class="glossary-list" id="glossaryList"></div></div></section><script>(function(){const list=document.querySelector('#glossaryList'),search=document.querySelector('#glossarySearch'),count=document.querySelector('#glossaryCount'),index=document.querySelector('#glossaryIndex');if(!list)return;const items=[...document.querySelectorAll('.topic-detail')].map(d=>{const h=d.querySelector('h4');if(!h)return null;const term=h.textContent.trim();const p=[...d.querySelectorAll('h5')].find(x=>x.textContent.trim().toLowerCase()==='in parole semplici');const def=p?.nextElementSibling?.textContent.trim()||'';return{term,def,id:d.id}}).filter(Boolean).filter((x,i,a)=>a.findIndex(y=>y.term.toLowerCase()===x.term.toLowerCase())===i).sort((a,b)=>a.term.localeCompare(b.term,'it'));const letters=[...new Set(items.map(x=>x.term.charAt(0).toUpperCase()))].sort((a,b)=>a.localeCompare(b,'it'));index.innerHTML=letters.map(l=>`<button class="glossary-letter" type="button" data-letter="${l}">${l}</button>`).join('');let activeLetter='';function render(){const q=(search?.value||'').trim().toLocaleLowerCase('it-IT');const filtered=items.filter(x=>{const okQ=!q||x.term.toLocaleLowerCase('it-IT').includes(q)||x.def.toLocaleLowerCase('it-IT').includes(q);const okL=!activeLetter||x.term.charAt(0).toUpperCase()===activeLetter;return okQ&&okL});count.textContent=`${filtered.length} ${filtered.length===1?'termine':'termini'}`;list.innerHTML=filtered.length?filtered.map(x=>`<article class="glossary-item"><button class="glossary-term" type="button" aria-expanded="false"><span>${x.term}</span><span>+</span></button><div class="glossary-definition">${x.def}<a class="glossary-source" href="#${x.id}">Apri la lezione →</a></div></article>`).join(''):'<div class="glossary-empty">Nessun termine trovato.</div>';list.querySelectorAll('.glossary-term').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.parentElement;const open=item.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));btn.querySelector('span:last-child').textContent=open?'−':'+';}));list.querySelectorAll('.glossary-source').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const id=a.getAttribute('href').slice(1);const topic=document.querySelector('#'+id);const panel=topic?.closest('.chapter-panel');const card=document.querySelector(`[data-chapter="${panel?.id}"]`);if(card)card.click();setTimeout(()=>topic?.scrollIntoView({behavior:'smooth',block:'start'}),80)}));}index.querySelectorAll('.glossary-letter').forEach(btn=>btn.addEventListener('click',()=>{const l=btn.dataset.letter;activeLetter=activeLetter===l?'':l;index.querySelectorAll('.glossary-letter').forEach(b=>b.classList.toggle('active',b.dataset.letter===activeLetter));render()}));search?.addEventListener('input',()=>{activeLetter='';index.querySelectorAll('.glossary-letter').forEach(b=>b.classList.remove('active'));render()});render()})();</script>`;

function shell(title, kind, content, mobileLinks) {
  let h = header;
  if (kind === 'home') h = replaceNav(h, [['#top','Home'],['/impara/','Impara'],['/simulatore/','Simula'],['#importante','Metodo']]);
  if (kind === 'impara') h = replaceNav(h, [['/','Home'],['#inizio','Inizia'],['#percorso','Percorso'],['/simulatore/','Simula'],['/#importante','Metodo']]);
  if (kind === 'sim') h = replaceNav(h, [['/','Home'],['/impara/','Impara'],['#simulatore','Simula'],['/#importante','Metodo']]);
  if (kind !== 'home') h = h.replace(/<a class="brand" href="#top">/i, '<a class="brand" href="/">');
  const m = replaceMobileNav(mobileNav, mobileLinks);
  const safeHead = head.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  return `<!DOCTYPE html>\n<html lang="it">${safeHead}<body>\n${h}\n<main>${content}</main>\n${footer}\n${scripts}\n${m}\n</body></html>`;
}
fs.mkdirSync('impara', { recursive: true });
fs.mkdirSync('simulatore', { recursive: true });
fs.writeFileSync('index.html', shell('FINLAB — Educazione finanziaria', 'home', `${hero}${platform}${studyTeaser}${simTeaser}${byId('importante')}`, [['/','⌂','Home'],['/impara/','▦','Impara'],['/simulatore/','◌','Simula'],['#importante','◎','Metodo']]));
fs.writeFileSync(path.join('impara','index.html'), shell('FINLAB — Impara', 'impara', `${byId('inizio')}${byId('percorso')}${reviews}${glossaryAddon}`, [['/','⌂','Home'],['#percorso','▦','Impara'],['/simulatore/','◌','Simula'],['#lessonSearch','⌕','Cerca']]));
fs.writeFileSync(path.join('simulatore','index.html'), shell('FINLAB — Simulatore', 'sim', byId('strumenti').replace(/id=["']strumenti["']/i, 'id="simulatore"'), [['/','⌂','Home'],['/impara/','▦','Impara'],['#simulatore','◌','Simula'],['/impara/#lessonSearch','⌕','Cerca']]));
console.log('FINLAB: built compact home, /impara/ with glossary, and /simulatore/.');
