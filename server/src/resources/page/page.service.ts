import userModel from "../user/user.model";
import pageModel from "./page.model";

export default class PageService {
    private pages = pageModel
    private user = userModel

    public async getPage(title: string) {
        try {
            const note = await this.pages.findOne({title});
            return note;
        } catch (err) {
            throw new Error('Note not found')
        }
    }

    public async postPage(title: string, content: string) {
        try  {
            await this.pages.create({title, content});
        } catch (err) {
            throw new Error('Unable to create page')
        }
    }

    public async putPage(title: string, newContent: string) {
        try {
            const note = await this.pages.findOne({title});
            
            if (!note) {
                throw new Error('Note not found');
            }

            note.content = newContent;
            await note.save();
            
        } catch (err) {
            throw new Error('Unable to update page')
        }
    }

    public async deletePage(title: string) {
        try  {
            await this.pages.findOneAndDelete({title});
            
        } catch (err) {
            throw new Error('Unable to delete page')
        }
    }
}