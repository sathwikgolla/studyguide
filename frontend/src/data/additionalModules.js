import { topicsForModule } from '../lib/moduleItems'

const moduleMeta = {
  aptitude: { label: 'Aptitude', resourceType: 'practice' },
  'logical-reasoning': { label: 'Logical Reasoning', resourceType: 'question' },
  'system-design': { label: 'System Design', resourceType: 'resource' },
  'devops-cloud': { label: 'DevOps / Cloud', resourceType: 'resource' },
  'hr-behavioral': { label: 'HR / Behavioral Interview', resourceType: 'question' },
  'testing-qa': { label: 'Testing / QA', resourceType: 'practice' },
  'design-patterns': { label: 'Design Patterns', resourceType: 'topic' },
  'mobile-development': { label: 'Mobile Development', resourceType: 'resource' },
  'web3-blockchain': { label: 'Web3 / Blockchain', resourceType: 'resource' },
  'core-cs-fundamentals': { label: 'Core CS Fundamentals', resourceType: 'topic' },
}

const linkMap = {
  Easy: 'https://www.youtube.com/results?search_query=easy+interview+prep',
  Medium: 'https://www.youtube.com/results?search_query=medium+interview+prep',
  Hard: 'https://www.youtube.com/results?search_query=advanced+interview+prep',
}

export function buildAdditionalModuleItems(moduleId) {
  const topics = topicsForModule(moduleId)
  const meta = moduleMeta[moduleId]
  if (!topics?.length || !meta) return []

  // Generate exactly 150 records per module sheet.
  const targetTotal = 150
  const perTopic = Math.max(12, Math.ceil(targetTotal / topics.length))
  const difficultyCycle = ['Easy', 'Medium', 'Hard']

  const items = []
  let order = 1
  for (const topic of topics) {
    for (let i = 0; i < perTopic; i += 1) {
      const difficulty = difficultyCycle[i % difficultyCycle.length]
      const setNo = Math.floor(i / 3) + 1
      items.push({
        id: `${moduleId}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${difficulty.toLowerCase()}-${setNo}`,
        category: meta.label,
        topic,
        difficulty,
        title: `${topic} - ${difficulty} Drill ${setNo}`,
        description: `Practice ${topic} using ${difficulty.toLowerCase()} interview-style problems and guided learning prompts (set ${setNo}).`,
        link: linkMap[difficulty],
        resourceType: meta.resourceType,
        company: setNo % 3 === 0 ? 'Google' : setNo % 2 === 0 ? 'Amazon' : 'General',
        concepts: [topic],
        order: order++,
      })
    }
  }
  return items
}
