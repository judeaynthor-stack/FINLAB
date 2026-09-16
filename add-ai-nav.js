const fs = require('fs');

const pages = ['index.html', 'impara/index.html', 'simulatore/index.html'];

for (const file of pages) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');

  html = html.replace(
    /(<nav\b[^>]*class=["'][^"']*navlinks[^"']*["'][^>]*>)([\s\S]*?)(<\/nav>)/i,
    (match, open, body, close) => body.includes('href="/ai/"') ? match : `${open}${body}<a href="/ai/">AI</a>${close}`
  );

  html = html.replace(
    /(<nav\b[^>]*id=["']appNav["'][^>]*>)([\s\S]*?)(<\/nav>)/i,
    (match, open, body, close) => body.includes('href="/ai/"') ? match : `${open}${body}<a href="/ai/"><span class="app-nav-icon">✦</span><span>AI</span></a>${close}`
  );

  fs.writeFileSync(file, html);
}

console.log('FINLAB: AI navigation added to generated pages.');
