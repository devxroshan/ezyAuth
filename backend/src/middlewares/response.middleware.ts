import { TRequestController } from '../config/types.config'

export const responseMiddleware:TRequestController = async (req, res, next):Promise<void> => {
    if(!next) return;

    res.success = (msg:string, statusCode:number, data?:any):void => {
        res.status(statusCode).json({
            ok: true,
            msg,
            data
        })
    }
    next()
}