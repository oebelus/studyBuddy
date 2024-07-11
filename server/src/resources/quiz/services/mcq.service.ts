import mcqModel from "../models/mcq.model";

export default class McqService {
    private mcq = mcqModel;

    public async save(title: string, question: string, options: [string], answers: [number]): Promise<String | Error> {
        try {
            const mcq = await this.mcq.create({title, question, options, answers})
            return "MCQ created successfully";
        } catch (err) {
            throw new Error('Unable to create user')
        }
    }
}