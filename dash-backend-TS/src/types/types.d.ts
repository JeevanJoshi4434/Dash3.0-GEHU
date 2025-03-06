import { Schema } from "mongoose";
import { Location } from "./user";

export type mongooseId = Schema.Types.ObjectId;

export interface Stock {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    userId: mongooseId;
    category: string;
    description: string;
    location: Location;
    img: string[];
    active: true;
    bidders: string[];
    currentBidder: Object;
}

export interface Payment{
    _id: string;
    amount: number;
    user: mongooseId;
    date: Date;
    stockDetails: Stock;
    success: boolean;
    transactionId: string;
}

export interface ReturnStocks {
    success: boolean;
    stocks: Stock[];
}


export interface SplitterStocks extends ReturnStocks{
    available: Stock[];
    unavailable: Stock[];
}

export type StockStatus = "available" | "unavailable";

export enum StockStatusEnum {
    AVAILABLE = "available",
    UNAVAILABLE = "unavailable",
    NEAR = "near",
    ALL = "all"
}

export type Org = "doctor" | "asha";
export interface Program{
    _id: String,
    name: String,
    id: String,
    organizer: Org,
    date: Date,
    location: Location
}