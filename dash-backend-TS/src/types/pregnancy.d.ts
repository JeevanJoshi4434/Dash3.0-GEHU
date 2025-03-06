import { Nutrition } from "./nutrition";
import { TokenOff } from "./token";

export interface preg{
    _id: string,
    userId: string,
    feedback: string[],
    token: TokenOff[],
    nutrition: Nutrition[],
    programs: string[],
    date: Date
}