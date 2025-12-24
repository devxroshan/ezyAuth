import jwt from 'jsonwebtoken'

import { InternalServerError, NotFound, Unauthorized } from "../config/exceptions.config";
import { TRequestController } from "../config/types.config";
import { AsyncRequestHandler } from "../utils/async-request-handler.utils";
import prisma from '../config/prisma-db.config';

const isLoggedIn:TRequestController = async (req, res, next):Promise<void> => {
    if(!next){
        throw new InternalServerError("Something went wrong. Try again later.")
    }

    const sessionToken = req.cookies['session-token']

    if(!sessionToken || typeof sessionToken != 'string'){
        throw new Unauthorized("Token required.")
    }

    const decodedToken = await jwt.verify(sessionToken, process.env.JWT_SECRET as string) as {userId: string}

    const user = await prisma.user.findUnique({
        where: {
            id: decodedToken?.userId
        },select: {
            createdAt: true,
            updatedAt: true,
            name: true,
            email: true,
            id: true,
            isVerified: true

        }
    })

    if(!user) {
        throw new NotFound("User not found.")
    }

    req.user = user
    next()
}

export const IsLoggedIn = AsyncRequestHandler(isLoggedIn)
