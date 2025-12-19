import express from 'express'
import { Prisma } from '@prisma/client';

export type TResponseError = {
    statusCode: number;
    msg: string;
    code: string;
    details?: {}
}

export type TRequestController = (
    req: express.Request,
    res: express.Response,
    next?: express.NextFunction,
) => Promise<any>;

export const Environment = {
    isDev: process.env.NODE_ENV as string == 'development'?true:false
}

export type CreateProjectUserInput = {
  name?: string;
  username?: string;
  email: string;
  password: string;
  isVerified: boolean;
  metadata?: Prisma.InputJsonValue;
  projectId: string;
};