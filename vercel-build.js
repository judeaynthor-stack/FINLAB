const fs = require('fs');
const path = require('path');

const pages = [
  'index.html',
  'impara/index.html',
  'simulatore/index.html',
  'ai/index.html'
];

const out = path.join(process.cwd(), 'public');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function addAiNav(html) {
  if (html.includes('href="/ai/"')) return html;

  html = html.replace(
    /(<a\s+href="\/simulatore\/">Simula<\/a>)/i,
    '$1<a href="/ai/">AI</a>'
  );

  if (!html.includes('href="/ai/"')) {
    html = html.replace(
      /(<nav\b[^>]*id=["']appNav["'][^>]*>)([\s\S]*?)(<\/nav>)/i,
      '$1$2<a href="/ai/"><span class="app-nav-icon">✦</span><span>AI</span></a>$3'
    );
  }

  return html;
}

for (const file of pages) {
  const src = path.join(process.cwd(), file);
  if (!fs.existsSync(src)) throw new Error(`Pagina mancante: ${file}`);

  const destination = path.join(out, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });

  let html = fs.readFileSync(src, 'utf8');
  if (file !== 'ai/index.html') html = addAiNav(html);
  fs.writeFileSync(destination, html);
}

console.log('FINLAB: public build created with AI navigation.');
