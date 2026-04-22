import { cnTopics, dbmsTopics, dsaTopics, osTopics } from '../data/moduleTopics'

const topicKeywords = {
  dsa: {
    Arrays: ['array', 'two sum', 'prefix', 'subarray'],
    Strings: ['string', 'palindrome', 'anagram', 'substring'],
    'Linked List': ['linked', 'list node'],
    Stack: ['stack', 'parentheses', 'monotonic'],
    Queue: ['queue', 'deque'],
    Recursion: ['recursion', 'recursive'],
    Trees: ['tree', 'bst', 'binary tree', 'traversal'],
    Graphs: ['graph', 'dfs', 'bfs', 'topological'],
    'Dynamic Programming': ['dp', 'dynamic programming', 'memo', 'tabulation'],
    Greedy: ['greedy', 'interval'],
    'Binary Search': ['binary search'],
    Heap: ['heap', 'priority queue'],
    Tries: ['trie', 'prefix tree'],
    Backtracking: ['backtracking', 'n queens', 'combination'],
  },
  os: mapSelf(osTopics),
  dbms: mapSelf(dbmsTopics),
  cn: mapSelf(cnTopics),
}

function mapSelf(topics) {
  const out = {}
  for (const topic of topics) out[topic] = [topic.toLowerCase()]
  return out
}

export function topicsForModule(moduleId) {
  if (moduleId === 'dsa') return dsaTopics
  if (moduleId === 'os') return osTopics
  if (moduleId === 'cn') return cnTopics
  return dbmsTopics
}

export function normalizeModuleItems(moduleId, rows) {
  const topics = topicsForModule(moduleId)
  const keywords = topicKeywords[moduleId] ?? {}

  return (rows ?? []).map((q, index) => {
    const source = `${q.topic ?? ''} ${q.title ?? ''}`.toLowerCase()
    const topic = pickTopic(topics, keywords, source)
    const difficulty = ['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium'
    return {
      id: q.link || `${moduleId}-${index}`,
      category: moduleId.toUpperCase(),
      topic,
      difficulty,
      title: q.title,
      description: `${q.topic || topic} practice item`,
      link: q.link,
      resourceType: 'question',
      order: index + 1,
    }
  })
}

function pickTopic(topics, keywords, source) {
  for (const topic of topics) {
    const keys = keywords[topic] ?? [topic.toLowerCase()]
    if (keys.some((k) => source.includes(k))) return topic
  }
  return topics[0]
}

export function progressForItems(items, map) {
  const total = items.length
  const done = items.reduce((acc, item) => acc + (map[item.id]?.completed ? 1 : 0), 0)
  const pct = total ? Math.round((done / total) * 100) : 0
  return { done, total, pct }
}
