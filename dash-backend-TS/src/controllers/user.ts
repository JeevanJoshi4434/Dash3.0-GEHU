import { Request, Response, NextFunction, Locals } from "express";
import { IUser, Location } from "../types/user";
const { validationResult } = require('express-validator'); // For request validation
import User, { UserModel } from "../models/user";
import { globalErrorHandler } from "../utils/errorHandler";
import * as JWT from 'jsonwebtoken';
import { UserRequest } from "../types/express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../docs');

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req: UserRequest, file, cb) => {
        const uid = req.user?.id ?? 'guest';
        const ext = path.extname(file.originalname);
        const filename = `${uid}_file_${Date.now()}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });
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
            const token = JWT.sign({ id: user._id, phone: user.phone, role: user.type }, process.env.JWT_SECRET as string, { expiresIn: '3h' });
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
            console.log(phone, password);
            const user = await this.findUserByPhone(phone as string);
            console.log(user);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (!this.validatePassword(user, password as string)) {
                return res.status(401).json({ error: 'Invalid password' });
            }
            const token = JWT.sign({ id: user._id, phone: user.phone, role: user.type }, process.env.JWT_SECRET as string, { expiresIn: '3h' });
            return res.status(200).json({ user, token });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    async uploadFile(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            upload.single('file')(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                return res.status(200).json({ message: 'File uploaded successfully', filename: req.file?.filename });
            });
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

                } else {
                    return {
                        location: {
                            type: 'Point',
                            coordinates: [long, lat]
                        }
                    }
                }
            }
            const user = await findUserLocation();

            if (!user) return res.status(400).json({ error: 'User not found' });

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

            return res.status(200).json({list:farmers, type: 'asha'});
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }


}

export default UserController;
