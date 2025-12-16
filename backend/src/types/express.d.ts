import "express";

declare module "express-serve-static-core" {
  interface Response {
    success: (msg:string, statusCode:number,data?:any) => void;
  }
}
