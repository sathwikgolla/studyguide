import TopicCard from './TopicCard'

export default function TopicCardGrid({ topics, selectedTopic, onSelectTopic, statsByTopic, variant }) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">Topics</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic}
            topic={topic}
            isActive={selectedTopic === topic}
            onClick={() => onSelectTopic(topic)}
            stats={statsByTopic[topic] ?? { done: 0, total: 0, pct: 0 }}
            variant={variant}
          />
        ))}
      </div>
    </section>
  )
}
