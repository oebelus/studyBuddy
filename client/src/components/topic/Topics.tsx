import { useState } from "react";
import { Topic } from "../../types/Topic";
import DeleteTopic from "./DeleteTopic";
import { Output } from "../../types/output";

interface TopicsProps {
  topics: Topic[],
  type: Output,
  mcqLength: number
}

export default function Topics({type, topics}: TopicsProps) {
  const [del, setDel] = useState<boolean>(false);
  const [topicId, setTopicId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [quizId, setQuizId] = useState("")

  const handleTopicClick = (topic: Topic) => {
    console.log(topic)
    setSelectedTopic(topic.name);
    setQuizId(topic.id);
    setIsModalOpen(true);
    setNumberOfQuestions(topic.numberOfQuestions);
  };

  const startQuiz = () => {
    setIsModalOpen(false);
    window.location.href = `/quiz/${quizId}`;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-[90%] flex p-4 gap-6 justify-start relative overflow-x-scroll">
      {topics.map((topic, key) => (
        <div
          key={key}
          onClick={() => handleTopicClick(topic)}
          className="h-38 flex cursor-pointer hover:scale-105 min-w-[200px] p-4 dark:text-white rounded-lg dark:bg-[#1F1F1F] bg-yellow-100 transition-transform"
        >
          <div className="flex flex-col justify-between">
            <p className="text-2xl">{topic.name}</p>
            <div>
              <p>{topic.category}</p>
              <p>{topic.numberOfQuestions + 1} questions</p>
            </div>
          </div>
          <span
            onClick={() => { setDel(true); setTopicId(topic.id); }}
            className="material-symbols-outlined h-fit p-2 rounded-full transition dark:hover:bg-[#111111] hover:bg-yellow-200"
          >
            delete
          </span>
        </div>
      ))}

      <DeleteTopic type={type} topicId={topicId} setDel={setDel} del={del} />

      {/* Modal for starting the quiz */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="border-2 border-pink-500 bg-white p-6 rounded-lg dark:bg-[#1F1F1F] w-[80%] sm:w-[50%] text-center">
            <h2 className="text-xl font-semibold mb-4">Do you want to start the quiz for "{selectedTopic}"?</h2>
            <p className="mb-8">You will answer {numberOfQuestions} questions.</p>
            <div className="flex justify-around">
              <button
                onClick={startQuiz}
                className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-700"
              >
                Yes, Start Quiz
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all ease-in-out duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
