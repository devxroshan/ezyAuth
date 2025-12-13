import express from 'express';

interface IError {
    statusCode: number;
    msg: string,
    code: string,
    details?: any
}

export const GlobalErrorHandler = (err:IError, req:express.Request, res:express.Response, next:express.NextFunction) => {
    res.status(err.statusCode).json({
        msg: err.msg,
        code: err.code,
        details: err.details
    })
}