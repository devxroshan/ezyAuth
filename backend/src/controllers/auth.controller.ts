import * as argon2 from 'argon2'

import { AsyncRequestHandler } from "../utils/async-request-handler.utils";
import { TRequestController } from "../config/types.config";

import prisma from "../config/prisma-db.config";
import { schemaValidator } from "../utils/schema-validator.utils";
import { SignUpSchema } from "../schema/auth.schema";
import { ValidationError } from "../config/exceptions.config";

export const signup: TRequestController = async (req, res, next) => {
  const isValidUserDetails = schemaValidator(SignUpSchema, req.body);
  if (isValidUserDetails != true) {
    throw new ValidationError("Invalid SignUp details.", isValidUserDetails);
  }

  const hashedPassword = await argon2.hash(req.body.password)

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    ok: true,
    msg: "User created.",
    data: user,
  });
};

const verifyEmail: TRequestController = async (req, res, next) => {};

const login: TRequestController = async (req, res, next) => {};

export const SignUp = AsyncRequestHandler(signup);
export const VerifyEmail = AsyncRequestHandler(verifyEmail);
export const Login = AsyncRequestHandler(login);
