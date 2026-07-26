// Shape reference for every lesson object in ./lessons/*.js — not enforced at
// runtime, just documentation for authoring consistency.
//
// {
//   id: 'auto-rickshaw-ride',        // unique, kebab-case, used in URLs
//   order: 5,                         // global sort order (grouped by category)
//   category: 'Getting Around',       // must match a key in categories.js
//   emoji: '🛺',
//   title: 'Taking an Auto / Cab',
//   scenario: 'One-sentence framing of when you'd use this lesson.',
//   difficulty: 'Beginner',           // 'Beginner' | 'Intermediate' | 'Advanced'
//   estimatedMinutes: 10,
//   grammarTip: { title: '...', body: '...' },
//   cultureNote: { title: '...', body: '...' },
//   teaching: {                        // shown first, before Vocab — a taught walkthrough
//     overview: 'A few sentences setting up the scenario in more depth than `scenario`.',
//     grammar: [
//       { heading: '...', body: '...' },
//       // ...4-5 points: sentence framing, suffix/prefix patterns, verb forms used in this lesson
//     ],
//     sentenceLab: [
//       {
//         kannada: '...', translit: '...', english: '...',
//         parts: [ { chunk: '...', translit: '...', meaning: '...' } ], // word-by-word breakdown
//       },
//       // ...2-3 sentences pulled from `conversation`, broken into their pieces
//     ],
//   },
//   vocab: [
//     { kannada: 'ಮೀಟರ್ ಹಾಕಿ', translit: 'Meter haaki', english: 'Please use the meter', note: 'optional usage note', usage: 'When and how this is actually used, in one sentence.' },
//     // ...~13 entries, every one with a `usage` line
//   ],
//   conversation: [
//     { speaker: 'You', kannada: '...', translit: '...', english: '...' },
//     // ...10-12 turns
//   ],
//   quiz: [
//     { type: 'mcq', question: '...', options: ['a', 'b', 'c', 'd'], answer: 2, explanation: '...' },
//     { type: 'fill', question: 'Translate: "How much?"', answer: 'Yeshtu', altAnswers: ['eshtu', 'estu'] },
//     { type: 'truefalse', question: '"X" means "Y".', answer: true, explanation: '...' },
//     // ...~8 per lesson, mixed types
//   ],
//   dictation: [
//     { kannada: '...', translit: '...', english: '...' },
//     // ...5 entries
//   ],
// }
export {}
