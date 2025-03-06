import { NextFunction, Router, type Request, type Response } from 'express';
import { globalErrorHandler } from '../utils/errorHandler';
import { authenticator, onlyVolunteers } from '../middleware/authenticator';
import { PostController } from '../controllers/post';

const router = Router();
const post = new PostController();

router.post('/', authenticator, (req:Request, res:Response, next:NextFunction)=>{
    post.createPost(req, res).catch(next);    
}, globalErrorHandler)


router.put('/like', authenticator, (req:Request, res:Response, next:NextFunction)=>{
    post.likePost(req, res).catch(next);
}, globalErrorHandler)

router.put('/comment', authenticator, onlyVolunteers, (req:Request, res:Response, next:NextFunction)=>{
    post.likePost(req, res).catch(next);
}, globalErrorHandler)


export default router;