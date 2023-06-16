import z from 'zod'

export interface LikeDislikePostInputDTO {
    token: string,
    idToLikeDislike: string,
    likeOrDislike: boolean
}

export type LikeDislikePostOutputDTO = undefined

export const LikeDislikePostScheama = z.object({
    token: z.string().min(1),
    idToLikeDislike: z.string().min(1),
    likeOrDislike: z.boolean()
}).transform(data => data as LikeDislikePostInputDTO)