const fs=require('fs');

const files=[
  'strumenti/emergency-fund/index.html',
  'strumenti/strategy-lab/index.html',
  'strumenti/portfolio-analyzer/index.html'
];

const css=`<style id="finlab-tools-header-final-fix">
/* Final alignment for the shared tool header. */
.finlab-unified-header{
  width:min(1180px,calc(100% - 32px))!important;
  max-width:1180px!important;
  height:76px!important;
  min-height:76px!important;
  margin:0 auto!important;
  padding:7px 10px 7px 18px!important;
  position:relative!important;
  top:0!important;
  left:auto!important;
  right:auto!important;
  transform:none!important;
  clear:both!important;
  box-sizing:border-box!important;
}
.finlab-unified-header .finlab-unified-links{
  flex:1 1 auto!important;
  justify-content:center!important;
  margin-left:clamp(24px,4vw,72px)!important;
  margin-right:0!important;
  transform:none!important;
}
@media(max-width:650px){
  .finlab-unified-header{
    width:100%!important;
    max-width:100%!important;
    height:64px!important;
    min-height:64px!important;
    margin:0!important;
    padding:0 10px!important;
    position:relative!important;
    top:0!important;
    left:auto!important;
    right:auto!important;
    transform:none!important;
    gap:7px!important;
    overflow:hidden!important;
    box-sizing:border-box!important;
  }
  .finlab-unified-header .brand{
    flex:0 0 auto!important;
    width:auto!important;
    min-width:0!important;
    overflow:visible!important;
    white-space:nowrap!important;
  }
  .finlab-unified-header .finlab-unified-links{
    flex:1 1 auto!important;
    min-width:0!important;
    justify-content:flex-end!important;
    gap:5px!important;
    margin-left:auto!important;
    margin-right:0!important;
    transform:none!important;
    overflow:visible!important;
  }
  .finlab-unified-links>a,
  .finlab-unified-links .nav-dropdown-toggle{
    flex:0 1 auto!important;
    min-width:0!important;
    padding-left:9px!important;
    padding-right:9px!important;
    height:42px!important;
    font-size:11px!important;
  }
}
@media(max-width:380px){
  .finlab-unified-header{padding-left:8px!important;padding-right:8px!important;gap:5px!important}
  .finlab-unified-links{gap:2px!important}
  .finlab-unified-links>a,
  .finlab-unified-links .nav-dropdown-toggle{padding-left:6px!important;padding-right:6px!important;font-size:9px!important}
}
.finlab-beta-badge{
  display:inline-flex!important;
  align-items:center!important;
  margin-left:9px!important;
  padding:4px 8px!important;
  border:1px solid rgba(208,180,119,.55)!important;
  border-radius:999px!important;
  color:var(--gold,#d0b477)!important;
  font:800 9px/1 Inter,system-ui,sans-serif!important;
  letter-spacing:.12em!important;
  vertical-align:middle!important;
}
@media(max-width:650px){
  .finlab-beta-badge{font-size:8px!important;padding:4px 7px!important;margin-left:7px!important}
}

/* Hard reset for any legacy tool-page dropdown markup. */
.finlab-unified-header .nav-dropdown{position:relative!important;display:inline-flex!important;align-items:center!important}
.finlab-unified-header .nav-dropdown-menu{display:none!important;position:absolute!important;right:0!important;top:calc(100% + 8px)!important;width:270px!important;height:auto!important;min-height:0!important;max-height:250px!important;overflow:auto!important;padding:7px!important;margin:0!important;background:#0d0d0c!important;border:1px solid #39362f!important;border-radius:16px!important;box-shadow:0 20px 50px rgba(0,0,0,.55)!important;z-index:1300!important;box-sizing:border-box!important}
.finlab-unified-header .nav-dropdown.open>.nav-dropdown-menu{display:block!important}
.finlab-unified-header .nav-dropdown-menu a{display:flex!important;align-items:center!important;height:44px!important;min-height:44px!important;max-height:44px!important;margin:0!important;padding:0 13px!important;background:transparent!important;border:0!important;border-radius:10px!important;color:#aaa69d!important;text-decoration:none!important;font:500 13px/1.2 Inter,system-ui,sans-serif!important;white-space:nowrap!important;box-sizing:border-box!important}
.finlab-unified-header .nav-dropdown-menu a:hover{background:#171613!important;color:#fff!important}
@media(max-width:650px){
 .finlab-unified-header .nav-dropdown-menu{display:none!important}
 .finlab-unified-header .nav-dropdown.open>.nav-dropdown-menu{display:block!important;position:fixed!important;left:12px!important;right:12px!important;bottom:104px!important;top:auto!important;width:auto!important;max-height:none!important}
 .finlab-unified-header .finlab-unified-links{overflow:visible!important}
}
</style>`;

for(const file of files){
  if(!fs.existsSync(file)) continue;
  let h=fs.readFileSync(file,'utf8');
  // Remove legacy mobile tools panels left by older page versions.
  h=h.replace(/<div\b[^>]*class=["'][^"']*(?:mobile-tools-panel|finlab-mobile-tools-panel)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,'');

  h=h.replace(/<style\b[^>]*id=["']finlab-tools-header-final-fix["'][^>]*>[\s\S]*?<\/style>/gi,'');
  h=h.replace(/<style\b[^>]*id=["']finlab-tools-header-alignment-fix["'][^>]*>[\s\S]*?<\/style>/gi,'');

  h=h.replace(/<\/head>/i,css+'\n</head>');

  if(file.includes('strategy-lab')){
    h=h.replace(/<title>FINLAB — Strategy Lab(?: \(Beta\))?<\/title>/i,'<title>FINLAB — Strategy Lab (Beta)</title>');
    h=h.replace(/>STRATEGY LAB(?:\s*\(BETA\))?<\/div>/i,'>STRATEGY LAB <span class="finlab-beta-badge">BETA</span></div>');
  }

  if(file.includes('portfolio-analyzer')){
    h=h.replace(/<title>FINLAB — Portfolio Analyzer(?: \(Beta\))?<\/title>/i,'<title>FINLAB — Portfolio Analyzer (Beta)</title>');
    h=h.replace(/>02 — PORTFOLIO ANALYZER(?:\s*\(BETA\))?<\/div>/i,'>02 — PORTFOLIO ANALYZER <span class="finlab-beta-badge">BETA</span></div>');
    h=h.replace(/<h1>Portfolio Analyzer(?: \(Beta\))?\.<\/h1>/i,'<h1>Portfolio Analyzer (Beta).</h1>');
  }

  fs.writeFileSync(file,h);
}
console.log('FINLAB final tool header alignment + BETA labels applied');
