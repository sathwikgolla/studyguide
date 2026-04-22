import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outFile = join(__dirname, '../src/data/interviewTopics/generated.json')

const N = 100

const CATEGORIES = [
  { id: 'top-interview', label: 'Top Interview Questions', difficultyAt: (i) => (i % 5 === 0 ? 'Hard' : i % 3 === 0 ? 'Easy' : 'Medium') },
  { id: 'basic', label: 'Basic', difficultyAt: () => 'Easy' },
  { id: 'medium', label: 'Medium', difficultyAt: () => 'Medium' },
  { id: 'advanced', label: 'Advanced', difficultyAt: () => 'Hard' },
]

function link(topicLabel, title, topicId, catId, index) {
  const q = `${topicLabel} interview ${title}`
  return `https://duckduckgo.com/?q=${encodeURIComponent(q)}&ia=web&pf=${topicId}-${catId}-${index}`
}

function pick(arr, i) {
  return arr[i % arr.length]
}

function padQ(n) {
  return String(n + 1).padStart(3, '0')
}

/** @param {{ areas: string[], stems: string[], extra?: (i:number)=>string }} def */
function makeBlock(topicId, topicLabel, cat, def, seed) {
  const { areas, stems, extra } = def
  const out = []
  for (let i = 0; i < N; i++) {
    const area = pick(areas, i + seed)
    const stem = pick(stems, Math.floor(i / areas.length) + seed * 7)
    const suffix = extra ? extra(i) : ''
    const title = `${stem}${suffix ? ` — ${suffix}` : ''} (${area}) · Q${padQ(i)}`
    const difficulty = cat.difficultyAt(i)
    const topic = area
    out.push({
      title,
      difficulty,
      topic,
      link: link(topicLabel, title, topicId, cat.id, i),
    })
  }
  return out
}

const OS = {
  areas: [
    'Processes',
    'Threads',
    'CPU scheduling',
    'Synchronization',
    'Deadlocks',
    'Memory mgmt',
    'Virtual memory',
    'Paging',
    'File systems',
    'I/O & devices',
    'Protection',
    'System calls',
    'IPC',
    'Monitors',
    'Semaphores',
    'Mutex',
    'Condition vars',
    'Banker algorithm',
    'Page replacement',
    'TLB',
    'Segmentation',
    'Demand paging',
    'Disk scheduling',
    'RAID',
    'Boot process',
  ],
  stems: [
    'Explain the tradeoffs',
    'Compare key properties',
    'Walk through a typical scenario',
    'What can go wrong and why',
    'How does the kernel enforce',
    'Outline the lifecycle',
    'State the invariants',
    'Describe failure modes',
    'Relate to real OS examples',
    'Contrast with alternatives',
    'What metrics matter',
    'How is starvation avoided',
    'Define correctness conditions',
    'Sketch the data structures',
    'What hardware support exists',
    'Explain with a small example',
    'When would you choose X vs Y',
    'What are common interview pitfalls',
    'How does virtualization interact',
    'Trace a syscall path',
  ],
}

const CN = {
  areas: [
    'Physical layer',
    'Data link',
    'Ethernet',
    'Switching',
    'IP',
    'Subnetting',
    'Routing',
    'OSPF',
    'BGP',
    'TCP',
    'UDP',
    'HTTP',
    'HTTPS',
    'TLS',
    'DNS',
    'DHCP',
    'NAT',
    'CDN',
    'WebSockets',
    'REST',
    'gRPC',
    'Congestion ctrl',
    'Flow ctrl',
    'Reliability',
    'Security basics',
  ],
  stems: [
    'Explain how it works end-to-end',
    'Compare with the alternative',
    'What headers or fields matter',
    'Describe failure and recovery',
    'How is ordering guaranteed',
    'What are scaling limits',
    'Walk through handshake',
    'State timeout behaviors',
    'How does loss affect throughput',
    'Contrast latency vs bandwidth',
    'What attacks does it mitigate',
    'How is addressing done',
    'Explain fragmentation',
    'Describe retransmission',
    'What is head-of-line blocking',
    'How does caching apply',
    'Trace a real request',
    'What does the RFC require',
    'How do proxies change behavior',
    'Why is this layer responsible',
  ],
}

