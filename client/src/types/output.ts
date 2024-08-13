export type MCQ = {
  id: number,
  answers: number[],
  question: string,
  options: string[],
}

export type topic = {
  name: string,
  category: string,
  number: number
}

export type Output = "quiz" | "flashcard"