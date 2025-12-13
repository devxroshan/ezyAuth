export class AppError extends Error {
    public statusCode:number;
    public msg:string;
    public code:string;
    public details:any;

    constructor(statusCode: number, msg:string, code:string, details?:any){
        super(msg)
        this.statusCode = statusCode
        this.msg = msg;
        this.details = details ?? {}
        this.code = code
        Error.captureStackTrace(this, this.constructor)
    }
}

export class BadRequest extends AppError {
    constructor(msg: string, details?:any){
        super(400, msg, 'BAD_REQUEST', details)
    }
}

export class NotFound extends AppError {
    constructor(msg: string, details?:any){
        super(404, msg, 'NOT_FOUND', details)
    }
}

export class ValidationError extends AppError {
    constructor(msg: string, details?:any){
        super(400, msg, 'VALIDATION_ERROR', details)
    }
}

export class InternalServerError extends AppError {
    constructor(msg: string, details?:any){
        super(500, msg, 'INTERNAL_SERVER_ERROR', details)
    }
}