import { TRequestController } from '../config/types.config'

export const responseMiddleware:TRequestController = async (req, res, next):Promise<void> => {
    res.success = (msg:string, statusCode:number, data?:any) => {
        res.status(statusCode).json({
            ok: true,
            msg,
            data
        })
    }
}