import { NextFunction, Router, Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";
import HttpException from "@/utils/exceptions/http.exception";

class analyticsController {
    public path = '/attempt';
    public router = Router();

    private AnalyticsService = new AnalyticsService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(
            `${this.path}/user`,
            this.getUserStats
        );
        this.router.get(
            `${this.path}/difficulty`,
            this.getDifficultyStats
        );
        this.router.post(
            `${this.path}/mcq`,
            this.postMcqAttempts
        );
    }

    private getUserStats = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.params.userId;
            const userStats = await this.AnalyticsService.getUserStats(userId);
            res.status(200).json(userStats);
        } catch (err) {
            next(new HttpException(400, err instanceof Error ? err.message : 'Failed to get user stats'));
        }
    };

    private getDifficultyStats = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
        const userId = req.params.userId;
        const difficultyStats = await this.AnalyticsService.getDifficultyStats(userId);
        res.status(200).json(difficultyStats);
        } catch (err) {
        next(new HttpException(400, err instanceof Error ? err.message : 'Failed to get difficulty stats'));
        }
    };

    private postMcqAttempts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> => {
        try {
            const { mcqAttempts } = req.body;

            if (!mcqAttempts) {
                throw new Error('No MCQ attempts provided');
            }

            await this.AnalyticsService.saveMcqAttempt(mcqAttempts);
            res.status(201).json({message: "MCQ Attempt Created Successfully"})
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }
    }
}

export default analyticsController;