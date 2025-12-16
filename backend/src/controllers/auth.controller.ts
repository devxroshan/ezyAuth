import { AsyncRequestHandler } from "../utils/async-request-handler.utils";
import { TRequestController } from "../config/types.config";


export const signup:TRequestController = async (req, res, next) => {
    
}

const verifyEmail:TRequestController = async (req, res, next) => {

}

const login:TRequestController = async (req, res, next) => {

}

export const SignUp = AsyncRequestHandler(signup)
export const VerifyEmail = AsyncRequestHandler(verifyEmail)
export const Login = AsyncRequestHandler(login)