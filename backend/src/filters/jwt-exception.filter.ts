import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import express from "express";
import { TResponseError } from "../config/types.config";

export const jwtExceptionFilter = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let errObj: TResponseError = {
    statusCode: 401,
    msg: "Invalid authentication token",
    code: "JWT_INVALID",
  };

  if (err instanceof TokenExpiredError) {
    errObj = {
      statusCode: 401,
      msg: "Token has expired",
      code: "JWT_EXPIRED",
    };
  }

  if (err instanceof NotBeforeError) {
    errObj = {
      statusCode: 401,
      msg: "Token not active yet",
      code: "JWT_NOT_ACTIVE",
    };
  }

  res.status(errObj.statusCode).json({
    ok: false,
    msg: errObj.msg,
    code: errObj.code,
    details: errObj.details ?? {},
  });
};
