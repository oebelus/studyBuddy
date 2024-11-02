export interface MCQAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}

export interface MCQAttempt {
  userId: string;
  mcqSetId: string;
  title: string;
  numberOfQuestions: number;
  score: number;
  answers: { [key: number]: boolean };
  timestamp: Date;
}

export interface FlashcardAttempt {
  userId: string;
  deckId: string;
  category: string;
  cardsReviewed: number;
  knownCards: number;
  timestamp: Date;
}
