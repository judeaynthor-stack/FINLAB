const fs = require('fs');
const path = require('path');

let source = fs.readFileSync('index.html', 'utf8');

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
const scripts = [...body.matchAll(/<script\\b[^>]*>[\\s\\S]*?<\\/script>/gi)].map(m => m[0]).join('\n');
const sections = topLevelSections(body);
const byId = id => sections.find(x => x.id === id)?.html || '';
const unid = sections.filter(x => !x.id);
const hero = (unid.find(x => /class=["'][^"']*\\bhero\\b/i.test(x.html))?.html || '')
  .replace(/href=["']#percorso["']/g, 'href="/impara/"')
  .replace(/href=["']#strumenti["']/g, 'href="/simulatore/"');
const platform = unid.find(x => /class=["'][^"']*\\bplatform-strip\\b/i.test(x.html))?.html || '';
const start = byId('inizio').replace(/href=["']#chapter/g, 'href="/impara/#chapter');
const glossaryMatches = sections.filter(x => x.id === 'glossario');
const glossary = glossaryMatches.length ? glossaryMatches[0].html : '';
const glossaryUX = `<style>#glossario .glossary-entry{display:none!important}#glossario .glossary-entry.glossary-show{display:block!important}#glossario #glossaryAlphabet{display:none}#glossario #glossaryAlphabet.glossary-show{display:flex}</style><script>(function(){const s=document.querySelector('#glossarySearch'),list=document.querySelector('#glossaryList'),alpha=document.querySelector('#glossaryAlphabet');if(!s||!list)return;function sync(){const q=s.value.trim();list.querySelectorAll('.glossary-entry').forEach(e=>e.classList.toggle('glossary-show',!!q&&!e.classList.contains('search-hidden')));alpha?.classList.toggle('glossary-show',!!q)}s.addEventListener('input',()=>setTimeout(sync,0));sync()})();</script>`;

const studyTeaser = `<section class="section" id="studio-intro"><div class="wrap"><div class="eyebrow">01 — PERCORSO DI STUDIO</div><h2>Impara un concetto alla volta.</h2><p class="lead">Otto capitoli progressivi, lezioni brevi, esempi semplici e fonti istituzionali. Il percorso completo vive in una pagina dedicata, così la homepage rimane essenziale.</p><a class="btn primary" href="/impara/">Inizia a studiare →</a></div></section>`;
const simTeaser = `<section class="section" id="simula-intro"><div class="wrap"><div class="eyebrow">02 — SIMULA</div><h2>Metti i concetti nei numeri.</h2><p class="lead">Un simulatore semplice per esplorare, in uno scenario ipotetico, come capitale, versamenti, tempo e rendimento possono influenzare un risultato.</p><div class="sim-intro"><strong>Vuoi provare?</strong><p>Apri il simulatore dedicato e costruisci il tuo scenario.</p></div><a class="btn primary" href="/simulatore/">Apri il simulatore →</a></div></section>`;

function shell(title, kind, content, mobileLinks) {
  let h = header;
  if (kind === 'home') h = replaceNav(h, [['#inizio','Inizia'],['/impara/','Percorso'],['/simulatore/','Simulatore'],['#glossario','Glossario'],['#importante','Metodo']]);
  if (kind === 'impara') h = replaceNav(h, [['/','Home'],['#inizio','Inizia'],['#percorso','Percorso'],['/simulatore/','Simulatore'],['/#glossario','Glossario'],['/#importante','Metodo']]);
  if (kind === 'sim') h = replaceNav(h, [['/','Home'],['/impara/','Impara'],['#simulatore','Simulatore'],['/#glossario','Glossario'],['/#importante','Metodo']]);
  if (kind !== 'home') h = h.replace(/<a class="brand" href="#top">/i, '<a class="brand" href="/">');
  const m = replaceMobileNav(mobileNav, mobileLinks);
  const safeHead = head.replace(/<title>[\\s\\S]*?<\\/title>/i, `<title>${title}</title>`);
  return `<!DOCTYPE html>\n<html lang="it">${safeHead}<body>\n${h}\n<main>${content}</main>\n${footer}\n${scripts}\n${m}\n</body></html>`;
}

fs.mkdirSync('impara', { recursive: true });
fs.mkdirSync('simulatore', { recursive: true });
fs.writeFileSync('index.html', shell('FINLAB — Educazione finanziaria', 'home', `${hero}${platform}${start}${studyTeaser}${glossary}${glossaryUX}${simTeaser}${byId('importante')}`, [['/','⌂','Home'],['/impara/','▦','Impara'],['/simulatore/','◌','Simula'],['#glossario','⌕','Cerca']]));
fs.writeFileSync(path.join('impara','index.html'), shell('FINLAB — Impara', 'impara', `${byId('inizio')}${byId('percorso')}`, [['/','⌂','Home'],['#percorso','▦','Impara'],['/simulatore/','◌','Simula'],['#lessonSearch','⌕','Cerca']]));
fs.writeFileSync(path.join('simulatore','index.html'), shell('FINLAB — Simulatore', 'sim', byId('strumenti').replace(/id=["']strumenti["']/i, 'id="simulatore"'), [['/','⌂','Home'],['/impara/','▦','Impara'],['#simulatore','◌','Simula'],['/#glossario','⌕','Cerca']]));
console.log('FINLAB: built home, /impara/ and /simulatore/.');
