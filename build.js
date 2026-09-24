const fs=require('fs'),path=require('path');
const source=fs.readFileSync('source.html','utf8');
function tag(html,name,pred=()=>true){const re=new RegExp('<'+name+'\\b[^>]*>','gi');let m;while(m=re.exec(html)){if(!pred(m[0]))continue;const start=m.index,t=new RegExp('<\\/?'+name+'\\b[^>]*>','gi');t.lastIndex=re.lastIndex;let d=1,x;while(x=t.exec(html)){if(x[0].startsWith('</'))d--;else if(!x[0].endsWith('/>'))d++;if(!d)return html.slice(start,t.lastIndex)}}return ''}
function sections(body){const out=[],re=/<\/?section\b[^>]*>/gi;let d=0,s=-1,m;while(m=re.exec(body)){if(!m[0].startsWith('</')){if(!d)s=m.index;d++}else{d--;if(!d&&s>=0){const html=body.slice(s,re.lastIndex);const idMatch=html.match(/<section\b[^>]*\bid=[\"']([^\"']+)[\"']/i);const id=idMatch?idMatch[1]:'';out.push({id,html});s=-1}}}return out}
const head=(source.match(/<head>[\s\S]*?<\/head>/i)||['<head></head>'])[0];
const body=(source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)||['',''])[1];
const header=tag(body,'header'),footer=tag(body,'footer');
const mobile=tag(body,'nav',x=>/\bid=[\"']appNav[\"']/i.test(x));
const scripts=[...body.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map(x=>x[0]).filter(x=>!/editorial-detail|finlab-study-view/.test(x)).join('\n');
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
.affiliate-book{margin-top:22px;padding:16px 18px;border:1px solid rgba(208,180,119,.20);border-radius:20px;background:linear-gradient(145deg,rgba(208,180,119,.055),rgba(255,255,255,.018));box-shadow:0 16px 42px rgba(0,0,0,.20)}
.affiliate-book .affiliate-eyebrow{font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#d0b477;font-weight:700;margin-bottom:8px}
.affiliate-book h4{margin:0 0 4px;font:normal 20px Georgia,serif;color:#f0ede5}
.affiliate-book .affiliate-author{margin:0 0 6px;color:#aaa69d;font-size:12px}
.affiliate-book .affiliate-copy{margin:0 0 10px;color:#918d84;font-size:12px;line-height:1.6}
.affiliate-book .affiliate-link{display:inline-flex;align-items:center;gap:7px;padding:8px 12px;border:1px solid rgba(208,180,119,.35);border-radius:10px;color:#d0b477;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:.02em;background:rgba(208,180,119,.045)}
.affiliate-book .affiliate-link:hover{border-color:#d0b477;background:rgba(208,180,119,.09);color:#f0ede5}
.affiliate-book .affiliate-disclosure{margin:8px 0 0;color:#66625b;font-size:9px;line-height:1.5}
@media(max-width:650px){.affiliate-book{padding:15px;margin-top:20px}.affiliate-book h4{font-size:19px}.affiliate-book .affiliate-link{width:100%;justify-content:center}}
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
const editorialCss="<style id=\"finlab-editorial-layout\">\n#percorso .view-switcher{display:flex;align-items:center;gap:8px;margin:30px 0 24px;padding:6px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.018);border-radius:999px;width:max-content}\n#percorso .view-switcher-label{padding:0 8px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#77736b}\n#percorso .view-switcher button{border:1px solid transparent;background:transparent;color:#99958d;padding:9px 14px;border-radius:999px;cursor:pointer;font:600 11px Inter,sans-serif}\n#percorso .view-switcher button.active{background:rgba(208,180,119,.12);border-color:rgba(208,180,119,.30);color:#f7f5ef}\n#percorso .view-switcher .beta{margin-left:6px;padding:3px 6px;border:1px solid rgba(208,180,119,.35);border-radius:999px;color:#d0b477;font-size:8px;letter-spacing:.1em}\n.editorial-shell{display:none;grid-template-columns:270px minmax(0,1fr);gap:14px;align-items:start;margin-top:18px}\n#percorso.editorial-mode .study-tools,#percorso.editorial-mode .advanced-path,#percorso.editorial-mode .grid,#percorso.editorial-mode .editorial-detail{display:none!important}\n#percorso.editorial-mode .editorial-shell{display:grid}\n.editorial-sidebar{position:sticky;top:88px;max-height:calc(100vh - 110px);display:flex;flex-direction:column;background:linear-gradient(145deg,#11120f,#0c0d0b);border:1px solid rgba(255,255,255,.08);border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.25)}\n.editorial-sidebar-head{padding:18px 17px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;justify-content:space-between;align-items:end;gap:10px}\n.editorial-sidebar-head span{font-size:9px;letter-spacing:.15em;color:#d0b477;font-weight:800}\n.editorial-sidebar-head strong{font-size:10px;color:#77736b;font-weight:600}\n.editorial-chapter-list{overflow:auto;padding:8px;scrollbar-width:thin}\n.editorial-chapter{width:100%;display:grid;grid-template-columns:30px 1fr;gap:9px;text-align:left;border:1px solid transparent;background:transparent;color:#a9a69e;border-radius:14px;padding:10px 9px;cursor:pointer;font:500 12px/1.3 Inter,sans-serif;transition:.2s}\n.editorial-chapter:hover{background:rgba(255,255,255,.035);color:#f7f5ef}\n.editorial-chapter.active{background:rgba(208,180,119,.10);border-color:rgba(208,180,119,.22);color:#f7f5ef}\n.editorial-chapter-no{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);font-size:9px;color:#858179}\n.editorial-chapter.active .editorial-chapter-no{background:#d0b477;color:#171614;border-color:#d0b477;font-weight:800}\n.editorial-sidebar-foot{padding:13px 15px;border-top:1px solid rgba(255,255,255,.07);color:#77736b;font-size:10px}\n.editorial-sidebar-foot b{color:#c9c4b9}\n.editorial-main{min-width:0}\n.editorial-main-empty{min-height:560px;border:1px dashed rgba(255,255,255,.10);border-radius:28px;display:grid;place-items:center;color:#77736b;font-size:13px}\n.editorial-main .chapter-panel{display:block!important;margin:0!important;padding:36px!important;border-radius:28px!important;background:linear-gradient(145deg,#151611,#0d0e0c)!important;border:1px solid rgba(208,180,119,.22)!important;box-shadow:0 28px 80px rgba(0,0,0,.34)!important;position:relative;overflow:hidden}\n.editorial-main .chapter-panel:before{content:\"\";position:absolute;width:430px;height:430px;border:1px solid rgba(208,180,119,.14);border-radius:50%;right:-210px;top:-240px;pointer-events:none}\n.editorial-main .chapter-panel>*{position:relative}\n.editorial-main .chapter-panel-tools{justify-content:flex-start;margin-bottom:18px}\n.editorial-main .chapter-panel-progress{font-size:9px;text-transform:uppercase;letter-spacing:.13em;color:#77736b}\n.editorial-main .chapter-panel>.eyebrow{font-size:9px}\n.editorial-main .chapter-panel>h3{font:normal clamp(40px,5vw,64px)/.98 Georgia,serif!important;letter-spacing:-.045em!important;margin:15px 0 13px!important;max-width:760px}\n.editorial-main .chapter-panel>.lead{font-size:15px;line-height:1.7;max-width:720px}\n.editorial-main .topic-list{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:30px}\n.editorial-main .topic{min-height:60px;border-radius:16px!important;padding:15px 17px!important;background:rgba(0,0,0,.17)!important;border-color:rgba(255,255,255,.08)!important;box-shadow:none!important}\n.editorial-main .topic:hover{transform:none!important;border-color:rgba(208,180,119,.38)!important}\n.editorial-main .topic-detail{grid-column:1/-1;border-radius:18px!important;background:rgba(0,0,0,.22)!important}\n.editorial-main .affiliate-book{position:relative}\n@media(max-width:850px){.editorial-shell{grid-template-columns:210px minmax(0,1fr)}.editorial-main .chapter-panel{padding:27px!important}.editorial-main .topic-list{grid-template-columns:1fr}}\n@media(max-width:650px){#percorso .view-switcher{width:100%;overflow:auto;justify-content:flex-start}.editorial-shell{grid-template-columns:1fr;gap:10px}.editorial-sidebar{position:relative;top:0;max-height:none}.editorial-chapter-list{display:flex;overflow-x:auto;gap:6px;padding:8px}.editorial-chapter{min-width:170px;grid-template-columns:28px 1fr}.editorial-sidebar-foot{display:none}.editorial-main .chapter-panel{padding:21px!important;border-radius:22px!important}.editorial-main .chapter-panel>h3{font-size:40px!important}.editorial-main .topic-list{grid-template-columns:1fr}}\n</style>";
const css=affiliateCss+editorialCss+'<style id=\"finlab-builder-nav\">.nav{background:rgba(6,6,5,.96);border-bottom:1px solid #3a3730;box-shadow:0 8px 30px rgba(0,0,0,.3);position:relative;z-index:20}.navlinks{gap:30px;align-items:center}.navlinks>a,.nav-dropdown{display:inline-flex;align-items:center}.nav-dropdown-toggle{display:inline-flex;align-items:center;gap:7px;line-height:1;min-height:28px}.nav-dropdown{position:relative;display:inline-flex}.nav-dropdown-menu{display:none;position:absolute;right:0;top:calc(100% + 2px);width:260px;background:#10100e;border:1px solid #3a3832;border-radius:14px;box-shadow:0 20px 50px rgba(0,0,0,.45);padding:7px;z-index:1000}.nav-dropdown.open .nav-dropdown-menu,.nav-dropdown:hover .nav-dropdown-menu{display:block}.nav-dropdown-menu a,.nav-dropdown-menu span{display:block;padding:12px 13px;color:#aaa69d;font-size:13px;border-bottom:1px solid #24231f;border-radius:9px}.nav-dropdown-menu a:hover{color:#fff;background:#181714}.nav-dropdown-menu span:last-child{border:0;color:#68645d}.nav-dropdown-menu small{float:right;color:#4f4b45;font-size:9px;text-transform:uppercase}.mobile-tools-panel{display:none}#inizio .badge{margin-bottom:14px}#inizio h2{margin-top:0;margin-bottom:22px}#inizio .start-grid{margin-top:28px}@media(max-width:1050px){.navlinks{gap:28px}}@media(max-width:650px){.nav{background:rgba(5,5,4,.98);box-shadow:0 10px 28px rgba(0,0,0,.3)}.navlinks{gap:22px;align-items:center}.nav-dropdown:hover .nav-dropdown-menu{display:none}#appNav{grid-template-columns:repeat(4,1fr)!important;left:8px!important;right:8px!important;bottom:8px!important;background:#090908f7!important;border:1px solid #403c34!important;border-radius:22px!important;box-shadow:0 18px 55px rgba(0,0,0,.7)!important;padding:6px!important}.mobile-tools-panel{position:fixed;left:12px;right:12px;bottom:84px;z-index:1100;background:#0c0c0b;border:1px solid #3a3832;box-shadow:0 20px 50px rgba(0,0,0,.65);padding:7px;border-radius:18px}.mobile-tools-panel.open{display:block}.mobile-tools-panel a,.mobile-tools-panel span{display:block;padding:13px;color:#aaa69d;font-size:12px;border-bottom:1px solid #24231f}.mobile-tools-panel span{color:#68645d}.mobile-tools-panel small{float:right;color:#4f4b45;font-size:9px;text-transform:uppercase}.app-tools-trigger{border:0!important;background:transparent!important;color:#aaa69d!important;font:9px Inter!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;padding:4px 1px!important;cursor:pointer;width:25%!important;min-width:25%!important;max-width:25%!important;height:72px!important;min-height:72px!important;border-radius:16px!important;box-sizing:border-box!important;position:absolute!important;left:50%!important;top:4px!important;bottom:4px!important}.app-tools-trigger:active{background:#151512!important}.app-tools-trigger .app-nav-icon{display:flex!important;width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;flex:0 0 28px!important;align-items:center!important;justify-content:center!important;color:var(--gold)!important;font-size:24px!important;line-height:28px!important}.app-tools-trigger>span:last-child{display:block!important;width:100%!important;height:14px!important;margin:0!important;overflow:visible!important;text-align:center!important;white-space:nowrap!important;font-size:9px!important;line-height:14px!important;color:#a7a39a!important}.mobile-nav-icon,.app-nav-icon{font-size:15px;line-height:1}}</style>';
const editorialJs="<script id=\"finlab-editorial-controller\">
(()=> {
  const init=()=>{
    const section=document.querySelector('#percorso');
    if(!section)return;
    const switcher=section.querySelector('.view-switcher');
    const classicBtn=switcher?.querySelector('[data-view=\"classic\"]');
    const editorialBtn=switcher?.querySelector('[data-view=\"editorial\"]');
    const shell=section.querySelector('.editorial-shell');
    if(!switcher||!classicBtn||!editorialBtn||!shell)return;

    const list=shell.querySelector('.editorial-chapter-list');
    const main=shell.querySelector('.editorial-main');
    if(!list||!main)return;

    const cards=[...section.querySelectorAll('.chapter-card[data-chapter]')];
    const panels=[...section.querySelectorAll('.chapter-panel[id^=\"chapter\"]')];
    const panelMap=new Map(panels.map(p=>[p.id,p]));
    if(!cards.length||!panels.length)return;

    list.innerHTML='';
    cards.forEach((card,index)=>{
      const id=card.dataset.chapter;
      if(!panelMap.has(id))return;
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='editorial-chapter';
      btn.dataset.chapter=id;
      btn.innerHTML='<span class=\"editorial-chapter-no\">'+String(index+1).padStart(2,'0')+'</span><span>'+((card.querySelector('h3')?.textContent||'Capitolo').trim())+'</span>';
      btn.addEventListener('click',()=>showChapter(id,true));
      list.appendChild(btn);
    });

    const updateProgress=()=>{
      const source=document.querySelector('#overallProgressText');
      const target=shell.querySelector('#editorialProgress');
      if(source&&target)target.textContent=source.textContent;
    };

    const showChapter=(id,scroll)=>{
      const panel=panelMap.get(id)||panels[0];
      if(!panel)return;
      list.querySelectorAll('.editorial-chapter').forEach(b=>b.classList.toggle('active',b.dataset.chapter===panel.id));
      main.innerHTML='';
      main.appendChild(panel);
      panel.style.display='block';
      panel.classList.add('active');
      updateProgress();
      if(scroll)main.scrollIntoView({behavior:'smooth',block:'start'});
    };

    const setMode=(mode)=>{
      const editorial=mode==='editorial';
      section.classList.toggle('editorial-mode',editorial);
      section.classList.toggle('classic-mode',!editorial);
      classicBtn.classList.toggle('active',!editorial);
      editorialBtn.classList.toggle('active',editorial);

      if(editorial){
        const active=list.querySelector('.editorial-chapter.active');
        showChapter(active?.dataset.chapter||cards[0].dataset.chapter,false);
      }else{
        list.querySelectorAll('.editorial-chapter').forEach(b=>b.classList.remove('active'));
        main.innerHTML='';
        panels.forEach(panel=>{
          const card=section.querySelector('.chapter-card[data-chapter="'+panel.id+'"]');
          const parent=card?.parentElement;
          if(parent&&!parent.contains(panel))parent.appendChild(panel);
          panel.classList.remove('active');
          panel.style.display='';
        });
      }
      updateProgress();
      try{localStorage.setItem('finlab-study-view',mode)}catch(_){}
    };

    classicBtn.addEventListener('click',()=>setMode('classic'));
    editorialBtn.addEventListener('click',()=>setMode('editorial'));

    try{
      const saved=localStorage.getItem('finlab-study-view');
      setMode(saved==='editorial'?'editorial':'classic');
    }catch(_){
      setMode('classic');
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
</script>";
const js='<script id=\"finlab-builder-nav-script\">(()=>{document.querySelectorAll(\".nav-dropdown\").forEach(d=>{const b=d.querySelector(\"button\");b.onclick=e=>{e.stopPropagation();document.querySelectorAll(\".nav-dropdown\").forEach(x=>{if(x!==d)x.classList.remove(\"open\")});d.classList.toggle(\"open\");b.setAttribute(\"aria-expanded\",d.classList.contains(\"open\"))}});const n=document.querySelector(\"#appNav\");if(!n)return;const b=document.querySelector(\".app-tools-trigger\"),p=document.createElement(\"div\");p.className=\"mobile-tools-panel\";p.innerHTML=`<a href="/strumenti/interesse-composto/">Interesse composto</a><a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href="/strumenti/strategy-lab/">Strategy Lab</a>`;document.body.appendChild(p);b?.addEventListener(\"click\",e=>{e.preventDefault();e.stopPropagation();p.classList.toggle(\"open\")});p.addEventListener(\"click\",e=>e.stopPropagation());document.addEventListener(\"click\",()=>{document.querySelectorAll(\".nav-dropdown\").forEach(d=>d.classList.remove(\"open\"));p.classList.remove(\"open\")})})();</script>';
function nav(h){return h.replace(/<nav\b([^>]*class=[\"'][^\"']*navlinks[^\"']*[\"'][^>]*)>[\s\S]*?<\/nav>/i,(_,a)=>`<nav${a}><a href=\"/\">Home</a><a href=\"/impara/\">Impara</a>${tools}</nav>`)}
function shell(title,content,links){let h=nav(header);if(!h.includes('href=\"/\"'))h=h.replace(/<a class=\"brand\" href=\"#top\">/i,'<a class=\"brand\" href=\"/\">');const m=mobile.replace(/<nav\b([^>]*id=[\"']appNav[\"'][^>]*)>[\s\S]*?<\/nav>/i,(_,a)=>`<nav${a}>${links.map(x=>x[0]==='#tools'?`<button class=\"app-tools-trigger\" type=\"button\"><span class=\"app-nav-icon\">⌘</span><span>Strumenti</span></button>`:`<a href=\"${x[0]}\"><span class=\"app-nav-icon\">${x[1]}</span><span>${x[2]}</span></a>`).join('')}</nav>`);return `<!DOCTYPE html><html lang=\"it\">${head.replace(/<title>[\s\S]*?<\/title>/i,`<title>${title}</title>`)}${css}<body>${h}<main>${content}</main>${footer}${scripts}${m}${js}${editorialJs}<script id="finlab-editorial-fix">
(()=> {
  const boot=()=>{
    const section=document.querySelector('#percorso');
    if(!section)return;
    const shell=section.querySelector('.editorial-shell');
    if(!shell)return;
    const list=shell.querySelector('.editorial-chapter-list');
    const main=shell.querySelector('.editorial-main');
    if(!list||!main)return;
    const cards=[...section.querySelectorAll('.chapter-card[data-chapter]')];
    const panels=[...section.querySelectorAll('.chapter-panel[id^="chapter"]')];
    if(!cards.length||!panels.length)return;
    const byId=new Map(panels.map(p=>[p.id,p]));
    list.innerHTML='';
    cards.forEach((card,index)=>{
      const id=card.dataset.chapter;
      const panel=byId.get(id);
      if(!panel)return;
      const b=document.createElement('button');
      b.type='button';
      b.className='editorial-chapter';
      b.dataset.chapter=id;
      b.innerHTML='<span class="editorial-chapter-no">'+String(index+1).padStart(2,'0')+'</span><span>'+((card.querySelector('h3')?.textContent||'').trim())+'</span>';
      b.addEventListener('click',()=>show(id,true));
      list.appendChild(b);
    });
    const empty=main.querySelector('.editorial-main-empty');
    if(empty)empty.remove();
    function show(id,scroll){
      const panel=byId.get(id)||panels[0];
      if(!panel)return;
      list.querySelectorAll('.editorial-chapter').forEach(b=>b.classList.toggle('active',b.dataset.chapter===panel.id));
      main.innerHTML='';
      main.appendChild(panel);
      panel.style.display='block';
      panel.classList.add('active');
      if(scroll)main.scrollIntoView({behavior:'smooth',block:'start'});
    }
    const sync=()=>{
      if(section.classList.contains('editorial-mode')){
        const active=list.querySelector('.editorial-chapter.active');
        show(active?.dataset.chapter||cards[0].dataset.chapter,false);
      }
    };
    section.addEventListener('click',e=>{
      const b=e.target.closest('.view-switcher button[data-view="editorial"]');
      if(b)setTimeout(sync,30);
    });
    new MutationObserver(sync).observe(section,{attributes:true,attributeFilter:['class']});
    if(section.classList.contains('editorial-mode'))sync();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
</script></body></html>`}
fs.mkdirSync('impara',{recursive:true});fs.mkdirSync(path.join('strumenti','interesse-composto'),{recursive:true});fs.mkdirSync(path.join('strumenti','portfolio-analyzer'),{recursive:true});
fs.writeFileSync('index.html',shell('FINLAB — Educazione finanziaria',`${hero}${platform}${get('importante')}`,[['/','⌂','Home'],['/impara/','▦','Impara'],['#tools','⌘','Strumenti'],['/impara/#lessonSearch','⌕','Cerca']]));

fs.writeFileSync('impara/index.html',shell('FINLAB — Impara',`${get('inizio')}${get('percorso')}`,[['/','⌂','Home'],['/impara/','▦','Impara'],['#tools','⌘','Strumenti'],['/impara/#lessonSearch','⌕','Cerca']]));
const interest=get('strumenti').replace(/id=[\"']strumenti[\"']/i,'id=\"interesse-composto\"').replace('Impara anche attraverso i numeri.','Interesse composto.');
fs.writeFileSync(path.join('strumenti','interesse-composto','index.html'),shell('FINLAB — Interesse composto',interest,[['/','⌂','Home'],['/impara/','▦','Impara'],['#tools','⌘','Strumenti'],['/impara/#lessonSearch','⌕','Cerca']]));
const portfolio=get('portfolio').replace(/id=[\"']portfolio[\"']/i,'id=\"portfolio-analyzer\"').replace('Leggi il tuo portafoglio.','Portfolio Analyzer.');
fs.writeFileSync(path.join('strumenti','portfolio-analyzer','index.html'),shell('FINLAB — Portfolio Analyzer',portfolio,[['/','⌂','Home'],['/impara/','▦','Impara'],['#tools','⌘','Strumenti'],['/impara/#lessonSearch','⌕','Cerca']]));
console.log('FINLAB pages built: home, impara, interesse composto, portfolio analyzer');
