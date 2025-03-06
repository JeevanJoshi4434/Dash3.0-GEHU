import { Location } from "./user";

export interface Doctor{
    _id: string,
    name: string,
    phone: string,
    specialization: string,
    experience: string,
    fee: number,
    password: string,
    location: Location,
}

export interface Hospital {
    _id: string,
    name: string,
    beds: number,
    occupiedBeds: number,
    location: Location
}

export type GETTYPE = 'phone' | 'name' | 'id';