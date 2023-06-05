import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { CreatePostScheama } from "../dto/posts/createPost.dto";
import { GetPostScheama } from "../dto/posts/getPost.dto";
import { EditPostScheama } from "../dto/posts/editPost.dto";
import { DeletePostScheama } from "../dto/posts/deletePost.dto";
import { LikeDislikePostScheama } from "../dto/posts/likeDislike.dto";

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ){}

    public getPost = async (req: Request, res: Response) => {
        try {
            const input = GetPostScheama.parse({
                token: req.headers.authorization
            })
 
            const output = await this.postBusiness.getPost(input)

            res.status(200).send(output)
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message)
            } else if (error instanceof BaseError) {
                res.status(400).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createPost = async (req: Request, res: Response) => {
        try {
            const input = CreatePostScheama.parse({
                token: req.headers.authorization,
                content: req.body.content
            })

            const output = await this.postBusiness.createPost(input)

            res.status(201).send(output)
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message)
            } else if (error instanceof BaseError) {
                res.status(400).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editPost = async (req: Request, res: Response) => {
        try {
            const input = EditPostScheama.parse({
                token: req.headers.authorization,
                idToEditContent: req.params.id,
                content: req.body.content
            })

            const output = await this.postBusiness.editPost(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message)
            } else if (error instanceof BaseError) {
                res.status(400).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deletePost = async (req: Request, res: Response) => {
        try {
            const input = DeletePostScheama.parse({
                token: req.headers.authorization,
                idToDeletePost: req.params.id
            })

            const output = await this.postBusiness.deletePost(input)

            res.status(200).send(output)
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message)
            } else if (error instanceof BaseError) {
                res.status(400).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likeDislike = async (req: Request, res: Response) => {
        try {
            const input = LikeDislikePostScheama.parse({
                token: req.headers.authorization,
                idToLikeDislike: req.params.id,
                likeOrDislike: req.body.like
            })

            const output = await this.postBusiness.likeDislike(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error);
            
            if (error instanceof ZodError) {
                res.status(400).send(error.issues[0].message)
            } else if (error instanceof BaseError) {
                res.status(400).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}