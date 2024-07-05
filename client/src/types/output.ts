export type Flashcard = {
  id: number,
  question: string,
  answer: string
}

export type MCQ = {
  id: number,
  answers: number[],
  question: string,
  options: string[],
}

export type Output = "quiz" | "flashcard"