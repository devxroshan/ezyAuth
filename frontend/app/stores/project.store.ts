import { create } from 'zustand';

export interface IProject {
    id: string;
    authorId: string;
    usersCount: string;
    name: string;
    createdAt: string;    
    updatedAt: string;
    apiKey: string;
    _count: any;
}

interface IProjectStore {
    projects: IProject[]
    setProjects: (project: IProject[]) => void;
    addProject: (project: IProject) => void;
    removeProject: (id: string) => void;
    clearProjects: () => void;
}

export const useProjectStore = create<IProjectStore>((set) => ({
    projects: [],
    setProjects: (projects) => set({ projects }),
    addProject: (project) => 
        set((state) => ({ 
            projects: [...state.projects, project] 
        })),
    removeProject: (id) => set(
        (state) => ({
            projects: state.projects.filter(project => project.id !== id)
        })
    ),
    clearProjects: () => set({ projects: [] }),
}));
