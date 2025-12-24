import { api } from "../config/api.config";

export const GetProjectAPI =async () => {
    const res = await api.get('/project')
    return res.data
}

export const DeleteProjectAPI =async (projectId:string) => {
    const res = await api.delete(`/project/${projectId}`)
    return res.data
}