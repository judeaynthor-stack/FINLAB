const fs=require('fs');

const files=[
  'strumenti/emergency-fund/index.html',
  'strumenti/index.html',
  'strumenti/strategy-lab/index.html'
];

const desktopNav='<nav class="navlinks"><a href="/">Home</a><a href="/impara/">Impara</a><div class="nav-dropdown"><button class="nav-dropdown-toggle" type="button" aria-expanded="false">Strumenti <span>⌄</span></button><div class="nav-dropdown-menu"><a href="/strumenti/interesse-composto/">Interesse composto</a><a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href="/strumenti/strategy-lab/">Strategy Lab</a></div></div></nav>';

const mobileNav='<nav aria-label="Navigazione mobile" class="mobile-nav finlab-mobile-nav"><a href="/"><span class="mobile-icon">⌂</span><span>Home</span></a><a href="/impara/"><span class="mobile-icon">▤</span><span>Impara</span></a><button class="mobile-tools-trigger finlab-mobile-tools" type="button" aria-expanded="false"><span class="mobile-icon">⌘</span><span>Strumenti</span></button><a href="/impara/#lessonSearch"><span class="mobile-icon">⌕</span><span>Cerca</span></a></nav>';

const css='<style id="finlab-static-nav-fix">@media(max-width:850px){.mobile-nav,.finlab-mobile-nav{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:4px!important;position:fixed!important;left:8px!important;right:8px!important;bottom:8px!important;z-index:1100!important;padding:6px!important;background:rgba(9,9,8,.96)!important;border:1px solid #403c34!important;border-radius:22px!important;box-shadow:0 18px 55px rgba(0,0,0,.7)!important}.mobile-nav>a,.mobile-nav>button,.finlab-mobile-nav>a,.finlab-mobile-nav>button{min-height:46px!important;border:0!important;border-radius:16px!important;background:transparent!important;color:#aaa69d!important;text-decoration:none!important;font:9px Inter!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;padding:6px!important}.mobile-nav span:last-child,.finlab-mobile-nav span:last-child{font:9px Inter!important;line-height:14px!important;color:#aaa69d!important}}@media(min-width:851px){.mobile-nav,.finlab-mobile-nav{display:none!important}}</style>';

for(const file of files){
  if(!fs.existsSync(file))continue;
  let h=fs.readFileSync(file,'utf8');
  h=h.replace(/<nav\b[^>]*class=["'][^"']*navlinks[^"']*["'][^>]*>[\s\S]*?<\/nav>/i,desktopNav);
  h=h.replace(/<nav\b[^>]*class=["'][^"']*(?:mobile-nav|finlab-mobile-nav)[^"']*["'][^>]*>[\s\S]*?<\/nav>/i,mobileNav);
  if(!h.includes('id="finlab-static-nav-fix"'))h=h.replace('</head>',css+'</head>');
  fs.writeFileSync(file,h);
}
console.log('FINLAB static navigation fixed');