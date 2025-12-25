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
  const [projectName, setProjectName] = useState<string>("");

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
        </section>
      )}
    </>
  );
}
