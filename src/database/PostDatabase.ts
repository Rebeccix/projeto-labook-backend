import { LikeDislikeDB, POST_LIKE } from "../models/Posts";
import { PostDB, PostWithCreatorInfo } from "../models/Posts";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static POSTS_TABLE = "posts";
  public static LIKES_DISLIKES_TABLE = "likes_dislikes";

  public async getPostWithCreatorInfo() {
    const result: PostWithCreatorInfo[] = await BaseDatabase.connection(
      PostDatabase.POSTS_TABLE
    )
      .select(
        `${PostDatabase.POSTS_TABLE}.id`,
        `${PostDatabase.POSTS_TABLE}.content`,
        `${PostDatabase.POSTS_TABLE}.likes`,
        `${PostDatabase.POSTS_TABLE}.dislikes`,
        `${PostDatabase.POSTS_TABLE}.likes`,
        `${PostDatabase.POSTS_TABLE}.created_At as createdAt`,
        `${PostDatabase.POSTS_TABLE}.updated_At as updatedAt`,
        `${UserDatabase.USER_TABLES}.id as creatorId`,
        `${UserDatabase.USER_TABLES}.name as creatorName`
      )
      .join(
        UserDatabase.USER_TABLES,
        `${PostDatabase.POSTS_TABLE}.creator_id`,
        "=",
        `${UserDatabase.USER_TABLES}.id`
      );

    return result;
  }

  public async insertPost(post: PostDB): Promise<void> {
    await BaseDatabase.connection(PostDatabase.POSTS_TABLE).insert(post);
  }

  public async findPostById(id: string): Promise<PostDB | undefined> {
    const [result]: PostDB[] | undefined = await BaseDatabase.connection(
      PostDatabase.POSTS_TABLE
    )
      .select()
      .where({ id });

    return result;
  }

  public async updatePost(post: PostDB): Promise<void> {
    await BaseDatabase.connection(PostDatabase.POSTS_TABLE)
      .update(post)
      .where({ id: post.id });
  }

  public async deletePost(id: string): Promise<void> {
    await BaseDatabase.connection(PostDatabase.POSTS_TABLE)
      .delete()
      .where({ id });
  }

  public async findPostWithCreatorInfoById(
    id: string
  ): Promise<PostWithCreatorInfo | undefined> {
    const [result]: PostWithCreatorInfo[] | undefined =
      await BaseDatabase.connection(PostDatabase.POSTS_TABLE)
        .select(
          `${PostDatabase.POSTS_TABLE}.id`,
          `${PostDatabase.POSTS_TABLE}.content`,
          `${PostDatabase.POSTS_TABLE}.likes`,
          `${PostDatabase.POSTS_TABLE}.dislikes`,
          `${PostDatabase.POSTS_TABLE}.likes`,
          `${PostDatabase.POSTS_TABLE}.created_At as createdAt`,
          `${PostDatabase.POSTS_TABLE}.updated_At as updatedAt`,
          `${UserDatabase.USER_TABLES}.id as creatorId`,
          `${UserDatabase.USER_TABLES}.name as creatorName`
        )
        .join(
          UserDatabase.USER_TABLES,
          `${PostDatabase.POSTS_TABLE}.creator_id`,
          "=",
          `${UserDatabase.USER_TABLES}.id`
        )
        .where(`${PostDatabase.POSTS_TABLE}.id`, id);

    return result;
  }

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<POST_LIKE | undefined> => {
    const [result]: LikeDislikeDB[] | undefined = await BaseDatabase.connection(
      PostDatabase.LIKES_DISLIKES_TABLE
    )
      .select()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });

    if (result === undefined) {
      return undefined;
    } else if (result.likes === 1) {
      return POST_LIKE.ALREADY_LIKED;
    } else {
      return POST_LIKE.ALREADY_DISLIKED;
    }
  };

  public insertLikeDislike = async (
    likeDislike: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.LIKES_DISLIKES_TABLE).insert(
      likeDislike
    );
  };

  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.LIKES_DISLIKES_TABLE)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.LIKES_DISLIKES_TABLE)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };
}
