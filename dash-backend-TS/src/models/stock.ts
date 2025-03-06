import { Schema, Model, model } from 'mongoose';
import { Stock as STK } from '../types/types';

const stockSchema: Schema<STK> = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        img: [],
        location: {
            type: {
                type: String,
                enum: ['Point'],  // Type should be 'Point'
                required: true
            },
            coordinates: {
                type: [Number],  // Coordinates should be [longitude, latitude]
                required: true
            }
        },
    },
    { timestamps: true }
)

stockSchema.index({ location: '2dsphere' });

export const StockModel: Model<STK> = model<STK>('Stock', stockSchema);

class Stock {
    private stockModel: Model<STK>;

    constructor() {
        this.stockModel = StockModel;
    }

    protected createStock(name: string, price: number, quantity: number, userId: string, category: string, description: string, location: object): Promise<STK> {
        const stock = new this.stockModel({ name, price, quantity, userId, category, description, location });
        return stock.save();
    }

    protected getStock(userId: string): Promise<STK[]> {
        const stocks = this.stockModel.find({userId: userId }).exec();
        return stocks;
    }

    protected findStockById(stockId: string): Promise<STK | null> {
        return this.stockModel.findOne({ _id: stockId }).exec();
    }

    protected updateStock(stockId: string, name: string, price: number, quantity: number, category: string, description: string, location: object): Promise<STK | null> {
        return this.stockModel.findOneAndUpdate(
            { _id: stockId },
            { name, price, quantity, category, description, location },
            { new: true }
        ).exec();
    }
}

export default Stock;