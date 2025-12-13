import express from 'express'

export type TController = {
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
}
