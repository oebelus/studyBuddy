import { Document } from "mongoose"

export default interface Page extends Document {
    title: string, 
    content: string,
}