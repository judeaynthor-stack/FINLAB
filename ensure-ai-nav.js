const fs = require('fs');

const pages = ['index.html', 'impara/index.html', 'simulatore/index.html'];

for (const file of pages) {
  if (!fs.existsSync(file)) continue;

  let html = fs.readFileSync(file, 'utf8');

  if (!html.includes('href="/ai/"')) {
    html = html.replace(
      /(<a\s+href="\/simulatore\/">Simula<\/a>)/i,
      '$1<a href="/ai/">AI</a>'
    );
  }

  if (!html.includes('href="/ai/"')) {
    html = html.replace(
      /(<nav\b[^>]*>)([\s\S]*?)(<\/nav>)/i,
      '$1$2<a href="/ai/">AI</a>$3'
    );
  }

  fs.writeFileSync(file, html);
}

console.log('FINLAB: AI navigation verified on generated pages.');
