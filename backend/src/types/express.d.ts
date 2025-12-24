import express from 'express'

import { Project, User } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user: Omit<User, 'password'>,
            project: Project
        }
    }
}

export {}