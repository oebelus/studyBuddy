import { useState } from "react"
import { Topic } from "../../types/Topic"
import DeleteTopic from "./DeleteTopic";

interface TopicsProps {
  topics: Topic[],
  setSelectedTopic: (name: string) => void
}

export default function Topics({topics, setSelectedTopic}: TopicsProps) {
  const [del, setDel] = useState<boolean>(false)
  const [topicId, setTopicId] = useState("")

  return (
    <div className="flex p-4 gap-6 justify-start w-screen relative overflow-scroll">
        {topics.map((topic, key) => (
          <div
            key={key}
            onClick={() => setSelectedTopic(topic.name)}
            className="flex cursor-pointer hover:scale-105 min-w-[200px] p-4 dark:text-white rounded-lg dark:bg-[#1F1F1F] bg-yellow-100 h-fit transition-transform"
          >
            <div>
               <p className="text-2xl">{topic.name}</p>
              <p>{topic.category}</p>
              <p>{topic.numberOfQuestions} questions</p>
            </div>
            <span onClick={() => {setDel(true), setTopicId(topic.id)}} className="material-symbols-outlined h-fit p-2 rounded-full transition dark:hover:bg-[#111111] hover:bg-yellow-200">
              delete
            </span>
          </div>
        ))}

        <DeleteTopic topicId={topicId} setDel={setDel} del={del} />
    </div>
  )
}
