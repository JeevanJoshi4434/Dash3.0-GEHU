import { Schema, Model, model } from 'mongoose';
import { Doctor as DC, GETTYPE } from "../types/doctor";


const doctorSchema: Schema<DC> = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        specialization: { type: String, required: true },
        experience: { type: String, required: true },
        password: { type: String, required: true },
        fee: { type: Number, required: true },
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

    }
)

doctorSchema.index({ location: '2dsphere' });

export const DoctorModel: Model<DC> = model<DC>('Doctor', doctorSchema);


export default class Doctor {
    private doctorModel: Model<DC>;

    constructor() {
        this.doctorModel = DoctorModel;
    }

    protected createDoctor(name: String, password: String, phone: Number, specialization: String, experience: String, fee: Number, location: object): Promise<DC> {
        const doctor = new this.doctorModel({
            name: name,
            phone: phone,
            password: password,
            location: location,
            experience: experience,
            specialization: specialization,
            fee: fee
        })
        return doctor.save();
    }

    protected async loginDoctor(phone: String, password: String): Promise<DC> {
        const doctor = await this.doctorModel.findOne({ phone: phone, password: password });
        if(!doctor){
            throw new Error("Doctor not found");
        }
        return doctor;
    }
    protected async getDoctor(type: GETTYPE, userId: string): Promise<DC | null> {
        try {
            if (type === 'id') {
                const doctor = await this.doctorModel.findById(userId);
                return doctor;
            } else if (type === 'phone') {
                const doctor = await this.doctorModel.findOne({ phone: userId });
                return doctor;
            } else {
                console.error(`Invalid GETTYPE: ${type}`);
                return null;
            }
        } catch (error) {
            console.error("Error fetching doctor:", error);
            return null;
        }
    }
}