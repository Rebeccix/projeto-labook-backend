import { UserDatabase } from "../database/UserDatabase";
import { LoginInputDTO, LoginOutputDTO } from "../dto/user/loginUserDTO";
import { SignupInputDTO, SignupOutputDTO } from "../dto/user/signupUserDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { TokenPayload, USER_ROLES, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
    constructor(
        private hashManager: HashManager,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private userDatabase: UserDatabase,
    ){}

    public signup = async (
        input: SignupInputDTO
        ): Promise<SignupOutputDTO> => {
        const { name, email, password } = input

        const id = this.idGenerator.generate()

        const hashedPassword = await this.hashManager.hash(password)

        const user = new User(
            id,
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        )
        
        const userDB = user.toUserDBModel()
        await this.userDatabase.insertUser(userDB)    

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output: SignupOutputDTO = {
          token,
        }

        return output
    }

    public login = async (
        input: LoginInputDTO
        ): Promise<LoginOutputDTO> => {
            const { email, password } = input
        
            const userDB = await this.userDatabase.findUserByEmail(email)

            if(!userDB) { 
                throw new BadRequestError("'Email' não encontrado")
            }

            const hashedPassword = userDB.password

            const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword)

            if(!isPasswordCorrect) {
                throw new BadRequestError("'email' ou 'Password' incorreto")
            }

            const user = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_At
            )

            const payload: TokenPayload = {
                id: user.getId(),
                name: user.getName(),
                role: user.getRole()
            }

            const token = this.tokenManager.createToken(payload)

            const output: LoginOutputDTO = {
                token
            }

            return output
    } 
}