"use client";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useProjectStore } from "../stores/project.store";
import { GetProjectAPI } from "../api/project.api";

export const GetUserProjectWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const setProject = useProjectStore((state) => state.setProjects);

  const getUserProjectMutation = useMutation({
    mutationFn: GetProjectAPI,
    onSuccess: (data) => {
      if (data.ok) {
        // console.log("Fetched projects:", data);
        setProject(data.data);
      }
    },
    onError: (err) => {},
  });

  useEffect(() => {
    getUserProjectMutation.mutate();
  }, []);

  return <>{children}</>;
};
