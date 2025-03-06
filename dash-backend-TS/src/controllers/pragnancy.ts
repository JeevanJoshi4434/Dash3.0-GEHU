import { Request, Response, NextFunction, Locals } from "express";
import { globalErrorHandler } from "../utils/errorHandler";
import Doctor, { DoctorModel } from "../models/doctor";
import User from "../models/user";
import { UserRequest } from "../types/express";
import Pregnancy from "../models/Pregnancy";
import { TokenOff } from "../types/token";
import { Nutrition } from "../types/nutrition";

class PregnancyController extends Pregnancy{
    private doctorService: Doctor;
    private userService: User;
    private pregService: Pregnancy;
    
    constructor(){
        super();
        this.doctorService = new Doctor();
        this.userService = new User();
        this.pregService = new Pregnancy();
    }

    public async create(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const {date} = req.body;
            const kit = await this.createKit(req.user.id, new Date(date));
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    public async feedback(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const feedbak = this.procesFeedBack();
            await this.addFeedback(req.user.id, feedbak);
            const token = await this.getToken();
            await this.assignToken(req.user.id, token);
            res.status(200).json({success: true, token:token});
        }catch (error) {
            globalErrorHandler(error, res);
        }
    }

    public async nutrition(req: UserRequest, res: Response): Promise<Response|void> {
        try {
            const ntr = await this.processNtr();
            await this.addNutrition(req.user.id, ntr);
            res.status(200).json({success:true, nutrition:ntr});
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    private async procesFeedBack(){
        const feedback = [
            {
                Qs:"",
                ans:""
            },
            {
                Qs:"",
                ans:""
            },
            {
                Qs:"",
                ans:""
            },
        ]
        return feedback;
    }

    private async processNtr(): Promise<Nutrition>{
        return{
            assigned: new Date(),
            details: "lorem epsum"
        }
    }
    private async getToken(): Promise<TokenOff>{
        return {
            validTill: new Date(), 
            discount: 12,
            assigned: new Date()
        }
    }
}

export default PregnancyController;