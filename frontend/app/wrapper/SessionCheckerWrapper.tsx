"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export const SessionCheckerWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const sessionToken = document?.cookie
      ?.split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("session-token="))
      ?.split("=")[1];

      if(sessionToken == undefined || sessionToken == ""){
        if(pathname != '/login' && pathname != '/signup'){
          router.push('/login')
        }
      }else {
        if(pathname == '/login' || pathname == '/signup'){
          router.push('/')
        }
      }
  }, [pathname]);

  return <>{children}</>;
};
