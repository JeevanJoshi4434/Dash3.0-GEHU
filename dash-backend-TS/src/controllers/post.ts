import {Response} from "express";
import { globalErrorHandler } from "../utils/errorHandler";
import Doctor from "../models/doctor";
import User from "../models/user";
import { UserRequest } from "../types/express";

import Program from "../models/program";
import Pregnancy from "../models/Pregnancy";
import Post from "../models/post";


export class PostController extends Post {
    private userService: User;

    constructor() {
        super();
        this.userService = new User();
    }


    public async createPost(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const { title, description } = req.body;
            const user = await this.userService.findUserById(req.user.id);
            if (!user) {
                return res.status(404).json("User not found");
            }
            const postData = {
                text: title,
                like: 0,
                location: user.location,
            };
            const post = await this.create(postData);
            res.status(200).json({ success: true, post });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    public async likePost(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const { postId } = req.body;

            const updatedPost = await this.like(postId);
            if (!updatedPost) {
                return res.status(404).json("Post not found");
            }
            res.status(200).json({ success: true, post: updatedPost });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    public async commentPost(req: UserRequest, res: Response): Promise<Response | void> {
        try {
            const { postId } = req.body;

            const updatedPost = await this.comment(postId, { id: req.user.id, text: req.body.comment, reply:[], time: new Date() });
            if (!updatedPost) {
                return res.status(404).json("Post not found");
            }
            res.status(200).json({ success: true, post: updatedPost });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }
}

