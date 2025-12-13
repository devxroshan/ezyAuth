import express from "express";
import { ZodObject } from "zod";

export const ValidateScheam = (schema: ZodObject<any>) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        msg: issue.message,
      }));

      res.status(400).json({
        ok: false,
        msg: "Invalid request body",
        errors,
      });
      return;
    }

    next()
  };
};
