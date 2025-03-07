import { Request, Response, NextFunction, Locals } from "express";
import { globalErrorHandler } from "../utils/errorHandler";
import * as JWT from 'jsonwebtoken';
import Doctor, { DoctorModel } from "../models/doctor";
import User from "../models/user";
import { UserRequest } from "../types/express";
import { Location } from "../types/user";

/**
 * @class DoctorController
 * @description This class is used to create a doctor
 */
class DoctorController extends Doctor {
    private doctorService: Doctor;
    private userService: User;
    constructor() {
        super();
        this.doctorService = new Doctor();
        this.userService = new User();
    }

    /**
     * 
     * @param req {name:String, password:String, phone:Number, specialization:String, experience:String, fee: Number, location: object}
     * @param res 200 | 500
     * @returns "{success:true, result}"
     */
    async create(req: Request, res: Response) {
        try {
            const { name, phone, password, location } = req.body;
            
            const result = await this.createDoctor(name, password, phone, "abcd", "2", 231232, location);
            const token = JWT.sign({ id: result._id, phone: result.phone,role:"doctor" }, process.env.JWT_SECRET as string, { expiresIn: '10d' });
            return res.status(201).json({ success: true, user:result, token });
        } catch (error) {
            globalErrorHandler(error, res);
        }

    }

    async login(req:Request, res:Response){
        try {
            const {phone, password} = req.body;
            const doctor = await this.loginDoctor(phone, password);
            if(!doctor){
                return res.status(404).json("Doctor not found");
            }
            const token = JWT.sign({ id: doctor._id, phone: doctor.phone, role:"doctor" }, process.env.JWT_SECRET as string, { expiresIn: '10d' });
            res.status(200).json({succes:true, user:doctor, token});
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }


    async findNearDoctor(req: UserRequest, res: Response):Promise<Response | void> {
        try {
            const { long, lat } = req.query;
            let { limit, page } = req.query;

            // Convert limit and page to numbers after ensuring they are strings 
            const limitNumber = limit ? parseInt(limit as string, 10) : 10; // Default limit to 10 if not provided
            const pageNumber = page ? parseInt(page as string, 10) : 1;    // Default page to 1 if not provided

            // Get the user's location
            const findUserLocation = async () => {
                if (!long || !lat) {
                    return await this.userService.findUserById(req.user.id);
                } else {
                    return {
                        location: {
                            type: 'Point',
                            coordinates: [parseFloat(long as string), parseFloat(lat as string)]
                        }
                    };
                }
            };

            const user = await findUserLocation();
            if (!user) return res.status(400).json({ error: 'User not found' });
            console.log(user);
            const userLocation = user?.location as Location;
            const maxDistance = 10000; // 10 kilometers

            const doctors = await DoctorModel.find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [userLocation.coordinates[0], userLocation.coordinates[1]]
                        },
                        $maxDistance: maxDistance
                    }
                }
            })
                .limit(limitNumber)
                .skip((pageNumber - 1) * limitNumber).exec(); // Skip for pagination

            return res.status(200).json({success:true, list: doctors, type: 'doctor'});
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }
}

export default DoctorController;