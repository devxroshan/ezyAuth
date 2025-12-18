import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

import { AsyncRequestHandler } from "../utils/async-request-handler.utils";
import { Environment, TRequestController } from "../config/types.config";

import prisma from "../config/prisma-db.config";
import { schemaValidator } from "../utils/schema-validator.utils";
import { SignUpSchema } from "../schema/auth.schema";
import {
  BadRequest,
  NotFound,
  Unauthorized,
  ValidationError,
} from "../config/exceptions.config";
import { mailTransporter } from "../config/mailer.config";

export const signup: TRequestController = async (req, res) => {
  const isValidUserDetails = schemaValidator(SignUpSchema, req.body);
  if (isValidUserDetails != true) {
    throw new ValidationError("Invalid SignUp details.", isValidUserDetails);
  }

  const hashedPassword = await argon2.hash(req.body.password);

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    },
  });

  const emailConfirmationToken = await jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET as string,
    { algorithm: "HS512", expiresIn: "5m" }
  );

  await mailTransporter.sendMail({
    to: user.email,
    subject: "Email Verification",
    template: "email-verification",
    context: {
      name: user.name,
      confirmationUrl: `${
        process.env.BACKEND as string
      }/api/auth/verify-email?token=${emailConfirmationToken}`,
      currentYear: new Date().getFullYear(),
    },
  } as any);

  res.status(201).json({
    ok: true,
    msg: "User created. We have sent you a email verification link, check your inbox or spam folder.",
    data: user,
  });
};

const verifyEmail: TRequestController = async (req, res) => {
  const token = req.query?.token;

  if (!token || typeof token !== "string") {
    throw new BadRequest("Token required.");
  }

  const decodedToken = (await jwt.verify(
    token,
    process.env.JWT_SECRET as string
  )) as { userId: string };

  await prisma.user.update({
    where: {
      id: decodedToken.userId,
    },
    data: {
      isVerified: true,
    },
  });

  res.status(200).json({
    ok: true,
    msg: "Email verified successfully.",
  });
};

const login: TRequestController = async (req, res) => {
  const { email, password } = req.query;

  if (
    !email ||
    typeof email != "string" ||
    !password ||
    typeof password != "string"
  ) {
    throw new BadRequest("Email and Password required.");
  }

  const doesUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!doesUserExists) {
    throw new NotFound("User not found.");
  }

  if (!doesUserExists.isVerified) {
    const emailConfirmationToken = await jwt.sign(
      {
        userId: doesUserExists.id,
      },
      process.env.JWT_SECRET as string,
      { algorithm: "HS512", expiresIn: "5m" }
    );

    await mailTransporter.sendMail({
      to: doesUserExists.email,
      subject: "Email Verification",
      template: "email-verification",
      context: {
        name: doesUserExists.name,
        confirmationUrl: `${
          process.env.BACKEND as string
        }/api/auth/verify-email?token=${emailConfirmationToken}`,
        currentYear: new Date().getFullYear(),
      },
    } as any);
    throw new Unauthorized("Your email is not verified yet. We have sent a link to verify, Check your inbox or spam folder.")
  }

  const isPasswordCorrect = await argon2.verify(
    doesUserExists.password,
    password
  );
  if (!isPasswordCorrect) {
    throw new BadRequest("Incorrect Password.");
  }

  const sessionToken = await jwt.sign(
    { userId: doesUserExists.id },
    process.env.JWT_SECRET as string,
    {
      algorithm: "HS512",
      expiresIn: "30d",
    }
  );

  res
    .status(200)
    .cookie("session-token", sessionToken, {
      secure: Environment.isDev ? false : true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json({
      ok: true,
      msg: "Logged in successfully.",
      data: Environment.isDev ? sessionToken : "",
    });
};

export const SignUp = AsyncRequestHandler(signup);
export const VerifyEmail = AsyncRequestHandler(verifyEmail);
export const Login = AsyncRequestHandler(login);
