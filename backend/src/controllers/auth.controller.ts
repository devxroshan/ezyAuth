import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'

import { AsyncRequestHandler } from "../utils/async-request-handler.utils";
import { TRequestController } from "../config/types.config";

import prisma from "../config/prisma-db.config";
import { schemaValidator } from "../utils/schema-validator.utils";
import { SignUpSchema } from "../schema/auth.schema";
import { BadRequest, NotFound, ValidationError } from "../config/exceptions.config";
import { mailTransporter } from '../config/mailer.config';

export const signup: TRequestController = async (req, res) => {
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
  
  const emailConfirmationToken = await jwt.sign({
    userId: user.id
  }, process.env.JWT_SECRET as string, {algorithm: 'HS512', expiresIn: '5m'})

  await mailTransporter.sendMail({
    to: user.email,
    subject: "Email Verification",
    template: "email-verification",
    context: {
      name: user.name,
      confirmationUrl: `${process.env.BACKEND as string}/api/auth/verify-email?token=${emailConfirmationToken}`,
      currentYear: new Date().getFullYear()
    }
  } as any)

  res.status(201).json({
    ok: true,
    msg: "User created. We have sent you a email verification link, check your inbox or spam folder.",
    data: user,
  });
};

const verifyEmail: TRequestController = async (req, res) => {
  const token = req.query?.token

  if(!token || typeof token !== 'string'){
    throw new BadRequest("Token required.")
  }

  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET as string) as {userId: string}

  await prisma.user.update({
    where: {
      id: decodedToken.userId
    }, 
    data: {
      isVerified: true
    }
  })

  res.status(200).json({
    ok: true,
    msg: 'Email verified successfully.',
  })
};

const login: TRequestController = async (req, res) => {};

export const SignUp = AsyncRequestHandler(signup);
export const VerifyEmail = AsyncRequestHandler(verifyEmail);
export const Login = AsyncRequestHandler(login);
