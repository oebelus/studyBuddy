import { Types } from "mongoose";
import { FlashcardAttemptModel, MCQAttemptModel } from "../models/attempts.model";
import { MCQAttempt } from "../interfaces/attempt.interface";

export class AnalyticsService {
    public async getUserStats(userId: string) {
        const [
            mcqsAttempts,
            flashcardsAttempts,
            recentMCQs,
            categoryStats
        ] = await Promise.all([
            MCQAttemptModel.countDocuments({ userId }),
            FlashcardAttemptModel.countDocuments({ userId }),
            MCQAttemptModel.find({ userId })
                .sort({ timestamp: -1 }) // Descending order
                .limit(7),
            MCQAttemptModel.aggregate([
                { $match: { userId } },
                { $group: { 
                    _id: "$category",
                    avgScore: { $avg: "$score" },
                    totalAttempts: { $sum: 1 }
                    },
                }
            ])
        ])

        console.log(mcqsAttempts)

        // Calculate weekly performance data
        const weeklyData = recentMCQs.map((mcq) => {
            mcq.timestamp;
            score: mcq.score;
            questionsAttempted: mcq.answers.length;
            correctAnswers: mcq.answers.filter((answer) => answer.isCorrect).length;
        })

        // Process category statistics
        const categoryData = categoryStats.map((stat) => ({
            name: stat._id,
            avgScore: Math.round(stat.avgScore * 100) / 100,
            attempts: stat.totalAttempts
        }))

        return {
            totalAttempts: mcqsAttempts,
            flashcardsAttempts,
            weeklyData,
            categoryData
        }
    }

    public async getDifficultyStats(userId: string) {
        const stats = await MCQAttemptModel.aggregate([
            { $match: { userId: new Types.ObjectId(userId) } },
            { $unwind: "$answers" },
            { $group: {
                _id: null,
                easy: {
                    $sum: {
                        $cond: [{ $gt: ["$score", 80] }, 1, 0]
                    }
                },
                medium: {
                    $sum: {
                        $cond: [
                            { $and: [
                                { $lte: ["$score", 80] },
                                { $gt: ["$score", 50] }
                            ]},
                            1,
                            0
                        ]
                    }
                },
                hard: {
                    $sum: {
                        $cond: [{ $lte: ["$score", 50] }, 1, 0]
                    }
                }
            } },
        ])

        return stats[0] || { easy: 0, medium: 0, hard: 0 };
    }

    public async saveMcqAttempt(attempt: MCQAttempt) {
        try {
            await MCQAttemptModel.create(attempt);
        } catch (error) {
            console.error("Error saving MCQ attempt:", error);
            throw error;
        }
    }
}