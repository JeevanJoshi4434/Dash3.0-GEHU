import { Location } from "./user";

type user = "doctor" | "user" | "asha";

export type comment = {
    id: string,
    text: string,
    reply: comment[],
    time: Date
}

export interface Post {
    _id: string,
    text: string,
    like: number,
    comments: comment[],
    time: Date,
    location: Location
}