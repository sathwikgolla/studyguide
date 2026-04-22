import {
  aptitudeTopics,
  cnTopics,
  coreCsTopics,
  dbmsTopics,
  devopsTopics,
  dsaTopics,
  hrTopics,
  logicalTopics,
  mobileTopics,
  osTopics,
  patternsTopics,
  systemDesignTopics,
  testingTopics,
  web3Topics,
} from '../data/moduleTopics'

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
  if (moduleId === 'dbms') return dbmsTopics
  if (moduleId === 'aptitude') return aptitudeTopics
  if (moduleId === 'logical-reasoning') return logicalTopics
  if (moduleId === 'system-design') return systemDesignTopics
  if (moduleId === 'devops-cloud') return devopsTopics
  if (moduleId === 'hr-behavioral') return hrTopics
  if (moduleId === 'testing-qa') return testingTopics
  if (moduleId === 'design-patterns') return patternsTopics
  if (moduleId === 'mobile-development') return mobileTopics
  if (moduleId === 'web3-blockchain') return web3Topics
  if (moduleId === 'core-cs-fundamentals') return coreCsTopics
  return []
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
      company: inferCompany(moduleId, topic, difficulty),
      concepts: inferConcepts(topic),
      order: index + 1,
    }
  })
}

function inferCompany(moduleId, topic, difficulty) {
  if (moduleId === 'dsa' && ['Dynamic Programming', 'Graphs'].includes(topic)) return 'Google'
  if (moduleId === 'system-design') return 'Amazon'
  if (difficulty === 'Hard') return 'Microsoft'
  return 'General'
}

function inferConcepts(topic) {
  const t = String(topic || '')
  if (t.includes('Search')) return ['Binary Search', 'Sorting']
  if (t.includes('Graph')) return ['DFS', 'BFS']
  if (t.includes('Database')) return ['Schema Design', 'Indexing']
  return [t]
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
