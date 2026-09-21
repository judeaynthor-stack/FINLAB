const fs=require('fs');

const files=[
  'index.html',
  'impara/index.html',
  'strumenti/index.html',
  'strumenti/interesse-composto/index.html',
  'strumenti/portfolio-analyzer/index.html',
  'strumenti/emergency-fund/index.html',
  'strumenti/strategy-lab/index.html'
];

const desktopNav='<nav class="navlinks finlab-unified-links"><a href="/">Home</a><a href="/impara/">Impara</a><div class="nav-dropdown finlab-tools-dropdown"><button class="nav-dropdown-toggle" type="button" aria-expanded="false">Strumenti <span>⌄</span></button><div class="nav-dropdown-menu"><a href="/strumenti/interesse-composto/">Interesse composto</a><a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href="/strumenti/strategy-lab/">Strategy Lab</a></div></div></nav>';

const header='<header class="wrap nav finlab-unified-header"><a class="brand" href="/">FIN<span>LAB</span></a>'+desktopNav+'<div class="finlab-search-wrap"><a class="finlab-search-btn" href="/impara/#lessonSearch" aria-label="Cerca">⌕</a></div></header>';

const mobileNav='<nav aria-label="Navigazione mobile" class="finlab-mobile-nav"><a href="/"><span class="finlab-mobile-icon">⌂</span><span>Home</span></a><a href="/impara/"><span class="finlab-mobile-icon">▤</span><span>Impara</span></a><button class="finlab-mobile-tools" type="button" aria-expanded="false"><span class="finlab-mobile-icon">⚙</span><span>Strumenti</span></button><a href="/impara/#lessonSearch"><span class="finlab-mobile-icon">⌕</span><span>Cerca</span></a></nav>';

const css=`<style id="finlab-unified-navigation-final">
.finlab-unified-header{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;position:relative!important;z-index:1200!important}
.finlab-unified-header .brand{flex:0 0 auto!important;text-decoration:none!important}
.finlab-unified-links{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:12px!important;flex:1!important}
.finlab-unified-links>a,.finlab-unified-links .nav-dropdown-toggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;height:56px!important;padding:0 25px!important;border:1px solid #292824!important;border-radius:999px!important;background:transparent!important;color:#aaa69d!important;text-decoration:none!important;font:inherit!important;cursor:pointer!important;white-space:nowrap!important}
.finlab-unified-links>a:hover,.finlab-unified-links .nav-dropdown-toggle:hover{color:#fff!important;border-color:#403c34!important}
.finlab-unified-links .nav-dropdown{position:relative!important;display:inline-flex!important}
.finlab-unified-links .nav-dropdown-menu{display:none!important;position:absolute!important;right:0!important;top:calc(100% + 8px)!important;width:270px!important;background:#0d0d0c!important;border:1px solid #39362f!important;border-radius:16px!important;padding:7px!important;box-shadow:0 20px 50px rgba(0,0,0,.55)!important;z-index:1300!important}
.finlab-unified-links .nav-dropdown.open .nav-dropdown-menu{display:block!important}
.finlab-unified-links .nav-dropdown-menu a{display:block!important;padding:12px 13px!important;color:#aaa69d!important;text-decoration:none!important;border-radius:10px!important;font-size:13px!important}
.finlab-unified-links .nav-dropdown-menu a:hover{background:#171613!important;color:#fff!important}
.finlab-search-wrap{flex:0 0 auto!important}
.finlab-search-btn{width:56px!important;height:56px!important;border:1px solid #292824!important;border-radius:50%!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#d0ccc3!important;text-decoration:none!important;font-size:30px!important;line-height:1!important}
.finlab-search-btn:hover{border-color:#403c34!important;color:#fff!important}
.finlab-mobile-nav{display:none!important}
@media(max-width:650px){
 body{padding-bottom:112px!important}
 .finlab-unified-header{margin-top:0!important;padding-top:0!important;min-height:64px!important}
 .finlab-unified-header .brand{font-size:21px!important;letter-spacing:.08em!important}
 .finlab-unified-links{gap:8px!important;justify-content:flex-start!important;overflow:visible!important}
 .finlab-unified-links>a,.finlab-unified-links .nav-dropdown-toggle{height:46px!important;padding:0 10px!important;font-size:11px!important}
 .finlab-unified-links .nav-dropdown-menu{display:none!important}
 .finlab-search-wrap{margin-left:auto!important}
 .finlab-search-btn{width:44px!important;height:44px!important;font-size:24px!important}
 .finlab-mobile-nav{position:fixed!important;left:10px!important;right:10px!important;bottom:10px!important;height:82px!important;min-height:82px!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:0!important;align-items:stretch!important;background:rgba(10,10,9,.97)!important;border:1px solid #403c34!important;border-radius:25px!important;box-shadow:0 18px 55px rgba(0,0,0,.7)!important;z-index:99999!important;overflow:hidden!important;padding:4px!important}
 .finlab-mobile-nav>a,.finlab-mobile-tools{min-width:0!important;width:100%!important;height:72px!important;border:0!important;background:transparent!important;color:#a7a39a!important;text-decoration:none!important;font:9px Inter,system-ui,sans-serif!important;letter-spacing:.06em!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;cursor:pointer!important}
 .finlab-mobile-nav>a:active,.finlab-mobile-tools:active{background:#171613!important;border-radius:16px!important}
 .finlab-mobile-icon{display:flex!important;width:28px!important;height:28px!important;align-items:center!important;justify-content:center!important;font-family:Arial,sans-serif!important;font-size:23px!important;line-height:28px!important;color:#c7a96b!important}
 .finlab-mobile-nav>a>span:last-child,.finlab-mobile-tools>span:last-child{display:block!important;width:100%!important;height:14px!important;margin:0!important;overflow:visible!important;text-align:center!important;white-space:nowrap!important;color:#a7a39a!important;font-size:9px!important;line-height:14px!important}
 .finlab-mobile-tools-panel{position:fixed!important;left:12px!important;right:12px!important;bottom:102px!important;z-index:100000!important;display:none!important;background:#0c0c0b!important;border:1px solid #3a3832!important;border-radius:18px!important;padding:7px!important;box-shadow:0 20px 50px rgba(0,0,0,.65)!important}
 .finlab-mobile-tools-panel.open{display:block!important}
 .finlab-mobile-tools-panel a{display:block!important;padding:13px!important;color:#aaa69d!important;font:12px Inter,sans-serif!important;text-decoration:none!important;border-bottom:1px solid #24231f!important}
 .finlab-mobile-tools-panel a:last-child{border-bottom:0!important}
}
@media(min-width:651px){.finlab-mobile-tools-panel{display:none!important}}
</style>`;

