import express from 'express'
import { TRequestController } from '../config/types.config'

export const AsyncRequestHandler = (fn:TRequestController) => {
    return (req:express.Request, res:express.Response, next:express.NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}