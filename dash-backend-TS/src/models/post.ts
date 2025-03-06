import { Schema, Model, model } from 'mongoose';
import { comment, Post as PS } from '../types/post';

const postSchema: Schema<PS> = new Schema({
    text: { type: String, required: true },
    like: { type: Number, default: 0 },
    comments: { type: [Object], default: [] },
    time: { type: Date, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
}, { timestamps: true });
postSchema.index({ location: '2dsphere' });

export const PostModel = model<PS>('Post', postSchema);


export default class Post {
    private postModel: Model<PS>;

    constructor() {
        this.postModel = PostModel;
    }

    protected create({ text, like, location }:{text:String, like:number, location:any}): Promise<PS | null> {
        return this.postModel.create({
            text,
            like,
            location,
            time: new Date()
        });
    }

    protected like(id: string): Promise<PS | null> {
        return this.postModel.findOneAndUpdate({ _id: id }, { $inc: { like: 1 } }, { new: true });
    }

    protected comment(pid:String,{ id, text, reply, time }: {id:string, text:string, reply:[], time:Date}): Promise<PS | null> {
        return this.postModel.findOneAndUpdate({ _id: pid }, { $push: { comments: {id, text, reply, time } } }, { new: true });
    }
}

