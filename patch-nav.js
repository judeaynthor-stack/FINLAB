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

const mobileNav='<nav aria-label="Navigazione mobile" class="finlab-unified-mobile"><a href="/"><span class="finlab-mobile-icon">⌂</span><span>Home</span></a><a href="/impara/"><span class="finlab-mobile-icon">▤</span><span>Impara</span></a><button class="finlab-mobile-tools" type="button" aria-expanded="false"><span class="finlab-mobile-icon">⚙</span><span>Strumenti</span></button><a href="/impara/#lessonSearch"><span class="finlab-mobile-icon">⌕</span><span>Cerca</span></a></nav>';

const css='<style id="finlab-unified-navigation-final">
/* FINLAB navigation: one identical mobile and desktop shell on every page. */
.finlab-unified-header .finlab-unified-links{display:flex!important;align-items:center!important;gap:30px!important}
.finlab-unified-header .finlab-unified-links>a,.finlab-unified-header .nav-dropdown{display:inline-flex!important;align-items:center!important}
.finlab-unified-header .nav-dropdown{position:relative!important}
.finlab-unified-header .nav-dropdown-menu{display:none!important;position:absolute!important;right:0!important;top:calc(100% + 6px)!important;width:260px!important;background:#10100e!important;border:1px solid #3a3832!important;border-radius:14px!important;padding:7px!important;z-index:10000!important;box-shadow:0 20px 50px rgba(0,0,0,.45)!important}
.finlab-unified-header .nav-dropdown.open .nav-dropdown-menu,.finlab-unified-header .nav-dropdown:hover .nav-dropdown-menu,.finlab-unified-header .nav-dropdown:focus-within .nav-dropdown-menu{display:block!important}
.finlab-unified-header .nav-dropdown-menu a{display:block!important;padding:12px 13px!important;color:#aaa69d!important;font-size:13px!important;text-decoration:none!important;border-radius:9px!important}
.finlab-unified-header .nav-dropdown-menu a:hover{color:#fff!important;background:#181714!important}
.finlab-unified-mobile{display:none}
@media(max-width:850px){
  body{padding-bottom:104px!important}
  .finlab-unified-mobile{
    position:fixed!important;left:10px!important;right:10px!important;bottom:10px!important;
    width:auto!important;height:82px!important;min-height:82px!important;
    display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;
    gap:0!important;margin:0!important;padding:4px!important;box-sizing:border-box!important;
    overflow:hidden!important;visibility:visible!important;opacity:1!important;
    z-index:99999!important;background:#090908!important;border:1px solid #403c34!important;
    border-radius:22px!important;box-shadow:0 18px 55px rgba(0,0,0,.7)!important;
  }
  .finlab-unified-mobile>a,.finlab-unified-mobile>button{
    position:static!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
    width:100%!important;min-width:0!important;max-width:none!important;height:72px!important;min-height:72px!important;
    margin:0!important;padding:4px 1px!important;box-sizing:border-box!important;
    border:0!important;border-radius:16px!important;background:transparent!important;
    color:#aaa69d!important;text-decoration:none!important;font-family:Inter,sans-serif!important;font-size:9px!important;
    line-height:14px!important;display:flex!important;flex-direction:column!important;
    align-items:center!important;justify-content:center!important;gap:3px!important;cursor:pointer!important;
  }
  .finlab-unified-mobile .finlab-mobile-icon{
    display:flex!important;width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;
    align-items:center!important;justify-content:center!important;color:var(--gold,#c7a96b)!important;
    font-family:Arial,sans-serif!important;font-size:23px!important;line-height:28px!important;
  }
  .finlab-unified-mobile>button{appearance:none!important;-webkit-appearance:none!important}
  .finlab-unified-mobile>button>span:last-child,.finlab-unified-mobile>a>span:last-child{
    display:block!important;width:100%!important;height:14px!important;margin:0!important;
    overflow:visible!important;text-align:center!important;white-space:nowrap!important;
    color:#a7a39a!important;font-family:Inter,sans-serif!important;font-size:9px!important;line-height:14px!important;
  }
  .finlab-unified-mobile>button:active,.finlab-unified-mobile>a:active{background:#171613!important}
  .finlab-mobile-tools-panel{
    position:fixed!important;left:12px!important;right:12px!important;bottom:102px!important;
    z-index:100000!important;display:none!important;background:#0c0c0b!important;border:1px solid #3a3832!important;
    border-radius:18px!important;padding:7px!important;box-shadow:0 20px 50px rgba(0,0,0,.65)!important;
  }
  .finlab-mobile-tools-panel.open{display:block!important}
  .finlab-mobile-tools-panel a{display:block!important;padding:13px!important;color:#aaa69d!important;
    font:12px Inter,sans-serif!important;text-decoration:none!important;border-bottom:1px solid #24231f!important}
  .finlab-mobile-tools-panel a:last-child{border-bottom:0!important}
  .finlab-unified-header .navlinks{display:none!important}
}
@media(min-width:851px){.finlab-unified-mobile,.finlab-mobile-tools-panel{display:none!important}}
</style>';

const js='<script id="finlab-unified-navigation-final-js">
(()=>{const header=document.querySelector(".finlab-unified-header");const dropdown=header?.querySelector(".nav-dropdown");const db=dropdown?.querySelector("button");db?.addEventListener("click",e=>{e.stopPropagation();const open=dropdown.classList.toggle("open");db.setAttribute("aria-expanded",String(open))});document.addEventListener("click",()=>{if(dropdown){dropdown.classList.remove("open");db?.setAttribute("aria-expanded","false")}});const nav=document.querySelector(".finlab-unified-mobile");if(!nav)return;let panel=document.querySelector(".finlab-mobile-tools-panel");if(!panel){panel=document.createElement("div");panel.className="finlab-mobile-tools-panel";panel.innerHTML='<a href="/strumenti/interesse-composto/">Interesse composto</a><a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href="/strumenti/strategy-lab/">Strategy Lab</a>';document.body.appendChild(panel)}const tb=nav.querySelector(".finlab-mobile-tools");tb?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const open=panel.classList.toggle("open");tb.setAttribute("aria-expanded",String(open))});panel.addEventListener("click",e=>e.stopPropagation());document.addEventListener("click",()=>{panel.classList.remove("open");tb?.setAttribute("aria-expanded","false")})})();
</script>';

for(const file of files){
  if(!fs.existsSync(file))continue;
  let h=fs.readFileSync(file,'utf8');
  h=h.replace(/<nav\b[^>]*class=["'][^"']*navlinks[^"']*["'][^>]*>[\s\S]*?<\/nav>/i,desktopNav);
  h=h.replace(/<nav\b[^>]*(?:id=["']appNav["']|class=["'][^"']*(?:mobile-nav|finlab-mobile-nav|app-nav)[^"']*["'])[^>]*>[\s\S]*?<\/nav>/i,mobileNav);
  if(!h.includes('id="finlab-unified-navigation-final"'))h=h.replace('</head>',css+'</head>');
  if(!h.includes('id="finlab-unified-navigation-final-js"'))h=h.replace('</body>',js+'</body>');
  fs.writeFileSync(file,h);
}
console.log('FINLAB final navigation normalized on all pages');