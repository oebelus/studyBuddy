export type Flashcard = {
  question: string,
  answer: string
}

export type Flashcards = {
    flashcards: Flashcard[]
    title: string
    category: string
    _id: string
}