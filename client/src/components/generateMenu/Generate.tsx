import { Output } from "../../types/output";

interface GenerateProps {
    generateMcq: (types: Output) => void,
}

export default function Generate({generateMcq}: GenerateProps) {
  return (
    <div className="flex justify-center gap-4">
        <button onClick={() => generateMcq("quiz")} type="button" className="mt-4 px-5 py-3 font-semibold text-zinc-900 rounded bg-white hover:bg-zinc-200 transition">Generate MCQs</button>
        <button onClick={() => generateMcq("flashcard")} type="button" className="mt-4 px-5 py-3 font-semibold text-zinc-900 rounded bg-white hover:bg-zinc-200 transition">Generate Flashcards</button>
    </div>
  )
}
