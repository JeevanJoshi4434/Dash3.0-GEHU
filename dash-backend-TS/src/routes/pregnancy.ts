import { NextFunction, Router, type Request, type Response } from 'express';
import { globalErrorHandler } from '../utils/errorHandler';
import DoctorController from '../controllers/doctor';
import PregnancyController from '../controllers/pragnancy';
import { authenticator } from '../middleware/authenticator';

const router = Router();
const preg = new PregnancyController();

router.post('/', (req:Request, res:Response, next:NextFunction)=>{
    preg.create(req,res).catch(next);
}, globalErrorHandler);


router.put('/feedback', authenticator, (req:Request, res:Response, next:NextFunction)=>{
    preg.feedback(req,res).catch(next);
}, globalErrorHandler);

router.put('/nutritions', authenticator, (req:Request, res:Response, next:NextFunction)=>{
    preg.nutrition(req,res).catch(next);
})

export default router;