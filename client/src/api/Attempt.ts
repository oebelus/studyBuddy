import { FlashcardAttempt, MCQAttempt } from "../types/Attempts";

export class AttemptService {
  static async saveMCQAttempt(attempt: MCQAttempt) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/attempts/mcq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(attempt),
      });

      if (!response.ok) {
        throw new Error("Failed to save MCQ attempt");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving MCQ attempt:", error);
      throw error;
    }
  }

  static async saveFlashcardAttempt(attempt: FlashcardAttempt) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/attempts/flashcard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(attempt),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save flashcard attempt");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving flashcard attempt:", error);
      throw error;
    }
  }
}