const DBMS = {
  areas: [
    'Relational model',
    'Keys & constraints',
    'Normalization',
    'SQL joins',
    'Aggregations',
    'Indexes',
    'B-trees',
    'Hash indexes',
    'Query plans',
    'Transactions',
    'ACID',
    'Isolation levels',
    'Locks',
    'Deadlocks',
    'MVCC',
    'WAL',
    'Replication',
    'Sharding',
    'CAP tradeoffs',
    'NoSQL models',
    'ER modeling',
    'Stored procedures',
    'Views',
    'Triggers',
    'Full-text search',
  ],
  stems: [
    'Write the mental model',
    'Compare approaches',
    'What anomalies appear',
    'How would you optimize',
    'Explain isolation guarantees',
    'Describe the storage layout',
    'What breaks without indexes',
    'How does the planner choose',
    'State invariants under concurrency',
    'How is durability achieved',
    'Contrast SQL vs document',
    'What normalization fixes',
    'Explain a join algorithm',
    'When to denormalize',
    'How are conflicts resolved',
    'What is the CAP implication',
    'Sketch a schema',
    'How does replication lag surface',
    'What are phantom reads',
    'How do backups interact with WAL',
  ],
}

const FS = {
  areas: [
    'HTTP APIs',
    'REST design',
    'AuthN',
    'AuthZ',
    'Sessions',
    'JWT',
    'OAuth2',
    'CORS',
    'CSRF',
    'XSS',
    'SQL injection',
    'Validation',
    'React basics',
    'State mgmt',
    'Hooks',
    'Performance',
    'Node event loop',
    'Streams',
    'Databases',
    'Migrations',
    'Caching',
    'Redis',
    'Queues',
    'Docker',
    'CI/CD',
  ],
  stems: [
    'Explain the end-to-end flow',
    'How would you secure this',
    'Compare common patterns',
    'What breaks at scale',
    'Describe error handling',
    'How to test this layer',
    'Tradeoffs in API design',
    'How does caching fit',
    'What to log and monitor',
    'How do sessions differ from tokens',
    'Explain SSR vs CSR',
    'What is hydration',
    'How do you prevent double submit',
    'Describe idempotency',
    'How are file uploads handled',
    'What is connection pooling',
    'Explain rate limiting',
    'How does deploy zero-downtime',
    'What is blue-green',
    'How do env secrets work',
  ],
}

const TOPICS = [
  {
    id: 'os',
    title: 'Operating Systems',
    blurb:
      'Processes, memory, scheduling, and concurrency — drill common interview prompts by category.',
    def: OS,
  },
  {
    id: 'cn',
    title: 'Computer Networks',
    blurb:
      'Protocols, TCP/IP stack, HTTP, DNS, and reliability — practice questions grouped by difficulty.',
    def: CN,
  },
  {
    id: 'dbms',
    title: 'DBMS',
    blurb:
      'SQL, modeling, transactions, and storage — strengthen theory with structured practice.',
    def: DBMS,
  },
  {
    id: 'fullstack',
    title: 'Full Stack Development',
    blurb:
      'APIs, security, frontend, backend, and delivery — vertical slices for interview prep.',
    def: FS,
  },
]

const topics = {}
let seed = 0
for (const t of TOPICS) {
  const categories = CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.label,
    questions: makeBlock(t.id, t.title, cat, t.def, seed),
  }))
  seed += 11
  topics[t.id] = {
    id: t.id,
    title: t.title,
    blurb: t.blurb,
    categories,
  }
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify({ topics }, null, 2))
const totalQs = Object.values(topics).reduce(
  (n, tp) => n + tp.categories.reduce((m, c) => m + c.questions.length, 0),
  0
)
console.log('Wrote', outFile, '—', Object.keys(topics).length, 'tracks,', totalQs, 'questions')
