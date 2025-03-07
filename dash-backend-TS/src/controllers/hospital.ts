import { Request, Response, NextFunction, Locals } from "express";
import { globalErrorHandler } from "../utils/errorHandler";
import * as JWT from 'jsonwebtoken';
import Doctor, { DoctorModel } from "../models/doctor";
import User from "../models/user";
import { UserRequest } from "../types/express";
import { Location } from "../types/user";
import Hospital from "../models/hospital";



export class HospitalController extends Hospital {
    private doctorService: Doctor;
    private userService: User;
    constructor() {
        super();
        this.doctorService = new Doctor();
        this.userService = new User();
    }


    public async create(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const { name, location, beds } = req.body;
            const hospital = await this.createHospital(name, beds, location);
            res.status(200).json({ success: true, hospital });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }


    public async findNear(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const { lat, long,page } = req.body;
            console.log(lat, long, page);
            const nearHospitals = await this.getHospitals(30, page, lat, long);
            res.status(200).json({ success: true, list:nearHospitals, type: "hospital" });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }
}