const js=`<script id="finlab-unified-navigation-final-js">
(()=>{const header=document.querySelector(".finlab-unified-header");const dropdown=header?.querySelector(".nav-dropdown");const db=dropdown?.querySelector(".nav-dropdown-toggle");db?.addEventListener("click",e=>{e.stopPropagation();const open=dropdown.classList.toggle("open");db.setAttribute("aria-expanded",String(open))});document.addEventListener("click",e=>{if(dropdown&&!dropdown.contains(e.target)){dropdown.classList.remove("open");db?.setAttribute("aria-expanded","false")}});const nav=document.querySelector(".finlab-mobile-nav");if(!nav)return;let panel=document.querySelector(".finlab-mobile-tools-panel");if(!panel){panel=document.createElement("div");panel.className="finlab-mobile-tools-panel";panel.innerHTML='<a href="/strumenti/interesse-composto/">Interesse composto</a><a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href="/strumenti/strategy-lab/">Strategy Lab</a>';document.body.appendChild(panel)}const tb=nav.querySelector(".finlab-mobile-tools");tb?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const open=panel.classList.toggle("open");tb.setAttribute("aria-expanded",String(open))});panel.addEventListener("click",e=>e.stopPropagation());document.addEventListener("click",()=>{panel.classList.remove("open");tb?.setAttribute("aria-expanded","false")});document.addEventListener("keydown",e=>{if(e.key==="Escape"){panel.classList.remove("open");tb?.setAttribute("aria-expanded","false")}})})();
</script>`;

function replaceFirst(re,html,repl){return re.test(html)?html.replace(re,repl):html.replace(/<\/head>/i,repl+'<\/head>')}
for(const file of files){
  if(!fs.existsSync(file))continue;
  let h=fs.readFileSync(file,'utf8');
  h=h.replace(/<style\b[^>]*id=["']finlab-unified-navigation-final["'][^>]*>[\s\S]*?<\/style>/gi,'');
  h=h.replace(/<script\b[^>]*id=["']finlab-unified-navigation-final-js["'][^>]*>[\s\S]*?<\/script>/gi,'');
  h=h.replace(/<script\b[^>]*id=["']finlab-tools-nav-script["'][^>]*>[\s\S]*?<\/script>/gi,'');
  h=h.replace(/<nav\b[^>]*(?:id=["']appNav["']|class=["'][^"']*(?:mobile-nav|finlab-mobile-nav|finlab-unified-mobile|app-nav)[^"']*["'])[^>]*>[\s\S]*?<\/nav>/gi,'');
  h=h.replace(/<nav\b[^>]*class=["']mobile["'][^>]*>[\s\S]*?<\/nav>/gi,'');
  h=h.replace(/<header\b[\s\S]*?<\/header>/i,header);
  if(!/<header\b/i.test(h)) throw new Error('No header in '+file);
  h=h.replace(/<\/body>/i,mobileNav+'\n'+js+'\n</body>');
  h=h.replace(/<\/head>/i,css+'\n</head>');
  fs.writeFileSync(file,h);
}
console.log('FINLAB navigation normalized on every page');
