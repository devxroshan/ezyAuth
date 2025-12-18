class AppError extends Error {
    public statusCode:number = 500;
    public msg:string = "Internal Server Error.";
    public code:string = "INTERNAL_SERVER_ERROR";
    public details:any = {}

    constructor(statusCode:number, msg:string, code:string, details?:any){
        super(msg);
        this.msg = msg;
        this.statusCode = statusCode;
        this.details = details ?? {}
        Error.captureStackTrace(this, this.constructor)
    }
}

export class BadRequest extends AppError {
    constructor(msg:string, details?:any){
        super(400, msg,"BAD_REQUEST", details)
    }
}

export class NotFound extends AppError {
    constructor(msg:string, details?:any){
        super(404, msg,"NOT_FOUND", details)
    }
}

export class ValidationError extends AppError {
    constructor(msg:string, details?:any){
        super(400, msg,"VALIDATION_ERROR", details)
    }
}

export class Unauthorized extends AppError {
    constructor(msg:string, details?:any){
        super(401, msg,"UNAUTHORIZED", details)
    }
}

export class InternalServerError extends AppError {
    constructor(msg:string, details?:any){
        super(500, msg,"INTERNAL_SERVER_ERROR", details)
    }
}