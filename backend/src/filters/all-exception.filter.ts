import { Environment } from "../config/types.config";
import express from "express";
import { Prisma } from "@prisma/client";
import { dbExceptionFilter } from "./db-exception.filter";

export const allExceptionFilter = (err:any, req:express.Request, res:express.Response, next:express.NextFunction) => {
    const statusCode = err?.statusCode || 500

    if(Environment.isDev){
        console.log("Error:->", err)
    }

    if(err instanceof Prisma.PrismaClientKnownRequestError){
        dbExceptionFilter(err, req, res,next);
        return;
    }
    
    res.status(statusCode).json({
        ok: false,
        msg: err?.msg || "Internal Server Error.",
        code: err?.code || "INTERNAL_SERVER_ERROR",
        details: err?.details || {}
    })
}