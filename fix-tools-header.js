const fs=require('fs');
const files=['strumenti/emergency-fund/index.html','strumenti/strategy-lab/index.html'];
const css=`<style id="finlab-tools-header-alignment-fix">
/* Keep the tool-page top navigation aligned with the shared FINLAB header. */
@media(min-width:651px){
  .finlab-unified-header .finlab-unified-links{
    margin-left:clamp(24px,3vw,44px)!important;
    transform:translateX(clamp(8px,1.2vw,18px));
  }
}
@media(max-width:650px){
  .finlab-unified-header .finlab-unified-links{margin-left:0!important;transform:none!important}
}
</style>`;
for(const file of files){
 if(!fs.existsSync(file)) continue;
 let h=fs.readFileSync(file,'utf8');
 h=h.replace(/<style\\b[^>]*id=["']finlab-tools-header-alignment-fix["'][^>]*>[\\s\\S]*?<\\/style>/gi,'');
 h=h.replace(/<\\/head>/i,css+'\\n</head>');
 fs.writeFileSync(file,h);
}
console.log('FINLAB tool-page header alignment fixed');
