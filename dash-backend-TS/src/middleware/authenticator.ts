import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import { UserModel as User } from '../models/user';
import { UserRequest } from '../types/express';
import { globalErrorHandler } from '../utils/errorHandler';

export const onlyVolunteers = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization') as string;
        if (!token) {
            console.log('No token found');
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if(token.split(' ')[0] !== 'Bearer'){
            res.status(422).json({ message: 'The server expected a Bearer token in the Authorization header but get a ' + token.split(' ')[0] + 'token' });
            return
        }

        // Type the decoded object to include the id
        const decoded = verify(token.split(' ')[1], process.env.JWT_SECRET as string) as JwtPayload & { id: string, phone: string };
        if(decoded.role != 'doctor' && decoded.role != 'asha'){
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
       
        req.user = decoded;  // Assign user to request object
        next();  // Call next() to pass control to the next middleware/route handler
    } catch (error) {
        globalErrorHandler(error, res);
    }
}


export const authenticator = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization') as string;
        if (!token) {
            console.log('No token found');
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if(token.split(' ')[0] !== 'Bearer'){
            res.status(422).json({ message: 'The server expected a Bearer token in the Authorization header but get a ' + token.split(' ')[0] + 'token' });
            return
        }

        // Type the decoded object to include the id
        const decoded = verify(token.split(' ')[1], process.env.JWT_SECRET as string) as JwtPayload & { id: string, phone: string };
       
        req.user = decoded;  // Assign user to request object
        next();  // Call next() to pass control to the next middleware/route handler
    } catch (error) {
        globalErrorHandler(error, res);
    }
};
