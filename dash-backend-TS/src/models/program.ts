import { Schema, Model, model } from 'mongoose';
import { Program as PG } from '../types/types';
import { Location } from '../types/user';

const programSchema: Schema<PG> = new Schema({
    name: {type: String, required:true},
    id: {type: String, required:true},
    organizer: {type: String, required:true},
    date: {type: Date, required:true},
    location:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

programSchema.index({location: '2dsphere'});

export const ProgramModel: Model<PG> = model<PG>('Program', programSchema);

export default class Program{
    private programModel: Model<PG>;
    
    constructor(){
        this.programModel = ProgramModel;
    }

    protected create(name:String, id:String, organizer:String, date:Date, location:Location): Promise<PG|null> {
        return this.programModel.create({name, id, organizer, date, location});
    }

    protected near(limit:number, page:number, lat: number, long: number): Promise<PG[]> {
        return this.programModel.find({location: { $near: { $geometry: { type: "Point", coordinates: [long, lat] }, $maxDistance: 100000 } } }).limit(limit).skip(limit * (page - 1));
    }

}