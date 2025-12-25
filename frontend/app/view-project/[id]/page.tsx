"use client";
import { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import { IProject, useProjectStore } from "@/app/stores/project.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DeleteProjectAPI, GetProjectUserAPI } from "@/app/api/project.api";
import { useRouter } from "next/navigation";

const ViewProject = () => {
  const params = useParams();
  const router = useRouter();

  const projects = useProjectStore();

  const [project, setProject] = useState<IProject | null>(null);
  const [projectUsers, setProjectUsers] = useState<any[]>([]);

  const deleteProjectMutation = useMutation({
    mutationFn: DeleteProjectAPI,
    onSuccess: (data) => {
      if (data.ok) {
        projects.removeProject(params.id as string);
        router.push("/");
      }
    },
  });

  // Queries
  const projectUsersQuery = useQuery({
    queryKey: ["project-users", params.id],
    queryFn: () => GetProjectUserAPI(params.id as string),
  });

  useEffect(() => {
    const foundProject = projects.projects.find(
      (proj) => proj.id === params.id
    );
    setProject(foundProject || null);

    if (projectUsersQuery.data?.ok && !projectUsersQuery.isPending) {
      setProjectUsers(projectUsersQuery.data?.data ?? []);
      console.log(projectUsersQuery.data?.data);
    }
  }, [projects.projects, projectUsersQuery.data]);

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
          Created:{" "}
          {createdDate
            ? `${months[parseInt(createdDate[1]) - 1]} ${createdDate[2]}, ${
                createdDate[0]
              }`
            : "N/A"}
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

      <div className="relative px-2 py-2 bg-foreground border border-border rounded-lg w-full h-[65vh] overflow-auto">
        {projectUsers.length != 0 && (
          <table className="min-w-max text-xs font-medium table-fixed border-collapse">
            {/* HEADER */}
            <thead className="sticky top-0 z-10 bg-foreground border-b border-border">
              <tr>
                {Object.keys(projectUsers[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 text-left font-semibold text-gray-400 whitespace-nowrap"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {projectUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-white/10 transition-colors"
                >
                  {Object.keys(projectUsers[0]).map((key) => (
                    <td
                      key={key}
                      className="px-4 py-2 whitespace-nowrap truncate"
                    >
                      {typeof user[key] === "object"
                        ? JSON.stringify(user[key])
                        : user[key].toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {projectUsers.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-lg text-gray-400">No Users yet.</span>
          </div>
        )}
      </div>

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
