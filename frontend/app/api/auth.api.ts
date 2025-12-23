import { api } from "../config/api.config";

export const LoginAPI = async ({email, password}:{email: string, password: string}) => {
    const res = await api.get(`/auth/login?email=${email}&password=${password}`)
    return res.data;
}

export const SignUpAPI = async ({name, email, password}:{name:string,email: string, password: string}) => {
    const res = await api.post(`/auth/signup`, {
        name,
        email,
        password
    })
    return res.data;
}