import jwt from 'jsonwebtoken';

import { BadRequest, InternalServerError, NotFound } from "../config/exceptions.config";
import { TRequestController } from "../config/types.config";
import prisma from '../config/prisma-db.config';
import { Project, User } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user: User,
            project: Project
        }
    }
}

export const ValidateAPIKey:TRequestController = async (req, res, next) => {
    if(!next) throw new InternalServerError("Something went wrong. Try again later.")


    const apiKey = req.params.apiKey

    if(!apiKey) throw new BadRequest("API key required.")

    const decodedAPIKey = await jwt.verify(apiKey, process.env.JWT_SECRET as string) as {
        userId: string,
        projectId: string
    }

    const isUser = await prisma.user.findUnique({ 
        where: {
            id: decodedAPIKey.userId
        }
    })

    if(!isUser) throw new NotFound("User not found.")

    const isProject = await prisma.project.findUnique({
        where: {
            id: decodedAPIKey.projectId
        }
    })

    if(!isProject) throw new NotFound("Project not found.")
        
    req.user = isUser
    req.project = isProject

    next()
}