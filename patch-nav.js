const fs=require('fs');

const nav='<nav class="navlinks"><a href="/">Home</a><a href="/impara/">Impara</a><div class="nav-dropdown"><button class="nav-dropdown-toggle" type="button" aria-expanded="false">Strumenti <span>⌄</span></button><div class="nav-dropdown-menu"><a href="/strumenti/interesse-composto/">Interesse composto</a><a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href="/strumenti/strategy-lab/">Strategy Lab</a></div></div></nav>';

const css='<style id="finlab-unified-static-nav-css">
.navlinks{display:flex;gap:30px;align-items:center;color:#c5c1b8;font-size:14px}
.navlinks>a,.nav-dropdown{display:inline-flex;align-items:center}
.navlinks a:hover{color:#fff}
.nav-dropdown{position:relative}
.nav-dropdown-toggle{border:0;background:none;color:inherit;font:inherit;cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:7px;line-height:1;min-height:28px}
.nav-dropdown-menu{display:none;position:absolute;right:0;top:calc(100% + 2px);width:260px;background:#10100e;border:1px solid #3a3832;border-radius:14px;box-shadow:0 20px 50px rgba(0,0,0,.45);padding:7px;z-index:1000}
.nav-dropdown.open .nav-dropdown-menu,.nav-dropdown:hover .nav-dropdown-menu,.nav-dropdown:focus-within .nav-dropdown-menu{display:block}
.nav-dropdown-menu a{display:block;padding:12px 13px;color:#aaa69d;font-size:13px;border-bottom:1px solid #24231f;border-radius:9px}
.nav-dropdown-menu a:hover{color:#fff;background:#181714}
.mobile-tools-trigger,.finlab-mobile-tools{border:0;background:transparent;cursor:pointer}
@media(max-width:850px){
  body{padding-bottom:112px!important}
  .mobile-nav,.finlab-mobile-nav{
    position:fixed!important;left:10px!important;right:10px!important;bottom:10px!important;
    z-index:99999!important;display:grid!important;grid-template-columns:repeat(4,1fr)!important;
    gap:4px!important;padding:6px!important;background:rgba(9,9,8,.97)!important;
    border:1px solid #403c34!important;border-radius:22px!important;
    box-shadow:0 18px 55px rgba(0,0,0,.7)!important;
  }
  .mobile-nav>a,.mobile-nav>button,.finlab-mobile-nav>a,.finlab-mobile-nav>button{
    min-width:0!important;width:100%!important;min-height:50px!important;border:0!important;
    border-radius:16px!important;background:transparent!important;color:#aaa69d!important;
    text-decoration:none!important;font:10px Inter,system-ui,sans-serif!important;
    display:flex!important;flex-direction:column!important;align-items:center!important;
    justify-content:center!important;gap:4px!important;padding:6px!important;cursor:pointer!important;
  }
  .mobile-nav>a:active,.mobile-nav>button:active,.finlab-mobile-nav>a:active,.finlab-mobile-nav>button:active{
    background:#171613!important;color:#fff!important
  }
  .mobile-icon,.finlab-mobile-icon,.app-nav-icon{font-size:22px!important;line-height:22px!important;color:#c7a96b!important}
  .mobile-tools-panel,.finlab-mobile-tools-panel{
    position:fixed!important;left:12px!important;right:12px!important;bottom:86px!important;
    z-index:99998!important;display:none;background:#0c0c0b!important;
    border:1px solid #3a3832!important;border-radius:18px!important;padding:7px!important;
    box-shadow:0 20px 50px rgba(0,0,0,.65)!important
  }
  .mobile-tools-panel.open,.finlab-mobile-tools-panel.open{display:block!important}
  .mobile-tools-panel a,.finlab-mobile-tools-panel a{
    display:block!important;padding:13px!important;color:#aaa69d!important;
    font-size:12px!important;border-bottom:1px solid #24231f!important;text-decoration:none!important
  }
  .mobile-tools-panel a:last-child,.finlab-mobile-tools-panel a:last-child{border-bottom:0!important}
}
@media(min-width:851px){.mobile-nav,.finlab-mobile-nav,.mobile-tools-panel,.finlab-mobile-tools-panel{display:none!important}}
</style>';

const js='<script id="finlab-unified-static-nav-js">
(()=> {
  document.querySelectorAll(".nav-dropdown").forEach(d=>{
    const b=d.querySelector(".nav-dropdown-toggle");
    b?.addEventListener("click",e=>{
      e.stopPropagation();
      const open=d.classList.toggle("open");
      b.setAttribute("aria-expanded",String(open));
      document.querySelectorAll(".nav-dropdown").forEach(x=>{if(x!==d)x.classList.remove("open")});
    });
  });

  document.querySelectorAll(".mobile-nav,.finlab-mobile-nav").forEach(mobile=>{
    let tools=[...mobile.children].find(x=>x.textContent?.trim()==="Strumenti");
    if(tools && tools.tagName!=="BUTTON"){
      const b=document.createElement("button");
      b.className=tools.className||"mobile-tools-trigger";
      b.type="button";
      b.innerHTML=tools.innerHTML;
      tools.replaceWith(b);
      tools=b;
    }
    if(!tools){
      const b=document.createElement("button");
      b.className="mobile-tools-trigger";
      b.type="button";
      b.innerHTML='<span class="mobile-icon">⌘</span><span>Strumenti</span>';
      mobile.appendChild(b);
      tools=b;
    }

    if(![...mobile.children].some(x=>x.textContent?.trim()==="Cerca")){
      const search=document.createElement("a");
      search.href="/impara/#lessonSearch";
      search.innerHTML='<span class="mobile-icon">⌕</span><span>Cerca</span>';
      mobile.appendChild(search);
    }

    let panel=document.querySelector(".mobile-tools-panel,.finlab-mobile-tools-panel");
    if(!panel){
      panel=document.createElement("div");
      panel.className="mobile-tools-panel";
      panel.innerHTML='<a href="/strumenti/interesse-composto/">Interesse composto</a><a href="/strumenti/emergency-fund/">Emergency Fund Planner</a><a href="/strumenti/portfolio-analyzer/">Portfolio Analyzer</a><a href="/strumenti/strategy-lab/">Strategy Lab</a>';
      document.body.appendChild(panel);
    }
    tools.addEventListener("click",e=>{
      e.stopPropagation();
      const open=panel.classList.toggle("open");
      tools.setAttribute("aria-expanded",String(open));
    });
  });

  document.addEventListener("click",()=>{
    document.querySelectorAll(".nav-dropdown").forEach(d=>d.classList.remove("open"));
    document.querySelectorAll(".mobile-tools-panel,.finlab-mobile-tools-panel").forEach(p=>p.classList.remove("open"));
  });
})();
</script>';

for(const file of [
  'strumenti/emergency-fund/index.html',
  'strumenti/index.html',
  'strumenti/interesse-composto/index.html',
  'strumenti/strategy-lab/index.html',
  'strumenti/portfolio-analyzer/index.html'
]){
  if(!fs.existsSync(file)) continue;
  let h=fs.readFileSync(file,'utf8');
  h=h.replace(/<nav\b[^>]*class=["'][^"']*navlinks[^"']*["'][^>]*>[\s\S]*?<\/nav>/i,nav);
  if(!h.includes('id="finlab-unified-static-nav-css"')) h=h.replace('</head>',css+'</head>');
  if(!h.includes('id="finlab-unified-static-nav-js"')) h=h.replace('</body>',js+'</body>');
  fs.writeFileSync(file,h);
}

console.log('FINLAB unified navigation patch complete');
