function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m

  const prev = new Array(n + 1)
  const curr = new Array(n + 1)
  for (let j = 0; j <= n; j++) prev[j] = j

  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j]
  }
  return prev[n]
}

// Fuzzy-compares a learner's answer against an expected string (plus optional
// alternates), tolerant of minor spelling drift in romanized Kannada.
export function fuzzyMatch(input, expected, altExpected = []) {
  const candidates = [expected, ...altExpected].map(normalize)
  const normalizedInput = normalize(input)
  if (!normalizedInput) return { isMatch: false, closeness: 0 }

  let best = 0
  for (const candidate of candidates) {
    if (!candidate) continue
    if (normalizedInput === candidate) return { isMatch: true, closeness: 1 }
    const distance = levenshtein(normalizedInput, candidate)
    const maxLen = Math.max(normalizedInput.length, candidate.length)
    const closeness = maxLen === 0 ? 0 : 1 - distance / maxLen
    if (closeness > best) best = closeness
  }

  return { isMatch: best >= 0.75, closeness: best }
}
