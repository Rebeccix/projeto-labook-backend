export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export interface PostModel {
    id: string,
    content: string,
    likes: number,
    dislikes:  number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        name: string
    }
}

export interface PostWithCreatorInfo {
    id: string,
    content: string,
    likes: number,
    dislikes:  number,
    createdAt: string,
    updatedAt: string,
    creatorId: string,
    creatorName: string
}

export interface LikeDislikeDB {
  user_id: string,
  post_id: string,
  likes: number,
}

export enum POST_LIKE {
  ALREADY_LIKED = "ALREADY LIKED",
  ALREADY_DISLIKED = "ALREADY DISLIKED"
}

export class Posts {
    constructor(
            private id: string,
            private content: string,
            private likes: number,
            private dislikes: number,
            private createdAt: string,
            private updatedAt: string,
            private creatorId: string,
            private creatorName: string
        ){}  

        public toPostDBModel(): PostDB {
            return {
              id: this.id,
              creator_id: this.creatorId,
              content: this.content,
              likes: this.likes,
              dislikes: this.dislikes,
              created_at: this.createdAt,
              updated_at: this.updatedAt
            };
          }

          public toPostBusinessModel(): PostModel {
            return {
                id: this.id,
                content: this.content,
                likes: this.likes,
                dislikes: this.dislikes,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
                creator: {
                  id: this.creatorId,
                  name: this.creatorName
                }
              }
          }

          public setContent(value: string): void {
            this.content = value
          }

          public addLike(): void {
            this.likes++
          }

          public removeLike(): void {
            this.likes--
          }

          public addDislike(): void {
            this.dislikes++
          }

          public removeDislike(): void {
            this.dislikes--
          }
}