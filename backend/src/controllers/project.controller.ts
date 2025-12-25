import jwt from 'jsonwebtoken'

import { AsyncRequestHandler } from "../utils/async-request-handler.utils";
import { TRequestController } from "../config/types.config";
import { BadRequest, NotFound } from "../config/exceptions.config";
import prisma from "../config/prisma-db.config";;

const createProject:TRequestController = async (req, res) => {
    const projectName = req.body.name

    if(!projectName || typeof projectName != 'string'){
        throw new BadRequest("Project name required.")
    }

    if(!req.user.id){
        throw new BadRequest("User id required.")
    }

    const project = await prisma.project.create({
        data: {
            name: projectName,
            authorId: req.user.id,
            apiKey: "To be updated."
        }
    })

    const apiKey = await jwt.sign({userId: req.user?.id, projectId: project.id}, process.env.JWT_SECRET as string, {algorithm: 'HS512', expiresIn: '28d'})

    const updatedProject = await prisma.project.update({
        where: {
            id: project.id
        },
        data: {
            apiKey
        }
    })

    res.status(201).json({
        ok: true,
        msg: "Project created successfully.",
        data: updatedProject
    })
}

const getProject:TRequestController = async (req, res) => {
    const projects = await prisma.project.findMany({
        where:{
            authorId: req.user?.id
        },
        include: {
            _count: {
                select: { projectUser: true }
            }
        }
    })


    if(projects.length <= 0){
        throw new NotFound("No projects yet.")
    }

    res.status(200).json({
        ok: true,
        msg: "Project fetched successfully.",
        data: projects
    })
}

const getProjectUsers:TRequestController = async (req, res) => {
    const projectId = req.params.project_id

    if(!projectId || typeof projectId != 'string') throw new BadRequest('Project ID required.')
    
    const projectUsers = await prisma.projectUser.findMany({
        where: {
            projectId
        }
    })

    if(projectUsers.length <= 0){
        throw new NotFound("No ProjectUser yet.")
    }

    res.status(200).json({
        ok: true,
        msg: 'ProjectUser fetched successfully.',
        data: projectUsers
    })
}

const deleteProject:TRequestController = async (req, res) => {
    const projectId = req.params.project_id

    if(!projectId || typeof projectId != 'string'){
        throw new BadRequest("Project ID required.")
    }

    await prisma.projectUser.deleteMany({
        where: {
            projectId
        }
    })

    await prisma.project.delete({
        where: {
            authorId: req.user?.id,
            id: projectId
        }
    })

    res.status(200).json({
        ok: true,
        msg: "Project and It's user are deleted.",
    })
}

export const CreateProject = AsyncRequestHandler(createProject)
export const GetProject = AsyncRequestHandler(getProject)
export const GetProjectUsers = AsyncRequestHandler(getProjectUsers)
export const DeleteProject = AsyncRequestHandler(deleteProject)