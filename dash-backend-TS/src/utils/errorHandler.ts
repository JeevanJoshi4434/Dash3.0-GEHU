import { Request, Response, NextFunction } from "express";
import Logger from "./errorlogger";

// Custom error class for throwing errors
class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}


const logger = Logger.getInstance();

export const globalErrorHandler = (err: any, res: Response) => {
    const statusCode = err.statusCode || 500;
    if (statusCode === 500) {
        logger.logError(`${!err.statusCode ? 'Spotted Without Status Code ' : ' '}${err}`);
    }
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ error: message });
};