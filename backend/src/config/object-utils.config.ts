import express from 'express' 

export const SuccessResponse = (status:number, msg:string, data?:any) => {
    return (res: express.Response) => {
        res.status(status).json({
            ok: true,
            msg,
            data: data ?? {}
        })
    }
}