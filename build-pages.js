const fs = require('fs');

// FINLAB static build helper.
// The generated HTML pages are already committed in the repository. This build
// step only applies the shared navigation enhancement so Vercel can deploy
// without depending on the old page-generation parser.

const desktopTools = `
<div class="nav-dropdown">
  <button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true">
    Strumenti <span aria-hidden="true">⌄</span>
  </button>
  <div class="nav-dropdown-menu" role="menu">
    <a href="/strumenti/emergency-fund/" role="menuitem">Emergency Fund Planner</a>
    <a href="/strumenti/portfolio-analyzer/" role="menuitem">Portfolio Analyzer</a>
    <a href="/strumenti/strategy-lab/" role="menuitem">Strategy Lab</a>
  </div>
</div>`;

const desktopCss = `<style id="finlab-tools-nav-style">
.nav-dropdown{position:relative;display:inline-flex;align-items:center}
.nav-dropdown-toggle{appearance:none;border:0;background:transparent;color:inherit;font:inherit;cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:6px}
.nav-dropdown-toggle span{font-size:12px;color:var(--gold);transition:transform .2s ease}
.nav-dropdown.open .nav-dropdown-toggle span{transform:rotate(180deg)}
.nav-dropdown-menu{position:absolute;right:0;top:calc(100% + 16px);width:245px;background:#11110f;border:1px solid #35332e;box-shadow:0 18px 45px #0009;padding:7px;display:none;z-index:1000}
.nav-dropdown.open .nav-dropdown-menu{display:block;animation:finlabDrop .18s ease both}
.nav-dropdown-menu a{display:block;padding:12px 13px;color:#aaa69d;font-size:13px;border-bottom:1px solid #24231f}
.nav-dropdown-menu a:last-child{border-bottom:0}
.nav-dropdown-menu a:hover{color:#fff;background:#171613}
@keyframes finlabDrop{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:650px){.nav-dropdown-menu{position:fixed;right:12px;top:72px;width:min(290px,calc(100vw - 24px))}}
</style>`;

const mobileCss = `<style id="finlab-tools-mobile-style">
#appNav .finlab-mobile-tools{cursor:pointer}
</style>`;

const script = `<script id="finlab-tools-nav-script">
(function(){
  const dropdowns=document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(drop=>{
    const btn=drop.querySelector('.nav-dropdown-toggle');
    if(!btn)return;
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      const open=drop.classList.toggle('open');
      btn.setAttribute('aria-expanded',String(open));
    });
    document.addEventListener('click',function(e){
      if(!drop.contains(e.target)){
        drop.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){
        drop.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
      }
    });
  });
})();
</script>`;

function enhance(file, mobile=false){
  if(!fs.existsSync(file)) return;
  let html=fs.readFileSync(file,'utf8');
  html=html.replace(/<style id="finlab-tools-nav-style">[\s\S]*?<\/style>/i,'');
  html=html.replace(/<style id="finlab-tools-mobile-style">[\s\S]*?<\/style>/i,'');
  html=html.replace(/<script id="finlab-tools-nav-script">[\s\S]*?<\/script>/i,'');

  html=html.replace(/(<nav\b[^>]*class=["'][^"']*navlinks[^"']*["'][^>]*>)([\s\S]*?)(<\/nav>)/i,(m,open,body,close)=>{
    if(body.includes('class="nav-dropdown"')) return m;
    const tools=desktopTools;
    return open + body.replace(/<a\s+href=["']\/simulatore\/["'][^>]*>\s*Simula\s*<\/a>/i, x=>x+tools) + close;
  });

  html=html.replace(/<\/head>/i,desktopCss+mobileCss+'\n</head>');
  html=html.replace(/<\/body>/i,script+'\n</body>');
  fs.writeFileSync(file,html);
}

enhance('index.html');
enhance('impara/index.html');
enhance('simulatore/index.html');
console.log('FINLAB: shared Strumenti dropdown applied.');
