import { Environment, TResponseError } from "../config/types.config";
import express from "express";

export const dbExceptionFilter = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const errObj: TResponseError = {
    statusCode: 500,
    msg: "Something went wrong. Try again later.",
    code: "DB_ERROR",
  };

  switch (err.code) {
    case "P2002": // Unique constraint violation (Postgres error)
      errObj.statusCode = 400;
      errObj.msg = "Unique constraint violation. May the email you entered already exists.";
      errObj.code = "DUPLICATE_KEY";
      break;
  }

  res.status(errObj.statusCode).json({
    ok: false,
    msg: errObj.msg || "Internal Server Error.",
    code: errObj.code || "INTERNAL_SERVER_ERROR",
    details: errObj.details || {},
  });
};
