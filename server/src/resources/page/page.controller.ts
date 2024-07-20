import Controller from "@/utils/interfaces/controller.interface";
import { Router, NextFunction, Request, Response } from "express";
import PageService from "./page.service";
import HttpException from "@/utils/exceptions/http.exception";

export class PageController implements Controller {
    public path = "/pages";
    public router = Router();
    private PageService = new PageService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(
            `${this.path}/:title`,
            this.getNote
        );

        this.router.post(
            `${this.path}`,
            this.postNote
        );

        this.router.put(
            `${this.path}/:title`,
            this.putNote
        );

        this.router.delete(
            `${this.path}/:title`,
            this.deleteNote
        );
    }

    private getNote = async (
        req: Request,
        res:Response,
        next: NextFunction
    ) => {
        try {
            const title = req.params.title
            const notes = await this.PageService.getPage(title)

            res.status(200).json({notes});
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }
    }

    private postNote = async (
        req: Request,
        res:Response,
        next: NextFunction
    ) => {
        try {
            const {title, content} = req.body;
            const note = await this.PageService.postPage(title, content);

            res.status(201).json({note, message: "Note created successfully"});
        } catch(err) {
            next(new HttpException(400, (err as Error).message))
        }
    } 

    private putNote = async (
        req: Request,
        res:Response,
        next: NextFunction
    ) => {        
        try {
            const content = req.body;
            const title = req.params.title;
            const note = await this.PageService.putPage(title, content);

            res.status(201).json({note, message: "Note edited successfully"})
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }
    } 

    private deleteNote = async (
        req: Request,
        res:Response,
        next: NextFunction
    ) => {
        try {
            const title = req.params.title;
            const note = await this.PageService.deletePage(title);

            res.status(200).json({note, message: "Note deleted successfully"})
        } catch (err) {
            next(new HttpException(400, (err as Error).message))
        }
    } 
}