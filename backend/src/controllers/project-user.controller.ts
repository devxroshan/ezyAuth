import * as argon2 from "argon2";
import jwt from "jsonwebtoken";


import {
  CreateProjectUserInput,
  TRequestController,
} from "../config/types.config";
import { BadRequest, ValidationError, NotFound, Unauthorized } from "../config/exceptions.config";
import { Environment } from "../config/types.config";
import prisma from "../config/prisma-db.config";
import { mailTransporter } from "../config/mailer.config";
import { AsyncRequestHandler } from "../utils/async-request-handler.utils";
import { schemaValidator } from "../utils/schema-validator.utils";
import { ProjectUserSchema } from "../schema/project-user.schema";

const projectUserSignUp: TRequestController = async (req, res) => {
  const isValidDetails = schemaValidator(ProjectUserSchema, {email: req.body.email, password: req.body.password})
  if(isValidDetails != true){
    throw new ValidationError("Fields required.", isValidDetails)
  }

  const hashedPassword = await argon2.hash(req.body.password);

  const projectUserInfo: CreateProjectUserInput = {
    name: req.body.name ?? "",
    username: req.body.username ?? "",
    email: req.body.email,
    password: hashedPassword,
    isVerified: false,
    metadata: req.body.metadata ?? {},
    projectId: req.project?.id,
  };

  if(projectUserInfo.username){
    const isUsernameAvailable = await prisma.projectUser.findFirst({
      where: {
        username: projectUserInfo.username
      }
    })

    if(isUsernameAvailable){
      throw new BadRequest("Username not available.")
    }
  }

  const newProjectUser = await prisma.projectUser.create({
    data: projectUserInfo,
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      username: true,
      email: true,
      isVerified: true,
      metadata: true,
      projectId: true
    }
  });

  const emailConfirmationToken = await jwt.sign(
    {
      userId: newProjectUser.id,
    },
    process.env.JWT_SECRET as string,
    { algorithm: "HS512", expiresIn: "5m" }
  );

  await mailTransporter.sendMail({
    to: newProjectUser.email,
    subject: "Email Verification",
    template: "email-verification",
    context: {
      name: newProjectUser.name || newProjectUser.email,
      confirmationUrl: `${
        process.env.BACKEND as string
      }/api/project-user/${req.project?.apiKey}/verify-email?token=${emailConfirmationToken}`,
      currentYear: new Date().getFullYear(),
    },
  } as any);

  res.status(201).json({
    ok: true,
    msg: "User created. We have sent you a email verification link, check your inbox or spam folder.",
    data: newProjectUser,
  });
};


const projectUserVerifyEmail: TRequestController = async (req, res) => {
  const token = req.query.token

  if(!token || typeof token != 'string'){
    throw new BadRequest("Verificatin token required.")
  }

  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET as string) as {
    userId: string
  }

  await prisma.projectUser.update({
    where: {
      id: decodedToken.userId
    },
    data: {
      isVerified: true
    }
  })

  res.status(200).json({
    ok: true,
    msg: "Email verified successfully.",
  });
};

const projectUserLogin: TRequestController = async (req, res) => {
  const { email, password } = req.query;

  if (
    !email ||
    typeof email != 'string' ||
    !password ||
    typeof password != 'string'
  ) {
    throw new BadRequest("Email and Password required.");
  }

  const doesUserExists = await prisma.projectUser.findUnique({
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
        }/api/${req.project?.apiKey}/verify-email?token=${emailConfirmationToken}`,
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
      data: sessionToken,
    });
};


export const ProjectUserSignUp = AsyncRequestHandler(projectUserSignUp)
export const ProjectUserVerifyEmail = AsyncRequestHandler(projectUserVerifyEmail)
export const ProjectUserLogin = AsyncRequestHandler(projectUserLogin)
