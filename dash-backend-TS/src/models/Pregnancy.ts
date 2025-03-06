import { Schema, Model, model } from 'mongoose';
import { preg } from '../types/pregnancy';
import { Nutrition } from '../types/nutrition';
import { TokenOff } from '../types/token';

const pregSchema: Schema<preg> = new Schema({
    userId: { type: String, required: true },
    feedback: { type: [String], required: false },
    token: { type: [Object], required: false },
    nutrition: { type: [Object], required: false },
    programs: { type: [String], required: false },
    date: { type: Date, required: true },
}, { timestamps: true });

export const PregnancyModel: Model<preg> = model<preg>('Pregnancy', pregSchema);

export default class Pregnancy {
    private PregnancyModel: Model<preg>;
    constructor() {
        this.PregnancyModel = PregnancyModel;
    }

    protected createKit(uid: String, date: Date): Promise<preg> {
        return this.PregnancyModel.create({
            userId: uid,
            date: date
        });
    }

    protected addNutrition(uid: String, nutrition: Nutrition): Promise<preg | null> {
        return this.PregnancyModel.findOneAndUpdate({ userId: uid }, { $push: {nutrition: nutrition }}, { new: true });
    }

    protected assignToken(uid: String, token: TokenOff): Promise<preg | null> {
        return this.PregnancyModel.findOneAndUpdate({ userId: uid }, { $push: {token: token} }, { new: true });
    }

    protected addFeedback(uid: String, feedback: any): Promise<preg | null> {
        return this.PregnancyModel.findOneAndUpdate({ userId: uid }, { $push: {feedback: feedback} }, { new: true });
    }

    protected addProgram(uid: String, program: String): Promise<preg | null> {
        return this.PregnancyModel.findOneAndUpdate({ userId: uid }, { $push: {programs: program} }, { new: true });
    }
}