import { Router,  Response, NextFunction, Request } from 'express';
import UserController from '../controllers/user';
import { globalErrorHandler } from '../utils/errorHandler';
import { authenticator } from '../middleware/authenticator';


const router = Router();
const userController = new UserController();

// GET request with authenticator middleware
router.get('/', authenticator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.get(req, res); // Use the controller method
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
});

// POST request to create a user
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  userController.create(req, res).catch(next); // Catch errors and pass to next handler
}, globalErrorHandler);

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  userController.login(req, res).catch(next);
}, globalErrorHandler)

router.get('/farmers', authenticator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.findFarmers(req, res); // Use the controller method
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
});

export default router;
