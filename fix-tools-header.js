const fs=require('fs');

const files=[
  'strumenti/emergency-fund/index.html',
  'strumenti/strategy-lab/index.html',
  'strumenti/portfolio-analyzer/index.html'
];

const css=`<style id="finlab-tools-header-final-fix">
/* Final alignment for the shared tool header. */
.finlab-unified-header{
  width:min(1180px,calc(100% - 24px))!important;
  margin-left:auto!important;
  margin-right:auto!important;
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
    padding-left:14px!important;
    padding-right:14px!important;
    gap:8px!important;
    overflow:hidden!important;
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
</style>`;

for(const file of files){
  if(!fs.existsSync(file)) continue;
  let h=fs.readFileSync(file,'utf8');

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
