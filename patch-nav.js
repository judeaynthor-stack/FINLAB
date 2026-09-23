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

const desktopNav='<nav class="navlinks finlab-unified-links"><a href="/">Home</a><a href="/impara/">Impara</a><div class="nav-dropdown finlab-tools-dropdown"><button class="nav-dropdown-toggle" type="button" aria-expanded="false">Strumenti <span>⌄</span></button><div class="nav-dropdown-menu"><a href="/strumenti/interesse-composto/"><span class="tool-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h3M14 15h2"/></svg></span><span>Interesse composto</span></a><a href="/strumenti/emergency-fund/"><span class="tool-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 5-3.2 8.2-7 10-3.8-1.8-7-5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg></span><span>Emergency Fund Planner</span></a><a href="/strumenti/portfolio-analyzer/"><span class="tool-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 12V4a8 8 0 0 1 7 12l-7-4Z"/></svg></span><span>Portfolio Analyzer</span></a><a href="/strumenti/strategy-lab/"><span class="tool-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v5l-4 8a3 3 0 0 0 2.7 5h6.6A3 3 0 0 0 18 16l-4-8V3"/><path d="M8 15h8"/></svg></span><span>Strategy Lab</span></a></div></div></nav>';

const header='<header class="finlab-unified-header"><a class="brand" href="/">FIN<span>LAB</span></a>'+desktopNav+'</header>';

const mobileNav='<nav aria-label="Navigazione mobile" class="finlab-mobile-nav"><a href="/"><span class="finlab-mobile-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg></span><span>Home</span></a><a href="/impara/"><span class="finlab-mobile-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h6"/></svg></span><span>Impara</span></a><button class="finlab-mobile-tools" type="button" aria-expanded="false"><span class="finlab-mobile-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="4"/></svg></span><span>Strumenti</span></button><a href="/impara/#lessonSearch"><span class="finlab-mobile-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></span><span>Cerca</span></a></nav>';

