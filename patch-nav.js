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

const header='<header class="wrap nav finlab-unified-header"><a class="brand" href="/">FIN<span>LAB</span></a>'+desktopNav+'</header>';

const mobileNav='<nav aria-label="Navigazione mobile" class="finlab-mobile-nav"><a href="/"><span class="finlab-mobile-icon">⌂</span><span>Home</span></a><a href="/impara/"><span class="finlab-mobile-icon">▤</span><span>Impara</span></a><button class="finlab-mobile-tools" type="button" aria-expanded="false"><span class="finlab-mobile-icon">⚙</span><span>Strumenti</span></button><a href="/impara/#lessonSearch"><span class="finlab-mobile-icon">⌕</span><span>Cerca</span></a></nav>';

const css=`<style id="finlab-unified-navigation-final">
.finlab-unified-header{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;position:relative!important;z-index:1200!important}
.finlab-unified-header .brand{flex:0 0 auto!important;text-decoration:none!important}
.finlab-unified-links{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:12px!important;flex:1!important}
.finlab-unified-links>a,.finlab-unified-links .nav-dropdown-toggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;height:56px!important;padding:0 25px!important;border:1px solid #292824!important;border-radius:999px!important;background:transparent!important;color:#aaa69d!important;text-decoration:none!important;font:inherit!important;cursor:pointer!important;white-space:nowrap!important}
.finlab-unified-links>a:hover,.finlab-unified-links .nav-dropdown-toggle:hover{color:#fff!important;border-color:#403c34!important}
.finlab-unified-links .nav-dropdown{position:relative!important;display:inline-flex!important}
.finlab-unified-links .nav-dropdown-menu{display:none!important;position:absolute!important;right:0!important;top:calc(100% + 8px)!important;width:270px!important;height:auto!important;min-height:0!important;max-height:250px!important;overflow:auto!important;background:#0d0d0c!important;border:1px solid #39362f!important;border-radius:16px!important;padding:7px!important;box-shadow:0 20px 50px rgba(0,0,0,.55)!important;z-index:1300!important;box-sizing:border-box!important}
.finlab-unified-links .nav-dropdown.open .nav-dropdown-menu{display:block!important}
.finlab-unified-links .nav-dropdown-menu a{display:flex!important;align-items:center!important;height:44px!important;min-height:44px!important;max-height:44px!important;box-sizing:border-box!important;margin:0!important;padding:0 13px!important;color:#aaa69d!important;text-decoration:none!important;border-radius:10px!important;font:500 13px/1.2 Inter,system-ui,sans-serif!important;letter-spacing:0!important;white-space:nowrap!important}.finlab-unified-links .nav-dropdown-menu a::before,.finlab-unified-links .nav-dropdown-menu a::after{content:none!important;display:none!important}.finlab-unified-links .nav-dropdown-menu img,.finlab-unified-links .nav-dropdown-menu svg,.finlab-unified-links .nav-dropdown-menu i{display:none!important;width:0!important;height:0!important}.finlab-unified-links .nav-dropdown-menu *{box-sizing:border-box!important;max-width:100%!important}
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

@media(max-width:650px){
 html,body{max-width:100%;overflow-x:hidden!important}
 .finlab-unified-header{width:100%!important;max-width:100%!important;box-sizing:border-box!important;height:64px!important;min-height:64px!important;padding:0 10px!important;gap:7px!important;overflow:hidden!important}
 .finlab-unified-header .brand{flex:0 0 68px!important;width:68px!important;min-width:68px!important;font-size:17px!important;letter-spacing:.04em!important;white-space:nowrap!important;overflow:hidden!important}
 .finlab-unified-links{flex:1 1 auto!important;min-width:0!important;width:auto!important;gap:4px!important;overflow:hidden!important}
 .finlab-unified-links>a,.finlab-unified-links .nav-dropdown-toggle{flex:0 1 auto!important;min-width:0!important;height:42px!important;padding:0 8px!important;font-size:10px!important;gap:3px!important;white-space:nowrap!important}
 .finlab-unified-links .nav-dropdown-toggle span{display:none!important}
 .finlab-search-wrap{flex:0 0 40px!important;width:40px!important;margin-left:0!important}
 .finlab-search-btn{width:40px!important;height:40px!important;font-size:22px!important}
}
@media(max-width:380px){
 .finlab-unified-header{padding:0 7px!important;gap:4px!important}
 .finlab-unified-header .brand{flex-basis:60px!important;width:60px!important;min-width:60px!important;font-size:15px!important}
 .finlab-unified-links{gap:2px!important}
 .finlab-unified-links>a,.finlab-unified-links .nav-dropdown-toggle{padding:0 6px!important;font-size:9px!important}
 .finlab-search-wrap,.finlab-search-btn{width:36px!important;flex-basis:36px!important}
 .finlab-search-btn{height:36px!important;font-size:20px!important}
}
@media(max-width:650px){
  body{padding-top:0!important}
  .hero{padding-top:18px!important}
}
</style>`;

