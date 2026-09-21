const fs=require('fs');

const files=[
  'strumenti/emergency-fund/index.html',
  'strumenti/index.html',
  'strumenti/strategy-lab/index.html'
];

const desktopNav='<nav class="navlinks"><a href="/">Home</a><a href="/impara/">Impara</a><div class="nav-dropdown"><button class="nav-dropdown-toggle" type="button" aria-expanded="false">Strumenti <span>⌄</span></button><div class="nav-dropdown-menu"><a href="/strumenti/interesse-composto/">Interesse composto</a><a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href="/strumenti/strategy-lab/">Strategy Lab</a></div></div></nav>';

const mobileCss='<style id="finlab-static-mobile-nav-fix">
@media(max-width:850px){
  .mobile-nav,.finlab-mobile-nav{
    position:fixed!important;left:8px!important;right:8px!important;bottom:8px!important;
    z-index:1100!important;display:grid!important;grid-template-columns:repeat(4,1fr)!important;
    gap:4px!important;padding:6px!important;background:rgba(9,9,8,.96)!important;
    border:1px solid #403c34!important;border-radius:22px!important;
    box-shadow:0 18px 55px rgba(0,0,0,.7)!important;
  }
  .mobile-nav>a,.mobile-nav>button,.finlab-mobile-nav>a,.finlab-mobile-nav>button{
    min-height:46px!important;border:0!important;border-radius:16px!important;background:transparent!important;
    color:#aaa69d!important;text-decoration:none!important;font:9px Inter!important;
    display:flex!important;flex-direction:column!important;align-items:center!important;
    justify-content:center!important;gap:3px!important;padding:6px!important;cursor:pointer!important;
  }
  .mobile-nav>a span:last-child,.mobile-nav>button span:last-child,
  .finlab-mobile-nav>a span:last-child,.finlab-mobile-nav>button span:last-child{
    display:block!important;font:9px Inter!important;line-height:14px!important;color:#aaa69d!important;
  }
  .finlab-static-tools-panel{
    position:fixed!important;left:12px!important;right:12px!important;bottom:82px!important;
    z-index:1200!important;display:none;background:#0c0c0b!important;border:1px solid #3a3832!important;
    border-radius:18px!important;padding:7px!important;box-shadow:0 20px 50px rgba(0,0,0,.65)!important;
  }
  .finlab-static-tools-panel.open{display:block!important}
  .finlab-static-tools-panel a{display:block!important;padding:13px!important;color:#aaa69d!important;
    font-size:12px!important;text-decoration:none!important;border-bottom:1px solid #24231f!important}
  .finlab-static-tools-panel a:last-child{border-bottom:0!important}
}
@media(min-width:851px){.mobile-nav,.finlab-mobile-nav,.finlab-static-tools-panel{display:none!important}}
</style>';

const js='<script id="finlab-static-mobile-nav-fix-js">
(()=>{const nav=document.querySelector(".mobile-nav,.finlab-mobile-nav");if(!nav)return;
let links=[...nav.querySelectorAll("a")],tools=nav.querySelector("button");
if(!links.some(a=>a.textContent.trim()==="Cerca")){const a=document.createElement("a");a.href="/impara/#lessonSearch";a.innerHTML="<span class=\"mobile-icon\">⌕</span><span>Cerca</span>";nav.appendChild(a)}
if(!tools){tools=document.createElement("button");tools.type="button";tools.innerHTML="<span class=\"mobile-icon\">⌘</span><span>Strumenti</span>";nav.insertBefore(tools,nav.children[2])}
tools.className="finlab-static-tools-trigger";tools.setAttribute("aria-expanded","false");
const p=document.createElement("div");p.className="finlab-static-tools-panel";p.innerHTML='<a href="/strumenti/interesse-composto/">Interesse composto</a><a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href="/strumenti/strategy-lab/">Strategy Lab</a>';document.body.appendChild(p);
tools.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const o=p.classList.toggle("open");tools.setAttribute("aria-expanded",String(o))});
p.addEventListener("click",e=>e.stopPropagation());document.addEventListener("click",()=>{p.classList.remove("open");tools.setAttribute("aria-expanded","false")});
})();
</script>';

for(const file of files){
  if(!fs.existsSync(file))continue;
  let h=fs.readFileSync(file,'utf8');
  h=h.replace(/<nav\b[^>]*class=["'][^"']*(?:mobile-nav|finlab-mobile-nav)[^"']*["'][^>]*>[\s\S]*?<\/nav>/i,
    '<nav aria-label="Navigazione mobile" class="mobile-nav finlab-mobile-nav"><a href="/"><span class="mobile-icon">⌂</span><span>Home</span></a><a href="/impara/"><span class="mobile-icon">▤</span><span>Impara</span></a><button class="finlab-static-tools-trigger" type="button" aria-expanded="false"><span class="mobile-icon">⌘</span><span>Strumenti</span></button><a href="/impara/#lessonSearch"><span class="mobile-icon">⌕</span><span>Cerca</span></a></nav>');
  if(!h.includes('id="finlab-static-mobile-nav-fix"'))h=h.replace('</head>',mobileCss+'</head>');
  if(!h.includes('id="finlab-static-mobile-nav-fix-js"'))h=h.replace('</body>',js+'</body>');
  fs.writeFileSync(file,h);
}
console.log('FINLAB static mobile navigation normalized');