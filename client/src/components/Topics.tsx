import { Topic } from "../types/Topic"

interface TopicsProps {
  topics: Topic[],
  setSelectedTopic: (name: string) => void
}

export default function Topics({topics, setSelectedTopic}: TopicsProps) {
  return (
    <div className="flex p-4 gap-6 justify-start w-screen">
        {topics.map((topic, key) => (
          <div
          key={key}
          onClick={() => setSelectedTopic(topic.name)}
          className="cursor-pointer hover:scale-105 min-w-[200px] p-4 dark:text-white rounded-lg dark:bg-[#1F1F1F] bg-yellow-100 h-fit transition-transform"
          >
            <p className="text-2xl">{topic.name}</p>
            <p>{topic.category}</p>
            <p>{topic.numberOfQuestions} questions</p>
          </div>
        ))}
    </div>
  )
}
