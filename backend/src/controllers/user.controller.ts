import { TRequestController } from "../config/types.config";
import { AsyncRequestHandler } from "../utils/async-request-handler.utils";
import { schemaValidator } from "../utils/schema-validator.utils";
import { NotFound, ValidationError } from "../config/exceptions.config";
import { PasswordChangeSchema } from "../schema/user.schema";
import * as argon2 from "argon2";
import prisma from "../config/prisma-db.config";


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

export const GetUser = AsyncRequestHandler(getUser)
export const ChangePassword = AsyncRequestHandler(changePassword)