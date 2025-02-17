export type WeeklyData = {
  timestamp: Date;
  score: number;
  questionsAttempted: number;
  correctAnswers: number;
  wrongAnswers: number;
};

export type WeeklyGraphData = {
  name: string;
  questionsAttempted: number;
  correctAnswers: number;
};

export type FormattedData = {
  name: string; // Weekday name
  questions: number;
  correct: number;
};

export type CategoryStat = {
  name: string;
  avgScore: number;
  attempts: number;
  correctAnswers: number;
  wrongAnswers: number;
};

export type DifficultyStats = {
  easy: number;
  medium: number;
  hard: number;
};
