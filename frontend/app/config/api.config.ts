import axios, { Axios, AxiosError } from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND ?? "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})


api.interceptors.response.use((response) => response, (error) => {
    const errObj:{
        msg: string,
        ok: false,
        details: any
    } = {msg: 'Something went wrong.', ok: false, details: {}}

    if(error instanceof AxiosError){
        if(error.response){
            errObj.msg = error.response?.data?.msg
            errObj.details = error.response?.data?.details ?? {}
        }
    }

    return Promise.reject({
        ...errObj,
        statusCode: error.response?.status,
        rawErr: error
    })
})