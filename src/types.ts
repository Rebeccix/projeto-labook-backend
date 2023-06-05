export type TUserDB = {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string,
    created_at: string
} 

export type TPostsDB = {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export type TLikes_dislikesDB = {
    user_id: string,
    post_id: string,
    likes: number
}