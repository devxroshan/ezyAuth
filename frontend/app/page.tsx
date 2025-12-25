"use client";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./components/ProjectCard";
import {
  CreateProjectAPI,
  DeleteProjectAPI,
  GetProjectAPI,
} from "./api/project.api";
import { useMutation } from "@tanstack/react-query";
import { IProject, useProjectStore } from "./stores/project.store";
import { useEffect, useState } from "react";
import { APIResponse } from "./config/api.config";

export default function Home() {
  const projectStore = useProjectStore();

  // useStates
  const [isPopUpBlackScreen, setPopUpBlackScreen] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isViewProject, setIsViewProject] = useState<boolean>(false);
  const [viewProject, setViewProject] = useState<IProject | null>(null);
  const [projectName, setProjectName] = useState<string>("");

  const projectQuery = useQuery({
    queryKey: ["projects"],
    queryFn: GetProjectAPI,
  });

  const createProjectMutation = useMutation({
    mutationFn: CreateProjectAPI,
    onSuccess: (data) => {
      if (data.ok) {
        projectStore.addProject(data.data);
        setIsCreate(false);
        setPopUpBlackScreen(false);
        setProjectName("");
      }
    },
    onError: (err) => {},
  });

  const deleteProjectMutation = useMutation({
    mutationFn: DeleteProjectAPI,
    onSuccess: (data) => {
      if (data.ok) {
        projectStore.removeProject(viewProject!.id);
        setIsViewProject(false);
        setViewProject(null);
        setPopUpBlackScreen(false);
      }
    },
    onError: (err) => {},
  });

  useEffect(() => {
    if (projectQuery.data?.ok) {
      projectStore.setProjects(projectQuery?.data?.data);
    }
  }, [projectQuery.isPending]);

  return (
    <>
      <section className="w-screen md:w-fit h-fit md:h-screen md:items-start flex items-center overflow-x-hidden justify-start px-2 py-4 gap-5 flex-wrap">
        {projectStore.projects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            users={project._count?.projectUser ?? 0}
            id={project.id}
            createdOn={project.createdAt}
            onClick={() => {
              setIsViewProject(true);
              setPopUpBlackScreen(true);
              setViewProject(project);
            }}
          />
        ))}

        <div
          className="border border-border rounded-xl text-white bg-foreground select-none w-56 flex items-center justify-center h-56 cursor-pointer"
          onClick={() => {
            setIsCreate(true);
            setPopUpBlackScreen(true);
          }}
        >
          <span className="font-medium">Create</span>
        </div>
      </section>

      {isPopUpBlackScreen && (
        <section className="absolute w-screen h-screen bg-black/20 flex items-center justify-center">
          {isCreate && (
            <div className="flex py-2 px-3 rounded-xl border border-border bg-foreground w-96 h-fit flex-col items-start justify-start gap-3">
              <span className="text-white font-medium text-lg">
                Create Project
              </span>

              <input
                type="text"
                className="w-full rounded-lg border border-border outline-none py-1 text-white px-2"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />

              <button
                className={`${
                  createProjectMutation.isPending
                    ? "bg-green-500 cursor-default"
                    : "bg-green-400 cursor-pointer"
                } hover:bg-green-500 transition-all duration-300 active:scale-95 font-medium text-black rounded-lg py-1 px-3 w-full`}
                disabled={createProjectMutation.isPending}
                onClick={() => {
                  if (projectName == "") return;
                  createProjectMutation.mutate({ name: projectName });
                }}
              >
                {createProjectMutation.isPending ? "Creating..." : "Create"}
              </button>
              <button
                className="bg-black/15 hover:bg-black/20 border border-border text-white cursor-pointer transition-all duration-300 active:scale-95 font-medium rounded-lg py-1 px-3 w-full"
                onClick={() => {
                  setIsCreate(false);
                  setPopUpBlackScreen(false);
                  setProjectName("");
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {isViewProject && viewProject && (
            <div className="flex flex-col items-start justify-start select-none gap-3 w-[45vw] h-fit rounded-2xl border border-border px-3 py-2 bg-foreground">
              <input
                className="font-medium text-white text-2xl border border-border w-full px-2 py-1 rounded-xl outline-none bg-background"
                readOnly
                defaultValue={viewProject.name}
              />
              <span className="text-gray-400 text-lg">
                Users: {viewProject._count?.projectUser ?? 0}
              </span>
              <span className="text-gray-400 text-lg">
                Created On: {viewProject.createdAt.toString()}
              </span>
              <div className="flex gap-2 items-center justify-start">  
                <span className="text-gray-400 font-medium">API Key</span>
                <span className="text-white"> - </span>
                <span className="text-white text-sm cursor-pointer" onClick={(e:React.MouseEvent<HTMLSpanElement>)=>{
                  const target = e.target as HTMLSpanElement;
                  navigator.clipboard.writeText(viewProject.apiKey);
                  const originalText = target.innerText;
                  target.innerText = "Copied!";
                  setTimeout(() => {
                    target.innerText = originalText;
                  }, 5000);
                }}>Copy</span>
              </div>

              <textarea
                className="text-gray-400 w-full resize-none h-44 outline-none border-none"
                defaultValue={viewProject.apiKey}
                ></textarea>

              <div className="flex w-full items-center justify-end gap-2">
                <button
                  className="bg-background/40 text-white border border-border px-5 rounded-lg py-1 cursor-pointer hover:bg-background/50 transition-all duration-300 active:scale-95 outline-none"
                  onClick={() => {
                    setIsViewProject(false);
                    setPopUpBlackScreen(false);
                    setViewProject(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`${deleteProjectMutation.isPending ? "bg-red-900 cursor-default" : "bg-red-800 cursor-pointer"} text-black px-5 rounded-lg py-1 hover:bg-red-900 transition-all duration-300 active:scale-95 outline-none`}
                  disabled={deleteProjectMutation.isPending}
                  onClick={() => {
                    deleteProjectMutation.mutate(viewProject?.id);
                  }}
                >
                  {deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
