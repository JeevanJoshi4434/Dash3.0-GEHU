import { NextFunction, Router, type Request, type Response } from 'express';
import { globalErrorHandler } from '../utils/errorHandler';
import DoctorController from '../controllers/doctor';
import { authenticator } from '../middleware/authenticator';

const router = Router();

const doctor = new DoctorController();

// GET requests
router.get('/near', authenticator, (req:Request, res:Response, next:NextFunction)=>{
    doctor.findNearDoctor(req, res).catch(next);
}, globalErrorHandler);

// POST request to create a doctor
router.post('/', (req: Request, res: Response, next: NextFunction) => {
    doctor.create(req, res).catch(next);
}, globalErrorHandler);

router.post('/login', (req: Request, res: Response, next: NextFunction)=>{
    doctor.login(req, res).catch(next);
}, globalErrorHandler);


export default router;