import z from 'zod'

export interface EditPostInputDTO {
    token: string,
    idToEditContent: string,
    content: string,
}

export type EditPostOutputDTO = undefined

export const EditPostScheama = z.object({
    token: z.string().min(1),
    idToEditContent: z.string(),
    content: z.string().min(1)
}).transform(data => data as EditPostInputDTO)