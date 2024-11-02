import { Types } from 'mongoose';
import { MCQAttemptModel } from '../models/attempts.model';
import { 
    MCQAttempt, 
    DifficultyStats, 
    UserStats, 
    WeeklyData, 
    CategoryStat 
} from '../interfaces/attempt.interface';

export class AnalyticsService {
    public async getUserStats(userId: string): Promise<UserStats> {
        try {
            const [
                mcqsAttempts,
                questionsAnswered,
                recentMCQs,
                categoryStats,
                answersStats
            ] = await Promise.all([
                MCQAttemptModel.countDocuments({ userId }),
                MCQAttemptModel.aggregate([
                    { $match: { userId } },
                    {
                        $project: {
                            questionCount: { $size: { $objectToArray: '$answers' } }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$questionCount' }
                        }
                    }
                ]),
                MCQAttemptModel.find({ userId })
                    .sort({ timestamp: -1 })
                    .limit(7),
                MCQAttemptModel.aggregate([
                    { $match: { userId } },
                    {
                        $group: {
                            _id: '$category',
                            avgScore: { $avg: '$score' },
                            totalAttempts: { $sum: 1 }
                        }
                    }
                ]),
                MCQAttemptModel.aggregate([
                    { $match: { userId } },
                    {
                        $project: {
                            answers: { $objectToArray: '$answers' }
                        }
                    },
                    { $unwind: '$answers' },
                    {
                        $group: {
                            _id: null,
                            correctAnswers: {
                                $sum: { $cond: [{ $eq: ['$answers.v', true] }, 1, 0] }
                            },
                            wrongAnswers: {
                                $sum: { $cond: [{ $eq: ['$answers.v', false] }, 1, 0] }
                            }
                        }
                    }
                ])
            ]);

            const weeklyData: WeeklyData[] = recentMCQs.map((mcq) => ({
                timestamp: mcq.timestamp,
                score: mcq.score,
                questionsAttempted: Object.keys(mcq.answers).length,
                correctAnswers: Object.values(mcq.answers).filter((key) => key == true).length,
                wrongAnswers: Object.values(mcq.answers).filter((key) => key == false).length
            }));

            const categoryData: CategoryStat[] = categoryStats.map((stat) => ({
                name: stat._id,
                avgScore: Math.round(stat.avgScore * 100) / 100,
                attempts: stat.totalAttempts
            }));

            const answered: number =  questionsAnswered.length;
            const totalCorrectAnswers: number = answersStats[0].correctAnswers;
            const totalWrongAnswers: number = answersStats[0].wrongAnswers;

            return {
                totalAttempts: mcqsAttempts,
                weeklyData,
                categoryData,
                answered,
                totalCorrectAnswers,
                totalWrongAnswers
            };
        } catch (error) {
            console.error('Error fetching user stats:', error);
            throw new Error('Failed to fetch user statistics');
        }
    }

    public async getDifficultyStats(userId: string): Promise<DifficultyStats> {
        try {
            const stats = await MCQAttemptModel.aggregate([
                { $match: { userId: new Types.ObjectId(userId) } },
                { $unwind: '$answers' },
                {
                    $group: {
                        _id: null,
                        easy: {
                            $sum: {
                                $cond: [{ $gt: ['$score', 80] }, 1, 0]
                            }
                        },
                        medium: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $lte: ['$score', 80] },
                                            { $gt: ['$score', 50] }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        },
                        hard: {
                            $sum: {
                                $cond: [{ $lte: ['$score', 50] }, 1, 0]
                            }
                        }
                    }
                }
            ]);

            return stats[0] || { easy: 0, medium: 0, hard: 0 };
        } catch (error) {
            console.error('Error fetching difficulty stats:', error);
            throw new Error('Failed to fetch difficulty statistics');
        }
    }

    public async saveMcqAttempt(attempt: MCQAttempt): Promise<void> {
        try {
            console.log("Attempt: \n"+attempt);
            await MCQAttemptModel.create(attempt);
        } catch (error) {
            console.error('Error saving MCQ attempt:', error);
            throw new Error('Failed to save MCQ attempt');
        }
    }
}