const fs = require('fs');

const pages = ['index.html', 'impara/index.html', 'simulatore/index.html'];

for (const file of pages) {
  if (!fs.existsSync(file)) continue;

  let html = fs.readFileSync(file, 'utf8');

  // The generated pages have a desktop nav containing the Simula link.
  // Insert AI immediately after it so the link is deterministic.
  if (!html.includes('href="/ai/"')) {
    html = html.replace(
      /(<a\s+href="\/simulatore\/">Simula<\/a>)/i,
      '$1<a href="/ai/">AI</a>'
    );
  }

  // Also support the mobile navigation if present.
  if (!html.includes('href="/ai/"')) {
    html = html.replace(
      /(<nav\b[^>]*id=["']appNav["'][^>]*>)([\s\S]*?)(<\/nav>)/i,
      '$1$2<a href="/ai/"><span class="app-nav-icon">✦</span><span>AI</span></a>$3'
    );
  }

  fs.writeFileSync(file, html);
}

console.log('FINLAB: AI navigation added to generated pages.');
