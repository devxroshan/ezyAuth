import { TRequestController } from "../config/types.config";
import { AsyncRequestHandler } from "../utils/async-request-handler.utils";
import { schemaValidator } from "../utils/schema-validator.utils";
import { NotFound, ValidationError } from "../config/exceptions.config";
import { PasswordChangeSchema } from "../schema/user.schema";
import * as argon2 from "argon2";
import prisma from "../config/prisma-db.config";
import { mailTransporter } from "../config/mailer.config";
import * as jwt from "jsonwebtoken";

const getUser:TRequestController = async (req, res):Promise<void> => {
    res.status(200).json({
        ok: true,
        msg: "Data fetched successfully.",
        data: req.user
    })
}

const changePassword:TRequestController = async (req, res):Promise<void> => {
  const isValidPasswordChangeDetails = schemaValidator(PasswordChangeSchema, req.body);
  if (isValidPasswordChangeDetails != true) {
    throw new ValidationError("Invalid Password Change details.", isValidPasswordChangeDetails);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user?.id }
  })

  if (!user) {
    throw new NotFound("User not found.");   
  }

  const isPasswordMatch = await argon2.verify(user?.password, req.body.currentPassword);

    if (!isPasswordMatch) {
        throw new ValidationError("Current password is incorrect.");
    }
    const hashedNewPassword = await argon2.hash(req.body.newPassword);
    
    await prisma.user.update({
        where: { id: req.user?.id },
        data: { password: hashedNewPassword }
    });


    res.success("Password changed successfully.", 200);
}


const updateUser:TRequestController = async (req, res):Promise<void> => {
  const updateInfo = req.body as {
    name?: string;
    email?: string;
  };

  if(updateInfo.email && updateInfo.email !== req.user?.email){
    const existingUser =  await prisma.user.findUnique({
      where: { email: updateInfo.email }
    });
    if(existingUser){
      throw new ValidationError("Email is already taken.");
    }

    if(!updateInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
      throw new ValidationError("Invalid email format.");
    }

    const emailConfirmationToken = await jwt.sign(
      {
        userId: req.user?.id,
      },
      process.env.JWT_SECRET as string,
      { algorithm: "HS512", expiresIn: "5m" }
    );
    await mailTransporter.sendMail({
      to: updateInfo.email,
      subject: "Email Verification",
      template: "email-verification",
      context: {
        name: updateInfo.name || updateInfo.email,
        confirmationUrl: `${
          process.env.BACKEND as string
        }/api/auth/verify-email?token=${emailConfirmationToken}`,
        currentYear: new Date().getFullYear(),
      },
    } as any);
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user?.id },
    data: {
      ...updateInfo,
      isVerified: false
    },
  });

  res.status(200).json({
    ok: true,
    msg: `User updated successfully.${updateInfo.email ? " Please verify your new email address." : ""}`,
    data: updatedUser,
  });
}

export const GetUser = AsyncRequestHandler(getUser)
export const ChangePassword = AsyncRequestHandler(changePassword)
export const UpdateUser = AsyncRequestHandler(updateUser)