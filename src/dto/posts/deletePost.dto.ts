import z from "zod"

export interface DeletePostInputDTO {
    token: string,
    idToDeletePost: string
}

export type DeletePostOutputDTO = undefined

export const DeletePostScheama = z.object({
    token: z.string().min(1),
    idToDeletePost: z.string()
}).transform(data => data as DeletePostInputDTO)