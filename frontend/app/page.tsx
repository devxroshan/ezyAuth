'use client';
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "./components/ProjectCard";
import { GetProjectAPI } from "./api/project.api";

import { useProjectStore } from "./stores/project.store";
import { useEffect } from "react";

export default function Home() {
  const projectStore = useProjectStore()

  const projectQuery = useQuery({
    queryKey: ['projects'],
    queryFn: GetProjectAPI
  })

  useEffect(()=>{
    if(projectQuery.data?.ok){
      projectStore.setProjects(projectQuery?.data?.data)
    }
  }, [projectQuery.isPending])

  return (
    <section className="w-screen md:w-fit h-fit md:h-screen md:items-start flex items-center overflow-x-hidden justify-start px-2 py-4 gap-5 flex-wrap">
      {projectStore.projects.map(project => (
        <ProjectCard key={project.id} name={project.name} users={project.usersCount} id={project.id} createdOn={project.createdAt}/>
      ))}

      <div className="border border-border rounded-xl text-white bg-foreground select-none w-56 flex items-center justify-center h-56 cursor-pointer">
        <span className="font-medium">Create</span>
      </div>
    </section>
  );
}
