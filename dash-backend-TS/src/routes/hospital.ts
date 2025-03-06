import { NextFunction, Router, type Request, type Response } from 'express';
import { globalErrorHandler } from '../utils/errorHandler';
import DoctorController from '../controllers/doctor';
import { authenticator } from '../middleware/authenticator';
import { HospitalController } from '../controllers/hospital';

const router = Router();

const doctor = new HospitalController();


router.post('/', (req: Request, res: Response, next: NextFunction) => {
    doctor.create(req, res).catch(next);
}, globalErrorHandler);

router.post('/near', authenticator, (req:Request, res:Response, next:NextFunction)=>{
    doctor.findNear(req, res).catch(next);
}, globalErrorHandler);

export default router;