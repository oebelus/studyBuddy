import { Output } from "../../types/output"
import Filter from "./Filter"
import Generate from "./Generate"

interface GenerateMenuProps {
    handlePdf: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>,
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

export default function GenerateMenuProps({
    handlePdf,
    generateMcq,
    setModule,
    module,
    setSubject,
    subject,
    setN,
    n,
    extractedText,
    setExtractedText}: GenerateMenuProps) {
  return (
    <div className='flex flex-col justify-center'>
        <Filter 
            handlePdf={handlePdf}
            generateMcq={generateMcq}
            setModule={setModule}
            module={module}
            setSubject={setSubject}
            subject={subject}
            setN={setN}
            n={n}
            extractedText={extractedText}
            setExtractedText={setExtractedText}
          />

        <Generate generateMcq={generateMcq} />
    </div>
  )
}
