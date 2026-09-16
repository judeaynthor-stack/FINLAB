const fs = require('fs');
const path = 'index.html';
let html = fs.readFileSync(path, 'utf8');

// Glossary search must search glossary terms only, not their definitions.
// This prevents a query such as "inflazione" or "rischio" from returning
// every topic whose explanation merely mentions that word.
const oldCode = "x.term.toLocaleLowerCase('it-IT').includes(q)||x.def.toLocaleLowerCase('it-IT').includes(q)";
const newCode = "x.term.toLocaleLowerCase('it-IT').includes(q)";

if (!html.includes(oldCode)) {
  throw new Error('Glossary search expression not found; build output may have changed.');
}

html = html.replace(oldCode, newCode);
fs.writeFileSync(path, html);
console.log('FINLAB: glossary search fixed — terms only.');
