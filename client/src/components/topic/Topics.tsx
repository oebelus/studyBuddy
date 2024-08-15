import { useState } from "react"
import { Topic } from "../../types/Topic"
import DeleteTopic from "./DeleteTopic";
import { Output } from "../../types/output";

interface TopicsProps {
  topics: Topic[],
  setSelectedTopic: (name: string) => void,
  setQuizId: (id: string) => void
  setGenerated: (e: boolean) => void
  type: Output
}

export default function Topics({type, topics, setSelectedTopic, setGenerated, setQuizId}: TopicsProps) {
  const [del, setDel] = useState<boolean>(false)
  const [topicId, setTopicId] = useState("")

  return (
    <div className="w-[90%] flex p-4 gap-6 justify-start relative overflow-x-scroll">
        {topics.map((topic, key) => (
          <div
            key={key}
            onClick={() => {setSelectedTopic(topic.name); setQuizId(topic.id); setGenerated(false)}}
            className="h-38 flex cursor-pointer hover:scale-105 min-w-[200px] p-4 dark:text-white rounded-lg dark:bg-[#1F1F1F] bg-yellow-100 transition-transform"
          >
            <div className="flex flex-col justify-between">
              <p className="text-2xl">{topic.name}</p>
              <div>
                <p>{topic.category}</p>
                <p>{topic.numberOfQuestions + 1} questions</p>
              </div>
            </div>
            <span onClick={() => {setDel(true), setTopicId(topic.id)}} className="material-symbols-outlined h-fit p-2 rounded-full transition dark:hover:bg-[#111111] hover:bg-yellow-200">
              delete
            </span>
          </div>
        ))}

        <DeleteTopic type={type} topicId={topicId} setDel={setDel} del={del} />
    </div>
  )
}
