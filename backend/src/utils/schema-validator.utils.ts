import { ZodObject } from 'zod'

export const schemaValidator = (schema: ZodObject<any>, data:any):true | any[] => {
    const result = schema.safeParse(data)

    if(!result.success){
        const errors = result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            msg: issue.message
        }))
        return errors;
    }
    return true
}