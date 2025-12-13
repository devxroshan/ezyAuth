// Utils
import { AsyncRequestHandler } from "../utils/async-request-handler.util";
import { SuccessResponse } from "../config/object-utils.config";
import { TController } from "../config/types.config";

const signUp = async ({req, res, next}:TController) => {
  SuccessResponse(201, "User created successfully.");
};

const verifyEmail = async ({req, res, next}:TController) => {
  SuccessResponse(200, "Email verified successfully.");
};

const login = async ({req, res, next}:TController) => {
    SuccessResponse(200, "Login successfully.");
};

const logout = async ({req, res, next}:TController) => {
    SuccessResponse(200, "Logoutt successfully.");
};

export const SignUp = AsyncRequestHandler(signUp);
export const VerifyEmail = AsyncRequestHandler(verifyEmail);
export const Login = AsyncRequestHandler(login);
export const Logout = AsyncRequestHandler(logout);
