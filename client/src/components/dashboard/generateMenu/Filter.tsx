import { ChangeEvent } from "react"
import { Output } from "../../../types/output"

interface FilterProps {
    handlePdf: (e: ChangeEvent<HTMLInputElement>) => Promise<void>,
    generateMcq: (types: Output) => void,
    setModule: (e: HTMLInputElement["value"]) => void,
    module: string, 
    setSubject: (e: HTMLInputElement["value"]) => void,
    subject: string,
    setN: (n: number) => void,
    n: number,
    extractedText: string | undefined,
    setExtractedText: (e: HTMLInputElement["value"]) => void
}

export default function Filter({
    handlePdf,
    setModule,
    module,
    setSubject,
    subject,
    setN,
    n,
    extractedText,
    setExtractedText}: FilterProps) {
  return (
    <div className="mx-auto max-w-[95%] bg-white dark:bg-[#2F2F2F] dark:border-transparent border-zinc-300 border-2 w-fit h-fit p-3 shadow-lg rounded-lg mt-4">
      <div className="lg:flex lg:justify-between lg:items-center">
          <div className="flex flex-row gap-4">
          <p className="text-black dark:text-white font-semibold text-xl">Select File:</p>
          <input className="mt-1 dark:text-white" onChange={handlePdf} type="file" name="pdf" id="pdf" accept="application/pdf" />
          </div>
          <div className="flex flex-col mt-6 lg:mt-1 gap-2">
            <input required onChange={(e) => setModule(e.target.value)} value={module} className="shadow p-2 rounded-lg" placeholder="Module Name" type="text" name="module" id="module" />
            <input required onChange={(e) => setSubject(e.target.value)} value={subject} className="shadow p-2 rounded-lg" placeholder="Lesson Name" type="text" name="subject" id="subject" />
            <input required onChange={(e) => setN(parseInt(e.target.value))} value={n} className="shadow p-2 rounded-lg" placeholder="Questions" type="number" max={20} name="number" id="number" />
          </div>
      </div>
      <input className="hidden" type="text" value={extractedText} onChange={(e) => setExtractedText(e.target.value)} name="lesson" />
    </div>
  )
}
