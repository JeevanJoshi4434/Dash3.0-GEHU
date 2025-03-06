import { Request, Response, NextFunction, Locals } from "express";
import { IUser, Location } from "../types/user";
const { validationResult } = require('express-validator'); // For request validation
import User, { UserModel } from "../models/user";
import { globalErrorHandler } from "../utils/errorHandler";
import * as JWT from 'jsonwebtoken';
import { UserRequest } from "../types/express";

class UserController extends User {

    constructor() {
        super();
    }

    // Create a new user
    async create(req: Request, res: Response): Promise<Response | void> {  // Notice the 'void' in the return type
        try {
            // Validate incoming data
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, phone, password, type, location }: IUser = req.body;

            // Creating user through service layer
            const user = await this.createUser(name, phone, password, type, location);
            const token = JWT.sign({ id: user._id, phone: user.phone, role:user.type }, process.env.JWT_SECRET as string, { expiresIn: '3h' });
            return res.status(201).json({ user, token }); // Ensure returning a response
        } catch (error: any) {
            globalErrorHandler(error, res);
        }
    }


    async get(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const { id } = req.user;
            const user = await this.findUserById(id as string);
            console.log(user, id);
            return res.status(200).json(user);
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    async login(req: Request, res: Response): Promise<Response | void> {
        try {
            const { phone, password } = req.body;
            const user = await this.findUserByEmail(phone);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (!this.validatePassword(user, password as string)) {
                return res.status(401).json({ error: 'Invalid password' });
            }
            const token = JWT.sign({ id: user._id, phone: user.phone,role:user.type }, process.env.JWT_SECRET as string, { expiresIn: '3h' });
            return res.status(200).json({ user, token });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    async findFarmers(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const { long, lat } = req.query;
            // Get the user's location
            const findUserLocation = async () => {
                if (!long || !lat) {
                    return await this.findUserById(req.user.id);
                    
                }else{
                    return {
                        location: {
                            type: 'Point',
                            coordinates: [long, lat]
                        }
                    }
                }
            }
            const user = await findUserLocation();
            
            if(!user) return res.status(400).json({ error: 'User not found' });

            const userLocation = user?.location as Location;

            // Define the maximum distance (in meters)
            const maxDistance = 10000; // 10 kilometers

            // Query farmers within the range
            const farmers = await UserModel.find({
                type: 'asha',
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: userLocation.coordinates, // [longitude, latitude]
                        },
                        $maxDistance: maxDistance,
                    },
                },
            });

            return res.status(200).json(farmers);
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }


}

export default UserController;