const css=`<style id="finlab-unified-navigation-final">
body{margin:0!important;padding-top:0!important}
.finlab-unified-header{display:flex!important;align-items:center!important;justify-content:center!important;gap:28px!important;position:relative!important;z-index:1200!important;width:min(1180px,calc(100% - 32px))!important;max-width:1180px!important;height:76px!important;min-height:76px!important;margin:0 auto!important;padding:7px 10px!important;box-sizing:border-box!important;top:0!important}
.finlab-unified-header .brand{flex:0 0 auto!important;text-decoration:none!important;transform:translateX(10px) scale(1.045)!important;transform-origin:center left!important}
.finlab-unified-links{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;flex:0 0 auto!important}
.finlab-unified-links>a,.finlab-unified-links .nav-dropdown-toggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;height:56px!important;padding:0 25px!important;border:1px solid #292824!important;border-radius:999px!important;background:transparent!important;color:#aaa69d!important;text-decoration:none!important;font:inherit!important;cursor:pointer!important;white-space:nowrap!important}
.finlab-unified-links>a:hover,.finlab-unified-links .nav-dropdown-toggle:hover{color:#fff!important;border-color:#403c34!important}
.finlab-unified-links .nav-dropdown{position:relative!important;display:inline-flex!important}
.finlab-unified-links .nav-dropdown-menu{display:none!important;position:absolute!important;right:0!important;top:calc(100% + 8px)!important;width:270px!important;height:auto!important;min-height:0!important;max-height:250px!important;overflow:auto!important;background:#0d0d0c!important;border:1px solid #39362f!important;border-radius:16px!important;padding:7px!important;box-shadow:0 20px 50px rgba(0,0,0,.55)!important;z-index:1300!important;box-sizing:border-box!important}
.finlab-unified-links .nav-dropdown.open .nav-dropdown-menu{display:block!important}
.finlab-unified-links .nav-dropdown-menu a{display:flex!important;align-items:center!important;gap:10px!important;height:44px!important;min-height:44px!important;max-height:44px!important;box-sizing:border-box!important;margin:0!important;padding:0 11px!important;color:#aaa69d!important;text-decoration:none!important;border-radius:10px!important;font:500 13px/1.2 Inter,system-ui,sans-serif!important;letter-spacing:0!important;white-space:nowrap!important}.finlab-unified-links .nav-dropdown-menu a::before,.finlab-unified-links .nav-dropdown-menu a::after{content:none!important;display:none!important}.finlab-unified-links .nav-dropdown-menu .tool-menu-icon{display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 20px!important;width:20px!important;height:20px!important;color:#d0b477!important}.finlab-unified-links .nav-dropdown-menu .tool-menu-icon svg{display:block!important;width:18px!important;height:18px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.6!important;stroke-linecap:round!important;stroke-linejoin:round!important}.finlab-unified-links .nav-dropdown-menu *{box-sizing:border-box!important;max-width:100%!important}
.finlab-unified-links .nav-dropdown-menu a:hover{background:#171613!important;color:#fff!important}
@media(min-width:651px){
 .finlab-unified-header{width:min(1180px,calc(100% - 32px))!important;max-width:1180px!important;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box!important}
 .finlab-unified-links .nav-dropdown-menu{left:auto!important;right:0!important}
}
.finlab-unified-links .nav-dropdown-menu a>.tool-menu-icon:before,.finlab-unified-links .nav-dropdown-menu a>.tool-menu-icon:after{content:none!important;display:none!important}
.finlab-unified-links .nav-dropdown-menu .tool-menu-icon{position:relative!important;display:flex!important;visibility:visible!important;opacity:1!important;flex:0 0 20px!important}

.finlab-search-wrap{flex:0 0 auto!important}
.finlab-search-btn{width:56px!important;height:56px!important;border:1px solid #292824!important;border-radius:50%!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#d0ccc3!important;text-decoration:none!important;font-size:30px!important;line-height:1!important}
.finlab-search-btn:hover{border-color:#403c34!important;color:#fff!important}
.finlab-mobile-nav{display:none!important}
@media(max-width:650px){
 body{padding-bottom:165px!important}
 .finlab-unified-header{margin-top:0!important;padding-top:0!important;min-height:64px!important}
 .finlab-unified-header .brand{font-size:21px!important;letter-spacing:.08em!important}
 .finlab-unified-links{gap:8px!important;justify-content:flex-start!important;overflow:visible!important}
 .finlab-unified-links>a,.finlab-unified-links .nav-dropdown-toggle{height:46px!important;padding:0 10px!important;font-size:11px!important}
 .finlab-unified-links .nav-dropdown-menu{display:none!important}
 .finlab-search-wrap{margin-left:auto!important}
 .finlab-search-btn{width:44px!important;height:44px!important;font-size:24px!important}
 .finlab-mobile-nav{position:fixed!important;left:10px!important;right:10px!important;bottom:12px!important;height:82px!important;min-height:82px!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:0!important;align-items:stretch!important;background:rgba(10,10,9,.97)!important;border:1px solid #403c34!important;border-radius:25px!important;box-shadow:0 18px 55px rgba(0,0,0,.7)!important;z-index:99999!important;overflow:hidden!important;padding:4px!important}
 .finlab-mobile-nav>a,.finlab-mobile-tools{min-width:0!important;width:100%!important;height:72px!important;border:0!important;background:transparent!important;color:#a7a39a!important;text-decoration:none!important;font:9px Inter,system-ui,sans-serif!important;letter-spacing:.06em!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;cursor:pointer!important}
 .finlab-mobile-nav>a:active,.finlab-mobile-tools:active{background:#171613!important;border-radius:16px!important}
 .finlab-mobile-icon{display:flex!important;width:28px!important;height:28px!important;align-items:center!important;justify-content:center!important;color:#c7a96b!important}.finlab-mobile-icon svg{width:22px!important;height:22px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.7!important;stroke-linecap:round!important;stroke-linejoin:round!important}
 .finlab-mobile-nav>a>span:last-child,.finlab-mobile-tools>span:last-child{display:block!important;width:100%!important;height:14px!important;margin:0!important;overflow:visible!important;text-align:center!important;white-space:nowrap!important;color:#a7a39a!important;font-size:9px!important;line-height:14px!important}
 .finlab-mobile-tools-panel{position:fixed!important;left:12px!important;right:12px!important;bottom:102px!important;z-index:100000!important;display:none!important;background:#0c0c0b!important;border:1px solid #3a3832!important;border-radius:18px!important;padding:7px!important;box-shadow:0 20px 50px rgba(0,0,0,.65)!important}
 .finlab-mobile-tools-panel.open{display:block!important}
 .finlab-mobile-tools-panel a{display:block!important;padding:13px!important;color:#aaa69d!important;font:12px Inter,sans-serif!important;text-decoration:none!important;border-bottom:1px solid #24231f!important}
 .finlab-mobile-tools-panel a:last-child{border-bottom:0!important}
}
@media(min-width:651px){.finlab-mobile-tools-panel{display:none!important}}

@media(max-width:650px){
 html,body{max-width:100%;overflow-x:hidden!important}
 .finlab-unified-header{width:100%!important;max-width:100%!important;box-sizing:border-box!important;height:64px!important;min-height:64px!important;padding:0 10px!important;gap:7px!important;overflow:hidden!important;margin:0!important}
 .finlab-unified-header .brand{flex:0 0 auto!important;width:auto!important;min-width:88px!important;font-size:17px!important;letter-spacing:.04em!important;white-space:nowrap!important;overflow:visible!important}
 .finlab-unified-links{flex:1 1 auto!important;min-width:0!important;width:auto!important;gap:4px!important;overflow:hidden!important}
 .finlab-unified-links>a,.finlab-unified-links .nav-dropdown-toggle{flex:0 1 auto!important;min-width:0!important;height:42px!important;padding:0 8px!important;font-size:10px!important;gap:3px!important;white-space:nowrap!important}
 .finlab-unified-links .nav-dropdown-toggle span{display:none!important}
 .finlab-search-wrap{display:none!important}
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
  .finlab-unified-header .nav-dropdown-menu{display:none!important}
  .finlab-unified-header .nav-dropdown.open .nav-dropdown-menu{display:block!important}
}
@media(max-width:650px){
  .finlab-unified-header .finlab-unified-links>a,.finlab-unified-header .finlab-unified-links .nav-dropdown-toggle{height:42px!important;padding:0 8px!important;font-size:10px!important}
  .finlab-unified-header{height:64px!important;min-height:64px!important}
  .finlab-mobile-nav{bottom:12px!important}
}
</style>`;

