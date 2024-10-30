export interface MCQAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}

export interface MCQAttempt {
  userId: string;
  quizId: string;
  category: string;
  score: number;
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
