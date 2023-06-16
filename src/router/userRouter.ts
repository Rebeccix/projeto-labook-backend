import express from "express"
import { UserController } from "../controller/UserController"
import { UserBusiness } from "../business/UserBusiness"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { UserDatabase } from "../database/UserDatabase"

export const userRouter = express.Router()

const userController = new UserController(
    new UserBusiness(
        new HashManager(),
        new IdGenerator(),
        new TokenManager(),
        new UserDatabase()
    )
)

userRouter.post("/signup", userController.signup)
userRouter.post("/login", userController.login)