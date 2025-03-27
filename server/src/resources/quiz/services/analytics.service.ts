import { Types } from 'mongoose';
import { MCQAttemptModel } from '../models/attempts.model';
import { 
    MCQAttempt, 
    DifficultyStats, 
    UserStats, 
    WeeklyData, 
    CategoryStat 
} from '../interfaces/attempt.interface';
import { startOfDay, differenceInDays } from 'date-fns';

export class AnalyticsService {
    public async getUserStats(userId: string): Promise<UserStats> {
        try {
            const [
                mcqsAttempts,
                questionsAnswered,
                recentMCQs,
                categoryStats,
                answersStats,
            ] = await Promise.all([
                MCQAttemptModel.countDocuments({
                    userId,
                answers: { $exists: true, $ne: {} }
                }),
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
                    .limit(30),
                MCQAttemptModel.aggregate([
                    { $match: { userId } },
                    {
                        // Selects specific fields to process
                        // 1: keep these fields as they are
                        $project: {
                            title: 1,
                            category: 1,
                            score: 1,
                            answers: { $objectToArray: '$answers' }
                        }
                    },
                    {
                        // Creates a separate document for each array element (spreading out)
                        // if 2 questions in an attempt -> 2 documents
                        $unwind: '$answers'
                    },
                    {
                        // Groups the documents by category and calculate various aggregations
                        $group: {
                            _id: '$title',
                            avgScore: { $avg: '$score' },
                            totalAttempts: { $sum: 1 },
                            correctAnswers: { $sum: { $cond: [{ $eq: ['$answers.v', true] }, 1, 0] } },
                            wrongAnswers: { $sum: { $cond: [{ $eq: ['$answers.v', false] }, 1, 0] } },
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
                ]),
                MCQAttemptModel.aggregate([
                    { $match: { userId } },
                    {
                        $group: {
                            _id: '$category',
                            count: { $sum: 1 }
                        }
                    }
                ])
            ]);

            const weeklyData: WeeklyData[] = recentMCQs.map((mcq) => {
                const answers = mcq.answers;
                let answersArray: [string, boolean][];
                
                 if (answers instanceof Map) {
                    answersArray = Array.from(answers.entries());
                } else {
                    answersArray = Object.entries(answers);
                }

                const correctAnswers = answersArray.filter((answer) => answer[1]).length;
                const wrongAnswers = answersArray.filter((answer) => !answer[1]).length;
                
                
                return {
                    timestamp: mcq.timestamp,
                    score: mcq.score,
                    questionsAttempted: correctAnswers + wrongAnswers,
                    correctAnswers: correctAnswers || 0,
                    wrongAnswers: wrongAnswers || 0
            }});

            console.log(weeklyData)

            const categoryData: CategoryStat[] = categoryStats.map((stat) => ({
                name: stat._id,
                avgScore: (stat.correctAnswers / stat.totalAttempts) * 100,
                attempts: stat.totalAttempts,
                correctAnswers: stat.correctAnswers || 0,
                wrongAnswers: stat.wrongAnswers || 0
            }));

            const answered: number =  questionsAnswered.length;
            const totalCorrectAnswers: number = answersStats[0]?.correctAnswers;
            const totalWrongAnswers: number = answersStats[0]?.wrongAnswers;
            
            let currentStreak = 0;
            if (recentMCQs.length > 0) {
                const today = startOfDay(new Date());
                let streakOngoing = true;

                for (let i = 0; i < recentMCQs.length && streakOngoing; i++) {
                    const attemptDate = startOfDay(recentMCQs[i].timestamp);
                    const daysDifference = differenceInDays(today, attemptDate);

                    if (daysDifference === currentStreak) {
                        currentStreak++;
                    } else if (daysDifference > currentStreak) {
                        streakOngoing = false;
                    }
                }
            }

            return {
                totalAttempts: mcqsAttempts,
                weeklyData,
                categoryData,
                answered,
                totalCorrectAnswers,
                totalWrongAnswers,
                currentStreak,
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