const fs=require('fs'),path=require('path');
const source=fs.readFileSync('source.html','utf8');
function tag(html,name,pred=()=>true){const re=new RegExp('<'+name+'\\b[^>]*>','gi');let m;while(m=re.exec(html)){if(!pred(m[0]))continue;const start=m.index,t=new RegExp('<\\/?'+name+'\\b[^>]*>','gi');t.lastIndex=re.lastIndex;let d=1,x;while(x=t.exec(html)){if(x[0].startsWith('</'))d--;else if(!x[0].endsWith('/>'))d++;if(!d)return html.slice(start,t.lastIndex)}}return ''}
function sections(body){const out=[],re=/<\/?section\b[^>]*>/gi;let d=0,s=-1,m;while(m=re.exec(body)){if(!m[0].startsWith('</')){if(!d)s=m.index;d++}else{d--;if(!d&&s>=0){const html=body.slice(s,re.lastIndex);const idMatch=html.match(/<section\b[^>]*\bid=[\"']([^\"']+)[\"']/i);const id=idMatch?idMatch[1]:'';out.push({id,html});s=-1}}}return out}
const head=(source.match(/<head>[\s\S]*?<\/head>/i)||['<head></head>'])[0];
const body=(source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)||['',''])[1];
const header=tag(body,'header'),footer=tag(body,'footer');
const mobile=tag(body,'nav',x=>/\bid=[\"']appNav[\"']/i.test(x));
const scripts=[...body.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map(x=>x[0]).join('\n');
const sec=sections(body),get=id=>sec.find(x=>x.id===id)?.html||'';

const affiliateBooks={
  chapter1:{title:'La psicologia dei soldi',author:'Morgan Housel',url:'https://link.amazon/B01TY8a5b'},
  chapter2:{title:'A spasso per Wall Street',author:'Burton G. Malkiel',url:'https://link.amazon/B04l9nyoa'},
  chapter3:{title:"Il piccolo libro dell'investimento",author:'John C. Bogle',url:'https://link.amazon/B0fCsGSDB'},
  chapter4:{title:'One Up On Wall Street',author:'Peter Lynch',url:'https://link.amazon/B08ZQsG2t'},
  chapter5:{title:'The Bond Book',author:'Annette Thau',url:'https://link.amazon/B0gBrhOvd'},
  chapter6:{title:'The Intelligent Asset Allocator',author:'William J. Bernstein',url:'https://link.amazon/B0fscUa4i'},
  chapter7:{title:'Pensieri lenti e veloci',author:'Daniel Kahneman',url:'https://link.amazon/B08SG2TDp'},
  chapter8:{title:'The Bitcoin Standard',author:'Saifedean Ammous',url:'https://link.amazon/B0eUQ9Oo8'},
  chapter9:{title:'The Little Book of Common Sense Investing',author:'John C. Bogle',url:'https://link.amazon/B0dI052Cc'},
  chapter10:{title:'The Four Pillars of Investing',author:'William J. Bernstein',url:'https://link.amazon/B01AdWZ8I'},
  chapter12:{title:"L'investitore intelligente",author:'Benjamin Graham',url:'https://link.amazon/B03Xum5Mg'},
  chapter13:{title:'Valuation',author:'McKinsey & Company',url:'https://link.amazon/B02WSXFvt'},
  chapter16:{title:'The Most Important Thing',author:'Howard Marks',url:'https://link.amazon/B0aYgbg8i'},
  chapter17:{title:'Currency Trading for Dummies',author:'Kathleen Brooks & Brian Dolan',url:'https://link.amazon/B04MvsHNv'},
  chapter19:{title:'The Little Book of Behavioral Investing',author:'James Montier',url:'https://link.amazon/B06xpL9vU'}
};

const affiliateCss=`<style id="finlab-affiliate-books">
.affiliate-book{margin-top:34px;padding:24px 26px;border:1px solid rgba(208,180,119,.20);border-radius:20px;background:linear-gradient(145deg,rgba(208,180,119,.055),rgba(255,255,255,.018));box-shadow:0 16px 42px rgba(0,0,0,.20)}
.affiliate-book .affiliate-eyebrow{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#d0b477;font-weight:700;margin-bottom:8px}
.affiliate-book h4{margin:0 0 7px;font:normal 25px Georgia,serif;color:#f0ede5}
.affiliate-book .affiliate-author{margin:0 0 10px;color:#aaa69d;font-size:12px}
.affiliate-book .affiliate-copy{margin:0 0 17px;color:#918d84;font-size:12px;line-height:1.6}
.affiliate-book .affiliate-link{display:inline-flex;align-items:center;gap:7px;padding:10px 14px;border:1px solid rgba(208,180,119,.35);border-radius:10px;color:#d0b477;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:.02em;background:rgba(208,180,119,.045)}
.affiliate-book .affiliate-link:hover{border-color:#d0b477;background:rgba(208,180,119,.09);color:#f0ede5}
.affiliate-book .affiliate-disclosure{margin:12px 0 0;color:#66625b;font-size:9px;line-height:1.5}
@media(max-width:650px){.affiliate-book{padding:20px;margin-top:26px}.affiliate-book h4{font-size:22px}.affiliate-book .affiliate-link{width:100%;justify-content:center}}
</style>`;

function chapterDivs(html){
  const out=[],re=/<\/?div\b[^>]*>/gi; let m,depth=0,starts=[];
  while(m=re.exec(html)){
    const token=m[0];
    if(!token.startsWith('</')){
      if(/class=["'][^"']*\\bchapter-panel\b/i.test(token)) starts.push({start:m.index,depth});
      depth++;
    }else{
      depth--;
      const last=starts[starts.length-1];
      if(last&&depth===last.depth){out.push({start:last.start,end:re.lastIndex,id:(html.slice(last.start,m.index).match(/id=["'](chapter\d+)["']/i)||[])[1]||''});starts.pop()}
    }
  }
  return out;
}

function addAffiliateBooks(html){
  const panels=chapterDivs(html);
  let out=html;
  for(let i=panels.length-1;i>=0;i--){
    const p=panels[i],book=affiliateBooks[p.id];
    if(!book) continue;
    const card=`<aside class="affiliate-book" aria-label="Approfondimento consigliato">
      <div class="affiliate-eyebrow">📚 PER CONTINUARE A STUDIARE</div>
      <h4>${book.title}</h4>
      <p class="affiliate-author">Autore: ${book.author}</p>
      <p class="affiliate-copy">Un approfondimento selezionato da FINLAB per questo capitolo.</p>
      <a class="affiliate-link" href="${book.url}" target="_blank" rel="noopener sponsored nofollow">Scopri il libro su Amazon →</a>
      <p class="affiliate-disclosure">Link affiliato: FINLAB potrebbe ricevere una commissione dagli acquisti effettuati tramite questo link, senza costi aggiuntivi per te.</p>
    </aside>`;
    const before=out.slice(0,p.end), after=out.slice(p.end);
    const close=before.lastIndexOf('</div>');
    if(close>=0) out=before.slice(0,close)+card+before.slice(close)+after;
  }
  return out;
}

const hero=(sec.find(x=>!x.id&&/class=[\"'][^\"']*\bhero\b/i.test(x.html))?.html||'')
.replace(/href=[\"']#percorso[\"']/g,'href=\"/impara/\"')
.replace(/href=[\"']#strumenti[\"']/g,'href=\"/strumenti/\"')
.replace(/href=[\"']#inizio[\"']/g,'href=\"/impara/\"')
.replace(/Apri il simulatore/gi,'Apri gli strumenti');
const platform=sec.find(x=>!x.id&&/class=[\"'][^\"']*\bplatform-strip\b/i.test(x.html))?.html||'';
const tools='<div class=\"nav-dropdown\"><button class=\"nav-dropdown-toggle\" type=\"button\" aria-expanded=\"false\">Strumenti <span>⌄</span></button><div class=\"nav-dropdown-menu\"><a href=\"/strumenti/interesse-composto/\">Interesse composto</a><a href=\"/strumenti/emergency-fund/\">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href=\"/strumenti/strategy-lab/\">Strategy Lab</a></div></div>';
const css=affiliateCss+'<style id=\"finlab-builder-nav\">.nav{background:rgba(6,6,5,.96);border-bottom:1px solid #3a3730;box-shadow:0 8px 30px rgba(0,0,0,.3);position:relative;z-index:20}.navlinks{gap:30px;align-items:center}.navlinks>a,.nav-dropdown{display:inline-flex;align-items:center}.nav-dropdown-toggle{display:inline-flex;align-items:center;gap:7px;line-height:1;min-height:28px}.nav-dropdown{position:relative;display:inline-flex}.nav-dropdown-menu{display:none;position:absolute;right:0;top:calc(100% + 2px);width:260px;background:#10100e;border:1px solid #3a3832;border-radius:14px;box-shadow:0 20px 50px rgba(0,0,0,.45);padding:7px;z-index:1000}.nav-dropdown.open .nav-dropdown-menu,.nav-dropdown:hover .nav-dropdown-menu{display:block}.nav-dropdown-menu a,.nav-dropdown-menu span{display:block;padding:12px 13px;color:#aaa69d;font-size:13px;border-bottom:1px solid #24231f;border-radius:9px}.nav-dropdown-menu a:hover{color:#fff;background:#181714}.nav-dropdown-menu span:last-child{border:0;color:#68645d}.nav-dropdown-menu small{float:right;color:#4f4b45;font-size:9px;text-transform:uppercase}.mobile-tools-panel{display:none}#inizio .badge{margin-bottom:14px}#inizio h2{margin-top:0;margin-bottom:22px}#inizio .start-grid{margin-top:28px}@media(max-width:1050px){.navlinks{gap:28px}}@media(max-width:650px){.nav{background:rgba(5,5,4,.98);box-shadow:0 10px 28px rgba(0,0,0,.3)}.navlinks{gap:22px;align-items:center}.nav-dropdown:hover .nav-dropdown-menu{display:none}#appNav{grid-template-columns:repeat(4,1fr)!important;left:8px!important;right:8px!important;bottom:8px!important;background:#090908f7!important;border:1px solid #403c34!important;border-radius:22px!important;box-shadow:0 18px 55px rgba(0,0,0,.7)!important;padding:6px!important}.mobile-tools-panel{position:fixed;left:12px;right:12px;bottom:84px;z-index:1100;background:#0c0c0b;border:1px solid #3a3832;box-shadow:0 20px 50px rgba(0,0,0,.65);padding:7px;border-radius:18px}.mobile-tools-panel.open{display:block}.mobile-tools-panel a,.mobile-tools-panel span{display:block;padding:13px;color:#aaa69d;font-size:12px;border-bottom:1px solid #24231f}.mobile-tools-panel span{color:#68645d}.mobile-tools-panel small{float:right;color:#4f4b45;font-size:9px;text-transform:uppercase}.app-tools-trigger{border:0!important;background:transparent!important;color:#aaa69d!important;font:9px Inter!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;padding:4px 1px!important;cursor:pointer;width:25%!important;min-width:25%!important;max-width:25%!important;height:72px!important;min-height:72px!important;border-radius:16px!important;box-sizing:border-box!important;position:absolute!important;left:50%!important;top:4px!important;bottom:4px!important}.app-tools-trigger:active{background:#151512!important}.app-tools-trigger .app-nav-icon{display:flex!important;width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;flex:0 0 28px!important;align-items:center!important;justify-content:center!important;color:var(--gold)!important;font-size:24px!important;line-height:28px!important}.app-tools-trigger>span:last-child{display:block!important;width:100%!important;height:14px!important;margin:0!important;overflow:visible!important;text-align:center!important;white-space:nowrap!important;font-size:9px!important;line-height:14px!important;color:#a7a39a!important}.mobile-nav-icon,.app-nav-icon{font-size:15px;line-height:1}}</style>';
const js='<script id=\"finlab-builder-nav-script\">(()=>{document.querySelectorAll(\".nav-dropdown\").forEach(d=>{const b=d.querySelector(\"button\");b.onclick=e=>{e.stopPropagation();document.querySelectorAll(\".nav-dropdown\").forEach(x=>{if(x!==d)x.classList.remove(\"open\")});d.classList.toggle(\"open\");b.setAttribute(\"aria-expanded\",d.classList.contains(\"open\"))}});const n=document.querySelector(\"#appNav\");if(!n)return;const b=document.querySelector(\".app-tools-trigger\"),p=document.createElement(\"div\");p.className=\"mobile-tools-panel\";p.innerHTML=`<a href="/strumenti/interesse-composto/">Interesse composto</a><a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href="/strumenti/strategy-lab/">Strategy Lab</a>`;document.body.appendChild(p);b?.addEventListener(\"click\",e=>{e.preventDefault();e.stopPropagation();p.classList.toggle(\"open\")});p.addEventListener(\"click\",e=>e.stopPropagation());document.addEventListener(\"click\",()=>{document.querySelectorAll(\".nav-dropdown\").forEach(d=>d.classList.remove(\"open\"));p.classList.remove(\"open\")})})();</script>';
function nav(h){return h.replace(/<nav\b([^>]*class=[\"'][^\"']*navlinks[^\"']*[\"'][^>]*)>[\s\S]*?<\/nav>/i,(_,a)=>`<nav${a}><a href=\"/\">Home</a><a href=\"/impara/\">Impara</a>${tools}</nav>`)}
function shell(title,content,links){let h=nav(header);if(!h.includes('href=\"/\"'))h=h.replace(/<a class=\"brand\" href=\"#top\">/i,'<a class=\"brand\" href=\"/\">');const m=mobile.replace(/<nav\b([^>]*id=[\"']appNav[\"'][^>]*)>[\s\S]*?<\/nav>/i,(_,a)=>`<nav${a}>${links.map(x=>x[0]==='#tools'?`<button class=\"app-tools-trigger\" type=\"button\"><span class=\"app-nav-icon\">⌘</span><span>Strumenti</span></button>`:`<a href=\"${x[0]}\"><span class=\"app-nav-icon\">${x[1]}</span><span>${x[2]}</span></a>`).join('')}</nav>`);return `<!DOCTYPE html><html lang=\"it\">${head.replace(/<title>[\s\S]*?<\/title>/i,`<title>${title}</title>`)}${css}<body>${h}<main>${content}</main>${footer}${scripts}${m}${js}</body></html>`}
fs.mkdirSync('impara',{recursive:true});fs.mkdirSync(path.join('strumenti','interesse-composto'),{recursive:true});fs.mkdirSync(path.join('strumenti','portfolio-analyzer'),{recursive:true});
fs.writeFileSync('index.html',shell('FINLAB — Educazione finanziaria',`${hero}${platform}${get('importante')}`,[['/','⌂','Home'],['/impara/','▦','Impara'],['#tools','⌘','Strumenti'],['/impara/#lessonSearch','⌕','Cerca']]));

fs.writeFileSync('impara/index.html',shell('FINLAB — Impara',`${get('inizio')}${get('percorso')}`,[['/','⌂','Home'],['/impara/','▦','Impara'],['#tools','⌘','Strumenti'],['/impara/#lessonSearch','⌕','Cerca']]));
const interest=get('strumenti').replace(/id=[\"']strumenti[\"']/i,'id=\"interesse-composto\"').replace('Impara anche attraverso i numeri.','Interesse composto.');
fs.writeFileSync(path.join('strumenti','interesse-composto','index.html'),shell('FINLAB — Interesse composto',interest,[['/','⌂','Home'],['/impara/','▦','Impara'],['#tools','⌘','Strumenti'],['/impara/#lessonSearch','⌕','Cerca']]));
const portfolio=get('portfolio').replace(/id=[\"']portfolio[\"']/i,'id=\"portfolio-analyzer\"').replace('Leggi il tuo portafoglio.','Portfolio Analyzer.');
fs.writeFileSync(path.join('strumenti','portfolio-analyzer','index.html'),shell('FINLAB — Portfolio Analyzer',portfolio,[['/','⌂','Home'],['/impara/','▦','Impara'],['#tools','⌘','Strumenti'],['/impara/#lessonSearch','⌕','Cerca']]));
console.log('FINLAB pages built: home, impara, interesse composto, portfolio analyzer');
