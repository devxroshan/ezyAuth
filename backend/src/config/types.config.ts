import express from 'express'

export type TResponseError = {
    statusCode: number;
    msg: string;
    code: string;
    details?: {}
}

export type TRequestController = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => Promise<any>;

export const Environment = {
    isDev: process.env.NODE_ENV as string === 'development'?true:false
}