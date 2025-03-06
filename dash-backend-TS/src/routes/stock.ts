import { Router, Response, NextFunction, Request } from 'express';
import { authenticator } from '../middleware/authenticator';
import StockController from '../controllers/stock';
import { globalErrorHandler } from '../utils/errorHandler';




const router = Router();

const stock = new StockController();

//GET Request to get all stocks for a user or all stocks

router.get('/', authenticator, (req: Request, res: Response) => {
    const { type } = req.query;
    if (type === 'available') {
        stock.getAvailableStocks(req, res).catch((error: any) => globalErrorHandler(error, res));
    }
    else if (type === 'unavailable') {
        stock.getUnavailableStocks(req, res).catch((error: any) => globalErrorHandler(error, res));
    }
    else if (type === 'near') {
        stock.getNearStocks(req, res).catch((error: any) => globalErrorHandler(error, res));
    }
    else {
        stock.getUserStocks(req, res);
    }
});

router.put('/image/:id', authenticator, (req: Request, res: Response) => {
    stock.uploadImages(req, res).catch((error: any) => globalErrorHandler(error, res));
})


//POST Request to create a stock
router.post('/', authenticator, (req: Request, res: Response) => {
    stock.create(req, res).catch((error: any) => globalErrorHandler(error, res));
});



export default router;
