import { Types } from 'mongoose';
import { MCQAttemptModel } from '../models/attempts.model';
import { 
    MCQAttempt, 
    DifficultyStats, 
    UserStats, 
    WeeklyData, 
    CategoryStat 
} from '../interfaces/attempt.interface';
import { startOfDay, differenceInDays, subDays } from 'date-fns';

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
                // Sort attempts by date (newest first)
                const sortedAttempts = [...recentMCQs].sort((a, b) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );

                const today = startOfDay(new Date());
                let previousDate = startOfDay(sortedAttempts[0].timestamp);
                
                // Check if most recent attempt was today or yesterday
                if (differenceInDays(today, previousDate) === 0) {
                    // Started streak today
                    currentStreak = 1;
                } else if (differenceInDays(today, previousDate) === 1) {
                    // Last attempt was yesterday
                    currentStreak = 1;
                }
                
                // Check previous days for consecutive streak
                for (let i = 1; i < sortedAttempts.length; i++) {
                    const currentDate = startOfDay(sortedAttempts[i].timestamp);
                    const daysDiff = differenceInDays(previousDate, currentDate);
                    
                    if (daysDiff === 1) {
                        // Consecutive day found
                        currentStreak++;
                        previousDate = currentDate;
                    } else if (daysDiff > 1) {
                        // Streak broken
                        break;
                    }
                    // If daysDiff === 0, it's the same day - skip
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