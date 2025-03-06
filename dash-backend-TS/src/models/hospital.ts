import { Schema, Model, model } from 'mongoose';
import { Hospital as HS } from '../types/doctor';


const hospitalSchema: Schema<HS> = new Schema({
    name: {type: String, required: true},
    beds: {type: Number, required: true},
    occupiedBeds: {type: Number, default:0},
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
    }
})

hospitalSchema.index({location: '2dsphere'});

const HospitalModel = model<HS>('Hospital', hospitalSchema);

export default class Hospital {
    private hospitalModel: Model<HS>;

    constructor() {
        this.hospitalModel = HospitalModel;
    }    

    public async createHospital(name:string, beds:number, location:Location): Promise<HS> {
        const createdHospital = await this.hospitalModel.create({
            name,
            beds,
            location
        });
        return createdHospital;
    }

    public async getHospitals(limit:number, page:number, lat: number, long: number): Promise<HS[]> {
        return this.hospitalModel.find({location: { $near: { $geometry: { type: "Point", coordinates: [long, lat] }, $maxDistance: 100000 } } }).limit(limit).skip(limit * (page - 1));
    }
}