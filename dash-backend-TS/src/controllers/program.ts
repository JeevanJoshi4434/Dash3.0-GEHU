import { Request, Response, NextFunction, Locals } from "express";
import { globalErrorHandler } from "../utils/errorHandler";
import * as JWT from 'jsonwebtoken';
import Doctor, { DoctorModel } from "../models/doctor";
import User from "../models/user";
import { UserRequest } from "../types/express";
import { Location } from "../types/user";
import Program from "../models/program";
import Pregnancy from "../models/Pregnancy";



class ProgramController extends Program{
    private doctorService: Doctor;
    private userService: User;
    private pregService: Pregnancy;
    private programService: Program;

    constructor() {
        super();
        this.doctorService = new Doctor();
        this.userService = new User();
        this.pregService = new Pregnancy();
        this.programService = new Program();
    }

    public async createProgram(req:UserRequest, res:Response): Promise<Response | void>{
        try {
            const {name, id, date, location} = req.body;
            const program = await this.create(name, id, req.user.id, new Date(date), location);
            res.status(200).json({success:true, program});
        } catch (error) {
            globalErrorHandler(error, res);
        }
    } 

    public async nearPrograms(req:UserRequest, res:Response): Promise<Response | void>{
        try {
            const {limit, page, lat, long} = req.body; 
            const programs = await this.near(limit, page, lat, long);
            res.status(200).json({success:true, programs});
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }
}

