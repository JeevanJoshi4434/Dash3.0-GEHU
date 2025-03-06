import { Request, Response, NextFunction, Locals } from "express";
import { globalErrorHandler } from "../utils/errorHandler";
import * as JWT from 'jsonwebtoken';
import { UserRequest } from "../types/express";
import Stock, { StockModel } from "../models/stock";
import User, { UserModel } from "../models/user";
import { Location } from "../types/user";
import { ReturnStocks, SplitterStocks } from "../types/types";
import path from "path";
import fs from 'fs';
import multer from "multer";
const { validationResult } = require('express-validator');


class StockController extends Stock {
    private userService: User;
    constructor() {
        super();
        this.userService = new User();

        const dir = path.join(__dirname, '../images/stock');

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    async create(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            // Validate incoming data
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, quantity, price, description, category, location } = req.body;

            // Creating user through service layer
            const stock = await this.createStock(name, price, quantity, req.user.id, category, description, location);
            return res.status(201).json({ stock });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    async getUserStocks(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const { id } = req.user;
            const stocks = await StockModel.find({ userId: id }).exec();
            console.log(id, stocks);
            return res.status(200).json(stocks);
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    async get(req: UserRequest): Promise<ReturnStocks> {
        try {
            const { id } = req.user;
            const stock = await this.getStock(id as string);
            return { success: true, stocks: stock };
        } catch (error) {
            throw error;
        }
    }

    private async filterStocks(req: UserRequest): Promise<SplitterStocks> {
        try {
            const result = await this.get(req);
            const availableStocks = result.stocks?.filter(stock => stock.quantity > 0);
            return {
                success: true,
                stocks: [],
                available: availableStocks || [],
                unavailable: result.stocks?.filter(stock => stock.quantity === 0) || []
            }
        } catch (error) {
            throw error;
        }
    }

    async getAvailableStocks(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const result = await this.filterStocks(req);
            return res.status(200).json(result.available);
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    async getUnavailableStocks(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const result = await this.filterStocks(req);
            return res.status(200).json(result.unavailable);
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    async getNearStocks(req: UserRequest, res: Response): Promise<Response | void> {
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

            const stocks = await StockModel.find({
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

            return res.status(200).json({ stocks });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }


    private upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                const dir = path.join(__dirname, '../images/stck');
                cb(null, dir);
            },
            filename: (req, file, cb) => {
                const date = new Date();
                const timestamp = date.toISOString().replace(/[:.]/g, '-');
                const ext = path.extname(file.originalname);
                const name = `${file.fieldname}-${timestamp}${ext}`;
                cb(null, name);
            }
        })
    }).array('images', 10); // Allow up to 10 images

    async uploadImages(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            // Handle file upload
            this.upload(req, res, async (err: any) => {
                if (err) {
                    return res.status(400).json({ error: 'File upload failed', details: err.message });
                }

                // Ensure files are present
                if (!req.files || req.files.length === 0) {
                    return res.status(400).json({ error: 'No files uploaded' });
                }

                // Extract file paths
                const uploadedFiles = (req.files as Express.Multer.File[]).map(file => {
                    const relativePath = path.relative(path.join(__dirname, '../'), file.path);
                    return relativePath.replace(/\\/g, '/'); // Convert Windows-style paths to URL-friendly paths
                });

                // Update the stock document with the image paths
                const stock = await StockModel.findByIdAndUpdate(
                    req.params.id,
                    { $push: { images: { $each: uploadedFiles } } }, // Push multiple images into the array
                    { new: true } // Return the updated document
                ).exec();

                // Check if stock exists
                if (!stock) {
                    return res.status(404).json({ error: 'Stock not found' });
                }

                // Respond with the updated stock
                return res.status(200).json({ message: 'Images uploaded and stock updated successfully', stock });
            });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }
    

}

export default StockController;