const designCss=`<style id="finlab-app-design-system">
/* FINLAB APP DESIGN SYSTEM — shared premium learning UI */
:root{--fin-glow:rgba(208,180,119,.16);--fin-panel:#10110f;--fin-panel-2:#141512;--fin-border:rgba(255,255,255,.09);--fin-border-gold:rgba(208,180,119,.30)}
body{background:radial-gradient(900px 500px at 78% -12%,rgba(208,180,119,.09),transparent 62%),radial-gradient(700px 500px at -10% 60%,rgba(120,145,130,.035),transparent 65%),var(--bg,#080908)!important}
.hero,.section{position:relative}.hero:before,.section:before{content:"";position:absolute;pointer-events:none;inset:0;background:radial-gradient(420px 220px at 90% 10%,rgba(208,180,119,.035),transparent 70%);opacity:.9}
.hero>* ,.section>*{position:relative;z-index:1}
.hero h1,.section h2,.card h2,.card h3,.panel h2,.panel h3,.template h3,.metric-value,.scenario-value,.darkbox h3{text-shadow:0 0 28px rgba(208,180,119,.035)}
.card,.panel,.form,.darkbox,.template,.metric,.scenario,.chart-wrap,.path-guide,.start-card,.topic-detail,.chapter-panel,.thought-card,.reflection-panel,.sim-intro{background:linear-gradient(145deg,rgba(20,21,18,.98),rgba(12,13,11,.98))!important;border:1px solid var(--fin-border)!important;box-shadow:0 16px 50px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.025)!important;border-radius:18px!important;position:relative;overflow:hidden}
.card:before,.panel:before,.form:before,.darkbox:before,.template:before,.metric:before,.path-guide:before,.start-card:before{content:"";position:absolute;left:0;top:0;width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(208,180,119,.35),transparent);opacity:.7}
.card:hover,.panel:hover,.template:hover,.start-card:hover{border-color:var(--fin-border-gold)!important;box-shadow:0 20px 60px rgba(0,0,0,.28),0 0 35px rgba(208,180,119,.035)!important}
.badge,.source-link,.path-guide .badge{background:rgba(208,180,119,.045)!important;border-color:rgba(208,180,119,.28)!important;color:#cdb579!important}
.btn,.calc-btn,.primary,.month-btn,.topic,.lesson-complete,.quiz-check{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease,background .18s ease!important}
.btn:hover,.calc-btn:hover,.primary:hover,.month-btn:hover,.topic:hover,.lesson-complete:hover,.quiz-check:hover{transform:translateY(-2px)!important;box-shadow:0 10px 30px rgba(208,180,119,.08)!important}
input,select,textarea,.field input,.alloc-input,.money-input{background:rgba(6,7,6,.8)!important;border-color:rgba(255,255,255,.10)!important;border-radius:11px!important}
input:focus,select:focus,textarea:focus,.field input:focus,.alloc-input:focus,.money-input:focus{border-color:rgba(208,180,119,.55)!important;box-shadow:0 0 0 3px rgba(208,180,119,.07),0 0 25px rgba(208,180,119,.035)!important}
.calc-btn,.primary{background:linear-gradient(135deg,#d9bd7b,#b99859)!important;color:#17140f!important;border-color:#d9bd7b!important}
.progress,.progress-track,.xp-track{box-shadow:inset 0 1px 3px rgba(0,0,0,.5)!important}
.progress-bar,.progress-track span{background:linear-gradient(90deg,#9d8050,#d6b873)!important;box-shadow:0 0 12px rgba(208,180,119,.22)!important}
.chapter-card,.path-card{background:linear-gradient(145deg,#121310,#0d0e0c)!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:18px!important;box-shadow:0 14px 40px rgba(0,0,0,.2)!important}
.chapter-card:hover,.path-card:hover{border-color:rgba(208,180,119,.34)!important;transform:translateY(-3px)!important;box-shadow:0 20px 55px rgba(0,0,0,.28),0 0 28px rgba(208,180,119,.035)!important}
.platform-strip{background:rgba(12,13,11,.72)!important;border-top:1px solid rgba(255,255,255,.07)!important;border-bottom:1px solid rgba(255,255,255,.07)!important}
.platform-strip .strip-item{transition:transform .2s ease,background .2s ease!important;border-radius:14px!important}
.platform-strip .strip-item:hover{transform:translateY(-2px);background:rgba(208,180,119,.035)}
.paper,.journal{background:linear-gradient(145deg,#151612,#0d0e0c)!important;color:var(--white,#f5f2eb)!important;border:1px solid rgba(208,180,119,.22)!important;border-radius:22px!important;box-shadow:0 24px 70px rgba(0,0,0,.35)!important;transform:none!important}
.paper:after,.journal:before{border-color:rgba(208,180,119,.18)!important}
.paper p,.journal p{color:#aaa69d!important}.paper h3,.journal h2{color:#f2eee6!important}
.footer{border-color:rgba(255,255,255,.07)!important}
.result,.metric-value,.scenario-value{color:#f4efe5!important}
.chart,.bar-chart{background:rgba(0,0,0,.10)!important;border-color:rgba(255,255,255,.08)!important}
.topic{background:rgba(15,16,14,.9)!important;border-color:rgba(255,255,255,.08)!important;border-radius:12px!important}
.topic.active,.topic-detail.active{border-color:rgba(208,180,119,.32)!important}
@media(max-width:650px){
 .hero{padding-top:48px!important}.section{padding-top:58px!important;padding-bottom:58px!important}
 .card,.panel,.form,.darkbox,.template,.metric,.scenario,.path-guide,.start-card,.paper,.journal{border-radius:18px!important}
 .grid,.start-grid,.templates{gap:10px!important}
}
</style>`;
const js=`<script id="finlab-unified-navigation-final-js">
(()=>{document.addEventListener("DOMContentLoaded",()=>{const header=document.querySelector(".finlab-unified-header");const dropdown=header?.querySelector(".nav-dropdown");const db=dropdown?.querySelector(".nav-dropdown-toggle");if(db){db.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const open=dropdown.classList.toggle("open");db.setAttribute("aria-expanded",String(open))})}document.addEventListener("click",e=>{if(dropdown&&!dropdown.contains(e.target)){dropdown.classList.remove("open");db?.setAttribute("aria-expanded","false")}});const nav=document.querySelector(".finlab-mobile-nav");if(!nav)return;let panel=document.querySelector(".finlab-mobile-tools-panel");if(!panel){panel=document.createElement("div");panel.className="finlab-mobile-tools-panel";panel.innerHTML='<a href="/strumenti/interesse-composto/">Interesse composto</a><a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href="/strumenti/strategy-lab/">Strategy Lab</a>';document.body.appendChild(panel)}const tb=nav.querySelector(".finlab-mobile-tools");tb?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const open=panel.classList.toggle("open");tb.setAttribute("aria-expanded",String(open))});panel.addEventListener("click",e=>e.stopPropagation());document.addEventListener("click",()=>{panel.classList.remove("open");tb?.setAttribute("aria-expanded","false")});document.addEventListener("keydown",e=>{if(e.key==="Escape"){panel.classList.remove("open");tb?.setAttribute("aria-expanded","false")}})})})();
</script>`;

