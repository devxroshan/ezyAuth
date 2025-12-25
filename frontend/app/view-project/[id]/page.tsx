"use client";
import { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import { IProject, useProjectStore } from "@/app/stores/project.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DeleteProjectAPI } from "@/app/api/project.api";
import { useRouter } from "next/navigation";

const ViewProject = () => {
  const params = useParams();
  const router = useRouter();

  const projects = useProjectStore();

  const [project, setProject] = useState<IProject | null>(null);

  const deleteProjectMutation = useMutation({
    mutationFn: DeleteProjectAPI,
    onSuccess: (data) => {
      if (data.ok) {
        projects.removeProject(params.id as string);
        router.push("/");
      }
    },
  });

  useEffect(() => {
    const foundProject = projects.projects.find(
      (proj) => proj.id === params.id
    );
    if (foundProject) {
      setProject(foundProject);
    } else {
      setProject(null);
    }
  }, [projects.projects]);

  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const createdDate = project?.createdAt?.split("T")[0].split("-");

  return (
    <section className="text-white justify-start items-start flex flex-col gap-2 py-4 px-4 w-[80vw] h-screen select-none overflow-y-auto overflw-x-hidden">
      <div className="flex flex-col w-full h-fit gap-2 items-start justify-center text-white">
        <span className="text-2xl font-medium">{project?.name}</span>
        <span className="text-2xl font-medium">
          User: {project?._count?.projectUser ?? 0}
        </span>
        <span className="text-2xl font-medium">
          Created: {createdDate ? `${months[parseInt(createdDate[1]) - 1]} ${createdDate[2]}, ${createdDate[0]}` : "N/A"}
        </span>
      </div>
      <div className="flex flex-col items-start justify-start w-full outline-none border border-border rounded-lg p-2 gap-1">
        <div className="flex gap-3">
          <span>API Key</span>
          <span
            className="text-sm font-medium cursor-pointer"
            onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
              const target = e.target as HTMLSpanElement;
              navigator.clipboard.writeText(project?.apiKey || "");
              target.innerText = "Copied!";
            }}
          >
            Copy
          </span>
        </div>
        <textarea
          className="resize-none w-full outline-none text-xs text-gray-400"
          defaultValue={project?.apiKey}
          readOnly
        ></textarea>
      </div>

      <div className="bg-foreground border border-border rounded-lg w-full h-[65vh]"></div>

      <button
        className={`${
          deleteProjectMutation.isPending
            ? "bg-red-900 cursor-default"
            : "bg-red-800 cursor-pointer"
        } px-6 rounded-lg py-2 hover:font-medium transition-all duration-300 outline-none hover:bg-red-900 active:scale-95 text-black cursor-pointer`}
        disabled={deleteProjectMutation.isPending}
        onClick={() => {
          deleteProjectMutation.mutate(params.id as string);
        }}
      >
        {deleteProjectMutation.isPending ? "Deleting..." : "Delete Project"}
      </button>
    </section>
  );
};

export default ViewProject;
