import PDF from "./PDF";
import QuestionForm from "./QuestionForm";

interface PDFSectionProps {
    extractedText: string | undefined;
    pdfName: string
} 

export default function PDFSection({extractedText, pdfName} : PDFSectionProps) {
  return (
    <div className="flex justify-center mt-8 mx-auto">
        <QuestionForm extractedText={extractedText} />
        <PDF pdfName={pdfName} />
    </div>
  )
}
