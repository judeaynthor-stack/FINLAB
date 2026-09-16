const fs = require('fs');

// FINLAB static build helper.
// The generated HTML pages are committed in the repository. This build step
// applies the shared Tools navigation to the desktop header and the mobile
// bottom navigation before Vercel serves the static files.

const desktopTools = `
<div class="nav-dropdown">
  <button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true">
    Strumenti <span aria-hidden="true">⌄</span>
  </button>
  <div class="nav-dropdown-menu" role="menu">
    <a href="/strumenti/emergency-fund/" role="menuitem">Emergency Fund Planner</a>
    <span class="nav-dropdown-disabled" role="menuitem" aria-disabled="true">Portfolio Analyzer <small>Prossimamente</small></span>
    <span class="nav-dropdown-disabled" role="menuitem" aria-disabled="true">Strategy Lab <small>Prossimamente</small></span>
  </div>
</div>`;

const desktopCss = `<style id="finlab-tools-nav-style">
.nav-dropdown{position:relative;display:inline-flex;align-items:center}
.nav-dropdown-toggle{appearance:none;border:0;background:transparent;color:inherit;font:inherit;cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:6px}
.nav-dropdown-toggle span{font-size:12px;color:var(--gold);transition:transform .2s ease}
.nav-dropdown.open .nav-dropdown-toggle span{transform:rotate(180deg)}
.nav-dropdown-menu{position:absolute;right:0;top:calc(100% + 14px);width:245px;background:#11110f;border:1px solid #35332e;box-shadow:0 18px 45px #0009;padding:7px;display:none;z-index:1000}
.nav-dropdown.open .nav-dropdown-menu{display:block;animation:finlabDrop .18s ease both}
.nav-dropdown-menu a,.nav-dropdown-disabled{display:block;padding:12px 13px;color:#aaa69d;font-size:13px;border-bottom:1px solid #24231f}
.nav-dropdown-menu a:last-child,.nav-dropdown-disabled:last-child{border-bottom:0}
.nav-dropdown-menu a:hover{color:#fff;background:#171613}
.nav-dropdown-disabled{color:#68645d!important;cursor:default}
.nav-dropdown-disabled small{float:right;color:#4f4b45;font-size:9px;text-transform:uppercase;letter-spacing:.08em;padding-top:2px}
@keyframes finlabDrop{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
</style>`;

const mobileCss = `<style id="finlab-tools-mobile-style">
@media(max-width:650px){
  #appNav{grid-template-columns:repeat(5,1fr)!important}
  #appNav .finlab-mobile-tools{cursor:pointer;position:relative}
  #appNav .finlab-mobile-tools .app-nav-icon{font-size:15px}
  .mobile-tools-panel{position:fixed;left:12px;right:12px;bottom:82px;z-index:1100;background:#11110f;border:1px solid #35332e;box-shadow:0 18px 45px #0009;padding:7px;display:none}
  .mobile-tools-panel.open{display:block;animation:finlabDrop .18s ease both}
  .mobile-tools-panel a,.mobile-tools-panel .mobile-tool-disabled{display:block;padding:12px 13px;color:#aaa69d;font-size:12px;border-bottom:1px solid #24231f}
  .mobile-tools-panel a:last-child,.mobile-tools-panel .mobile-tool-disabled:last-child{border-bottom:0}
  .mobile-tools-panel a:active{color:#fff;background:#171613}
  .mobile-tools-panel .mobile-tool-disabled{color:#68645d}
  .mobile-tools-panel .mobile-tool-disabled small{float:right;color:#4f4b45;font-size:9px;text-transform:uppercase;letter-spacing:.08em;padding-top:2px}
}
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
  });

  const mobileNav=document.querySelector('#appNav');
  if(mobileNav && !mobileNav.querySelector('.finlab-mobile-tools')){
    const toolsLink=document.createElement('a');
    toolsLink.href='#';
    toolsLink.className='finlab-mobile-tools';
    toolsLink.setAttribute('aria-expanded','false');
    toolsLink.setAttribute('aria-controls','mobileToolsPanel');
    toolsLink.innerHTML='<span class="app-nav-icon">⌘</span><span>Strumenti</span>';
    mobileNav.insertBefore(toolsLink,mobileNav.lastElementChild);

    const panel=document.createElement('div');
    panel.className='mobile-tools-panel';
    panel.id='mobileToolsPanel';
    panel.setAttribute('aria-label','Strumenti');
    panel.innerHTML='<a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><span class="mobile-tool-disabled">Portfolio Analyzer <small>Prossimamente</small></span><span class="mobile-tool-disabled">Strategy Lab <small>Prossimamente</small></span>';
    document.body.appendChild(panel);

    toolsLink.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      const open=panel.classList.toggle('open');
      toolsLink.setAttribute('aria-expanded',String(open));
    });
    panel.addEventListener('click',function(e){e.stopPropagation()});
    document.addEventListener('click',function(e){
      if(!panel.contains(e.target) && !toolsLink.contains(e.target)){
        panel.classList.remove('open');
        toolsLink.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){
        panel.classList.remove('open');
        toolsLink.setAttribute('aria-expanded','false');
      }
    });
  }
})();
</script>`;

function enhance(file){
  if(!fs.existsSync(file)) return;
  let html=fs.readFileSync(file,'utf8');

  html=html.replace(/<style id="finlab-tools-nav-style">[\s\S]*?<\/style>/i,'');
  html=html.replace(/<style id="finlab-tools-mobile-style">[\s\S]*?<\/style>/i,'');
  html=html.replace(/<script id="finlab-tools-nav-script">[\s\S]*?<\/script>/i,'');

  html=html.replace(/(<nav\b[^>]*class=["'][^"']*navlinks[^"']*["'][^>]*>)([\s\S]*?)(<\/nav>)/i,(m,open,body,close)=>{
    if(body.includes('class="nav-dropdown"')) return m;
    const injected=body.replace(/<a\s+href=["']\/simulatore\/["'][^>]*>[\s\S]*?<\/a>/i, x=>x+desktopTools);
    return open+injected+close;
  });

  html=html.replace(/<\/head>/i,desktopCss+mobileCss+'\n</head>');
  html=html.replace(/<\/body>/i,script+'\n</body>');
  fs.writeFileSync(file,html);
}

enhance('index.html');
enhance('impara/index.html');
enhance('simulatore/index.html');
console.log('FINLAB: desktop + mobile Strumenti navigation applied.');
