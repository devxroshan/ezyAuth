import { api } from "../config/api.config";

export const CreateProjectAPI =async ({name}:{name:string}) => {
    const res = await api.post('/project', {
        name
    })
    return res.data
}

export const GetProjectAPI =async () => {
    const res = await api.get('/project')
    return res.data
}

export const GetProjectUserAPI =async (projectId:string) => {
    const res = await api.get(`/project/${projectId}/users`)
    return res.data
}

export const DeleteProjectAPI =async (projectId:string) => {
    const res = await api.delete(`/project/${projectId}`)
    return res.data
}