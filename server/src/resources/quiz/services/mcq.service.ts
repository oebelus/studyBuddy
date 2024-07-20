import { MCQ } from "../interfaces/mcq.interface";
import mcqModel from "../models/mcq.model";
import { Request } from "express";

export default class McqService {
    private mcq = mcqModel;

    public async save(title: string, mcqs: any): Promise<String | Error> {
        try {
            console.log("HERE", title, mcqs);
            
            await this.mcq.create({title, mcqs})
            return "MCQ created successfully";
        } catch (err) {
            throw new Error('Unable to create user')
        }
    }

    public async get(title: string): Promise<MCQ | Error> {
        try {
            const mcq = this.mcq.findOne({title})
            
            return mcq as unknown as MCQ;
        } catch (err) {
            throw new Error('MCQ not found')
        }
    }

    public async getMcqsTitles(
        req: Request
    ): Promise<string[] | Error> {
        try {
            const mcqs = await mcqModel.find();
            
            const mcqsTitles: string[] = [];

            mcqs.forEach((mcq: MCQ) => mcqsTitles.push(mcq.title))

            return mcqsTitles;
        } catch (err) {
            throw new Error('MCQs not found')
        }
    }
}