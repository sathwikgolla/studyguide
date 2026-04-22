import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const linesDir = join(__dirname, 'dsa-lines')
const outFile = join(__dirname, '../src/data/dsa/generated.json')

function parseQuestions(text) {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('##')
      if (parts.length < 4) {
        throw new Error(`Bad line (expected 4 fields): ${line}`)
      }
      const [title, difficulty, topic, rest] = parts
      const link = rest.startsWith('http') ? rest : `https://leetcode.com/problems/${rest}/`
      return { title, difficulty, topic, link }
    })
}

const meta = [
  { file: '01-mixed.txt', title: 'PrepFlow DSA Sheet' },
  { file: '02-arrays.txt', title: 'PrepFlow DSA Sheet — Arrays (Set 2)' },
  { file: '03-strings.txt', title: 'PrepFlow DSA Sheet — Strings (Set 2)' },
  { file: '04-linked-list.txt', title: 'PrepFlow DSA Sheet — Linked List (Set 2)' },
  { file: '05-binary-search.txt', title: 'PrepFlow DSA Sheet — Binary Search (Set 2)' },
  { file: '06-recursion-backtracking.txt', title: 'PrepFlow DSA Sheet — Recursion & Backtracking (Set 2)' },
  { file: '07-bit-manipulation.txt', title: 'PrepFlow DSA Sheet — Bit Manipulation (Set 2)' },
  { file: '08-stacks-queues.txt', title: 'PrepFlow DSA Sheet — Stacks & Queues (Set 2)' },
  { file: '09-trees.txt', title: 'PrepFlow DSA Sheet — Trees (Set 2)' },
  { file: '10-graphs.txt', title: 'PrepFlow DSA Sheet — Graphs (Set 2)' },
  { file: '11-dynamic-programming.txt', title: 'PrepFlow DSA Sheet — Dynamic Programming (Set 2)' },
]

const sheets = meta.map(({ file, title }) => {
  const raw = readFileSync(join(linesDir, file), 'utf8')
  return {
    title,
    category: 'DSA',
    questions: parseQuestions(raw),
  }
})

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify({ sheets }, null, 2))
console.log('Wrote', outFile, 'with', sheets.length, 'sheets,', sheets.reduce((n, s) => n + s.questions.length, 0), 'questions')
