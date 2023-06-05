import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static USER_TABLES = "users"

    public async insertUser(user: UserDB): Promise<void> {
        await BaseDatabase
        .connection(UserDatabase.USER_TABLES)
        .insert(user)
    }

    public async findUserByEmail(email: string): Promise<UserDB | undefined> {
        const [result]: UserDB[] | undefined = await BaseDatabase
        .connection(UserDatabase.USER_TABLES)
        .where({email})

        return result
    }
}