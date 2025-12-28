import { api } from "../config/api.config";


export const GetUserAPI = async () => {
    const res = await api.get('/user')
    return res.data;
}

export const ChangePasswordAPI = async ({ currentPassword, newPassword }:{currentPassword: string, newPassword: string}) => {
    const res = await api.patch('/user/change-password', { currentPassword, newPassword })
    return res.data;
}

export const UpdateUserAPI = async ({ name, email }:{name?: string, email?: string}) => {
    const res = await api.patch('/user/update', { name, email })
    return res.data;
}