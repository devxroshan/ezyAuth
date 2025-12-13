import express from 'express';

export const AsyncRequestHandler = (fn: Function) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}