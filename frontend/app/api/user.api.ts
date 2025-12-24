import { api } from "../config/api.config";


export const GetUserAPI = async () => {
    const res = await api.get('/user')
    return res.data;
}