const designCss=`<style id="finlab-app-design-system">
/* FINLAB APP DESIGN SYSTEM v2 — unmistakable premium app treatment */
:root{
  --fin-gold:#d0b477;
  --fin-gold-bright:#e3ca8b;
  --fin-bg:#080908;
  --fin-panel:#10110f;
  --fin-panel-2:#151613;
  --fin-border:rgba(255,255,255,.09);
  --fin-gold-border:rgba(208,180,119,.34);
  --fin-text:#f3efe7;
  --fin-muted:#9d9a92;
}
html{background:var(--fin-bg)!important}
body{
  background:
    radial-gradient(900px 520px at 80% -8%,rgba(208,180,119,.12),transparent 60%),
    radial-gradient(700px 500px at -12% 45%,rgba(120,145,130,.045),transparent 65%),
    var(--fin-bg)!important;
  color:var(--fin-text)!important;
}
main{position:relative}
main:before{
  content:"";position:absolute;z-index:0;pointer-events:none;inset:0;
  background:linear-gradient(180deg,rgba(208,180,119,.018),transparent 24%,rgba(0,0,0,.08));
}
main>*{position:relative;z-index:1}
.finlab-unified-header{
  background:rgba(8,9,8,.72)!important;
  border:1px solid rgba(255,255,255,.07)!important;
  border-radius:20px!important;
  padding:7px 10px 7px 18px!important;
  box-shadow:0 12px 40px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.035)!important;
  backdrop-filter:blur(18px)!important;
  -webkit-backdrop-filter:blur(18px)!important;
}
.finlab-unified-header .brand{
  color:#f2eee6!important;
  font-weight:800!important;
  letter-spacing:.07em!important;
}
.finlab-unified-header .brand span{color:var(--fin-gold)!important}
.finlab-unified-links>a,.finlab-unified-links .nav-dropdown-toggle{
  height:44px!important;
  border-color:rgba(255,255,255,.07)!important;
  border-radius:12px!important;
  color:#aaa79f!important;
  background:rgba(255,255,255,.015)!important;
  padding:0 16px!important;
  font-size:12px!important;
  transition:all .2s ease!important;
}
.finlab-unified-links>a:hover,.finlab-unified-links .nav-dropdown-toggle:hover{
  color:#fff!important;
  border-color:var(--fin-gold-border)!important;
  background:rgba(208,180,119,.055)!important;
  box-shadow:0 0 22px rgba(208,180,119,.05)!important;
}
.hero{
  padding-top:clamp(70px,9vw,120px)!important;
  padding-bottom:clamp(70px,9vw,110px)!important;
}
.hero:before{
  content:"";position:absolute;pointer-events:none;
  width:700px;height:500px;right:-180px;top:-120px;
  background:radial-gradient(circle,rgba(208,180,119,.12),transparent 68%);
  filter:blur(8px);
}
.hero h1{
  color:#f5f1e9!important;
  letter-spacing:-.035em!important;
  text-shadow:0 0 50px rgba(208,180,119,.09)!important;
}
.hero .eyebrow,.hero .kicker,.hero .label{
  color:var(--fin-gold)!important;
  letter-spacing:.14em!important;
}
.hero p{color:#aaa79f!important}
.section{
  padding-top:clamp(64px,8vw,100px)!important;
  padding-bottom:clamp(64px,8vw,100px)!important;
}
.section>h2{
  color:#f0ece4!important;
  letter-spacing:-.025em!important;
}
.card,.panel,.form,.darkbox,.template,.metric,.scenario,.chart-wrap,.path-guide,.start-card,.topic-detail,.chapter-panel,.thought-card,.reflection-panel,.sim-intro{
  background:linear-gradient(145deg,rgba(22,23,20,.98),rgba(11,12,10,.98))!important;
  border:1px solid var(--fin-border)!important;
  border-radius:20px!important;
  box-shadow:0 20px 65px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.035)!important;
  overflow:hidden!important;
}
.card:before,.panel:before,.form:before,.darkbox:before,.template:before,.metric:before,.scenario:before,.path-guide:before,.start-card:before{
  content:"";position:absolute;left:0;right:0;top:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(208,180,119,.42),transparent)!important;
}
.card:hover,.panel:hover,.template:hover,.start-card:hover,.chapter-card:hover,.path-card:hover{
  border-color:var(--fin-gold-border)!important;
  box-shadow:0 24px 70px rgba(0,0,0,.32),0 0 35px rgba(208,180,119,.045)!important;
}
.chapter-card,.path-card{
  background:linear-gradient(145deg,#151613,#0c0d0b)!important;
  border:1px solid rgba(255,255,255,.085)!important;
  border-radius:20px!important;
  box-shadow:0 18px 55px rgba(0,0,0,.24)!important;
}
.badge,.source-link,.path-guide .badge{
  background:rgba(208,180,119,.065)!important;
  border-color:rgba(208,180,119,.32)!important;
  color:var(--fin-gold-bright)!important;
}
.btn,.calc-btn,.primary,.month-btn,.topic,.lesson-complete,.quiz-check{
  border-radius:12px!important;
  transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease,background .18s ease!important;
}
.btn:hover,.calc-btn:hover,.primary:hover,.month-btn:hover,.topic:hover,.lesson-complete:hover,.quiz-check:hover{
  transform:translateY(-2px)!important;
  box-shadow:0 12px 32px rgba(208,180,119,.09)!important;
}
.calc-btn,.primary{
  background:linear-gradient(135deg,var(--fin-gold-bright),#b99859)!important;
  color:#17140f!important;
  border-color:var(--fin-gold-bright)!important;
  box-shadow:0 8px 24px rgba(208,180,119,.12)!important;
}
input,select,textarea,.field input,.alloc-input,.money-input{
  background:rgba(5,6,5,.88)!important;
  border-color:rgba(255,255,255,.11)!important;
  color:#eee9df!important;
  border-radius:12px!important;
}
input:focus,select:focus,textarea:focus,.field input:focus,.alloc-input:focus,.money-input:focus{
  border-color:rgba(208,180,119,.58)!important;
  box-shadow:0 0 0 3px rgba(208,180,119,.07),0 0 28px rgba(208,180,119,.045)!important;
}
.progress,.progress-track,.xp-track{
  background:rgba(0,0,0,.42)!important;
  border:1px solid rgba(255,255,255,.06)!important;
  box-shadow:inset 0 1px 4px rgba(0,0,0,.55)!important;
}
.progress-bar,.progress-track span{
  background:linear-gradient(90deg,#967746,var(--fin-gold-bright))!important;
  box-shadow:0 0 15px rgba(208,180,119,.28)!important;
}
.platform-strip{
  background:rgba(10,11,9,.82)!important;
  border-top:1px solid rgba(255,255,255,.07)!important;
  border-bottom:1px solid rgba(255,255,255,.07)!important;
}
.paper,.journal{
  background:linear-gradient(145deg,#171814,#0d0e0c)!important;
  color:#f3efe7!important;
  border:1px solid rgba(208,180,119,.24)!important;
  border-radius:22px!important;
  box-shadow:0 28px 80px rgba(0,0,0,.38)!important;
  transform:none!important;
}
.paper p,.journal p{color:#aaa79f!important}
.paper h3,.journal h2{color:#f2eee6!important}
.topic{
  background:rgba(16,17,15,.92)!important;
  border-color:rgba(255,255,255,.08)!important;
}
.topic.active,.topic-detail.active{border-color:rgba(208,180,119,.38)!important}
.result,.metric-value,.scenario-value{color:#f4efe5!important}
.footer{border-color:rgba(255,255,255,.07)!important}
@media(max-width:650px){
  .finlab-unified-header{
    border-radius:16px!important;
    padding:5px 7px!important;
    box-shadow:0 10px 30px rgba(0,0,0,.25)!important;
  }
  .hero{padding-top:54px!important;padding-bottom:62px!important}
  .section{padding-top:54px!important;padding-bottom:54px!important}
  .card,.panel,.form,.darkbox,.template,.metric,.scenario,.path-guide,.start-card,.paper,.journal{border-radius:17px!important}
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
  // Remove legacy tool panels left by older standalone pages. The canonical navigation script recreates one panel when needed.
  h=h.replace(/<div\b[^>]*class=["'][^"']*(?:mobile-tools-panel|finlab-mobile-tools-panel)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,'');
  h=h.replace(/<header\b[\s\S]*?<\/header>/i,header);
  if(!/<header\b/i.test(h)) throw new Error('No header in '+file);
  h=h.replace(/<\/body>/i,mobileNav+'\n'+js+'\n</body>');
  h=h.replace(/<\/head>/i,css+'\n'+designCss+'\n</head>');
  fs.writeFileSync(file,h);
}
console.log('FINLAB navigation normalized on every page');