function replaceFirst(re,html,repl){return re.test(html)?html.replace(re,repl):html.replace(/<\/head>/i,repl+'<\/head>')}
for(const file of files){
  if(!fs.existsSync(file))continue;
  let h=fs.readFileSync(file,'utf8');
  h=h.replace(/<style\b[^>]*id=["']finlab-unified-navigation-final["'][^>]*>[\s\S]*?<\/style>/gi,'');
  h=h.replace(/<script\b[^>]*id=["']finlab-unified-navigation-final-js["'][^>]*>[\s\S]*?<\/script>/gi,'');
  h=h.replace(/<script\b[^>]*id=["']finlab-tools-nav-script["'][^>]*>[\s\S]*?<\/script>/gi,'');
  // Remove every legacy navigation implementation before installing the single canonical one.
  h=h.replace(/<script\b[^>]*id=["'](?:finlab-builder-nav-script|finlab-unified-nav-js|finlab-mobile-tools-script|finlab-mobile-nav-script|finlab-unified-navigation-final-js|finlab-tools-nav-script)["'][^>]*>[\s\S]*?<\/script>/gi,'');
  h=h.replace(/<style\b[^>]*id=["'](?:finlab-builder-nav|finlab-unified-nav-css|finlab-mobile-tools-style|finlab-mobile-nav-fix|finlab-unified-navigation-final|finlab-mobile-header-fit|finlab-mobile-brand-fit|finlab-mobile-spacing-fit|finlab-tools-header-alignment-fix|finlab-tools-header-final-fix)["'][^>]*>[\s\S]*?<\/style>/gi,'');
  h=h.replace(/<nav\b[^>]*(?:id=["']appNav["']|class=["'][^"']*(?:mobile-nav|finlab-mobile-nav|finlab-unified-mobile|app-nav)[^"']*["'])[^>]*>[\s\S]*?<\/nav>/gi,'');
  h=h.replace(/<nav\b[^>]*class=["']mobile["'][^>]*>[\s\S]*?<\/nav>/gi,'');
  h=h.replace(/<header\b[\s\S]*?<\/header>/i,header);
  if(!/<header\b/i.test(h)) throw new Error('No header in '+file);
  h=h.replace(/<\/body>/i,mobileNav+'\n'+js+'\n</body>');
  h=h.replace(/<\/head>/i,css+'\n'+designCss+'\n</head>');
  fs.writeFileSync(file,h);
}
console.log('FINLAB navigation normalized on every page');
