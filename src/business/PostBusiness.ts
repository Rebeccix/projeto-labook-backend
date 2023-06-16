import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dto/posts/createPost.dto"
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dto/posts/deletePost.dto"
import { EditPostInputDTO, EditPostOutputDTO } from "../dto/posts/editPost.dto"
import { GetPostInputDTO, GetPostOutputDTO } from "../dto/posts/getPost.dto"
import { LikeDislikePostInputDTO, LikeDislikePostOutputDTO } from "../dto/posts/likeDislike.dto"
import { ForbiddenError } from "../errors/ForbidenError"
import { NotFoundError } from "../errors/NotFoundError"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { LikeDislikeDB, POST_LIKE, PostModel, Posts } from "../models/Posts"
import { USER_ROLES } from "../models/User"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public getPost = async (input : GetPostInputDTO): Promise<GetPostOutputDTO> => {
        const { token } = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        } 

        const postDB = await this.postDatabase.getPostWithCreatorInfo()

        const output: GetPostOutputDTO = postDB
        .map((postWithCreatorName) => {
            const post = new Posts(
                postWithCreatorName.id,
                postWithCreatorName.content,
                postWithCreatorName.likes,
                postWithCreatorName.dislikes,
                postWithCreatorName.createdAt,
                postWithCreatorName.updatedAt,
                postWithCreatorName.creatorId,
                postWithCreatorName.creatorName,
            ) 
            return post.toPostBusinessModel()
        })

        return output

    }

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        const { token, content } = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const id = this.idGenerator.generate()

        const post = new Posts(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )

        const postDB = post.toPostDBModel()
        await this.postDatabase.insertPost(postDB)

        const output: CreatePostOutputDTO = undefined

        return output
    }

    public editPost = async (input: EditPostInputDTO): Promise<EditPostOutputDTO> => {
        const { token, idToEditContent, content } = input
        
        const payload = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const postDB = await this.postDatabase.findPostById(idToEditContent)
        
        if(!postDB) {
            throw new NotFoundError("Post não existe")
        }

        if(postDB.creator_id !== payload.id) {
            throw new ForbiddenError("somente quem criou a post pode editá-la")
        }

        const post = new Posts (
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            postDB.creator_id,
            payload.name
        )

        post.setContent(content)

        const updatePostDB = post.toPostDBModel()

        await this.postDatabase.updatePost(updatePostDB)
        
        const output: EditPostOutputDTO = undefined

        return output
    }

    public deletePost = async (input: DeletePostInputDTO): Promise<DeletePostOutputDTO> => {
        const { token, idToDeletePost } = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const postDB = await this.postDatabase.findPostById(idToDeletePost)

        if(!postDB) {
            throw new NotFoundError("Post não existe")
        }
        console.log(payload);
        
        if(payload.role !== USER_ROLES.ADMIN) {
            if(payload.id !== postDB.creator_id) {
                throw new ForbiddenError("Somente quem criou o post pode apagá-lo")
            }
        }
        
        await this.postDatabase.deletePost(idToDeletePost)

        const output: DeletePostOutputDTO = undefined

        return output
    }

    public likeDislike = async (input: LikeDislikePostInputDTO) => {
        const { token, idToLikeDislike, likeOrDislike } = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const postDB = await this.postDatabase.findPostWithCreatorInfoById(idToLikeDislike)

        if(!postDB) {
            throw new NotFoundError("Post não existe")
        }
        
        const post = new Posts (
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.createdAt,
            postDB.updatedAt,
            postDB.creatorId,
            postDB.creatorName  
        )

        const like = likeOrDislike ? 1 : 0 

        const likeDislikeDB: LikeDislikeDB = {
            user_id: payload.id,
            post_id: postDB.id,
            likes: like
        }
        
        const likeDislikeExist = await this.postDatabase.findLikeDislike(likeDislikeDB)

        if( likeDislikeExist === POST_LIKE.ALREADY_LIKED ){
            if(likeOrDislike) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            } 
        } else if ( likeDislikeExist === POST_LIKE.ALREADY_DISLIKED ) {
            if (!likeOrDislike) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            }
        } else {
            await this.postDatabase.insertLikeDislike(likeDislikeDB)
            likeOrDislike ? post.addLike() : post.addDislike()
        }
        
        const updatedPostDB = post.toPostDBModel() 
        await this.postDatabase.updatePost(updatedPostDB)

        const output: LikeDislikePostOutputDTO = undefined

        return output
    }
}