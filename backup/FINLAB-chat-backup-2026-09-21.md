# FINLAB — Backup conversazioni progetto
## 21 settembre 2026

Backup delle decisioni, modifiche e problemi principali emersi nelle ultime tre conversazioni FINLAB.

## CHAT 1 — FINLAB / UX-UI / struttura piattaforma

FINLAB è una piattaforma di educazione finanziaria pensata per diventare progressivamente app-like, con interfaccia mobile fluida, superfici arrotondate e linguaggio visivo coerente.

Principi concordati:
- educazione finanziaria, non consulenza personalizzata;
- simulazioni matematiche e ipotetiche, non previsioni;
- evitare promesse di rendimento;
- spiegare i concetti prima degli strumenti;
- design moderno, scuro, elegante, arrotondato e mobile-first;
- quando viene chiesto di modificare il sito, modificare il codice/repository e non creare mockup immagini.

Repository: judeaynthor-stack/FINLAB
Deployment: finlab-piattaforma-v5.vercel.app

Strumenti: Interesse composto, Emergency Fund Planner, Portfolio Analyzer, Strategy Lab.

Portfolio Analyzer: inserimento manuale delle posizioni, categoria, valore, capitale investito, settore, geografia, TER e dividend yield; asset allocation, concentrazione, esposizione settoriale/geografica, sovrapposizioni, costi/dividendi e stress test matematici. Per FTSE All-World è stato introdotto un profilo di esposizione reale.

Strategy Lab: allocazione, validazione 100%, capitale iniziale, PAC, anni, rendimento ipotetico, simulazione, scenari, stress test, informazioni sugli asset, template e donut interattivo.

## CHAT 2 — Percorso educativo / capitoli 09–19

Sezione unica: Oltre le basi.

09 — Costi e rendimento netto
10 — Strategia e processo
11 — Fiscalità degli investimenti
12 — Analisi delle aziende
13 — Valutazione e prezzo
14 — Obbligazioni avanzate
15 — Gestione del rischio
16 — Economia e mercati
17 — Valute e rischio cambio
18 — Leggere un portafoglio
19 — Truffe e sicurezza finanziaria

I capitoli 1–8 restano: Prima di iniziare; Come funzionano i mercati; ETF; Azioni; Obbligazioni; Portafoglio; Psicologia; Crypto.

Problema riscontrato: i capitoli 09–19 apparivano nelle card ma non mostravano gli argomenti. La causa era nella generazione di impara/index.html tramite build.js e nella gestione dei chapter-panel.

È stato corretto il processo di build. L'utente ha poi confermato: Ok ora sembra apposto.

Regola futura: prima di modificare il percorso educativo controllare source.html, build.js, impara/index.html, corrispondenza data-chapter/id chapterX, presenza dei topic, JavaScript di apertura e possibili duplicazioni.

## CHAT 3 — Ultimi bug e correzioni

Menu Strumenti: il menu mobile non si apriva. È stato individuato un errore JavaScript nel builder dovuto alla gestione delle stringhe HTML/virgolette. È stato corretto.

Portfolio Analyzer: nella pagina /strumenti/ il card mostrava ancora Prossimamente. Ora è attivo e punta a /strumenti/portfolio-analyzer/.

Bug capitoli: una correzione intermedia aveva inserito una seconda estrazione dei chapter-panel, causando una lunga colonna di 0% del capitolo completato. La duplicazione è stata rimossa.

Ultimo deployment verificato: Vercel SUCCESS.
Ultimo commit verificato: 2a60e177094473d504b129e2bca9456be7301e8c

## Backup / rollback

Branch GitHub disponibile: backup-before-uxui-2026-09-21

## Regola operativa FINLAB

1. Controllare prima i file coinvolti.
2. Individuare la vera origine del problema.
3. Modificare il codice reale, non creare immagini.
4. Controllare source.html, build.js e patch-nav.js quando coinvolti.
5. Verificare HTML, JavaScript e CSS interessati.
6. Evitare modifiche duplicate.
7. Verificare desktop e mobile.
8. Attendere il risultato Vercel.
9. Dichiarare la modifica pronta solo dopo la verifica.

Nota: questo file conserva il contesto tecnico e le decisioni principali delle tre conversazioni; non è una copia letterale completa dei transcript originali.