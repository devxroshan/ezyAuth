import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

import { ProjectUser } from "@prisma/client";
import {
  CreateProjectUserInput,
  TRequestController,
} from "../config/types.config";
import { BadRequest } from "../config/exceptions.config";
import prisma from "../config/prisma-db.config";
import { mailTransporter } from "../config/mailer.config";
import { AsyncRequestHandler } from "../utils/async-request-handler.utils";

const projectUserSignUp: TRequestController = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    throw new BadRequest("Email and Password are required to create a user.");
  }

  const hashedPassword = await argon2.hash(req.body.password);

  const projectUserInfo: CreateProjectUserInput = {
    name: req.body.name ?? "",
    username: req.body.username ?? "",
    email: req.body.email,
    password: hashedPassword,
    isVerified: false,
    metadata: req.body.metadata ?? {},
    projectId: req.project.id,
  };

  const newProjectUser = await prisma.projectUser.create({
    data: projectUserInfo,
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
      }/api/auth/verify-email?token=${emailConfirmationToken}`,
      currentYear: new Date().getFullYear(),
    },
  } as any);

  res.status(201).json({
    ok: true,
    msg: "User created. We have sent you a email verification link, check your inbox or spam folder.",
    data: newProjectUser,
  });
};


export const ProjectUserSignUp = AsyncRequestHandler(projectUserSignUp)
