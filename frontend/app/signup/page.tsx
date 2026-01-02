"use client";
import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SignUpAPI } from "../api/auth.api";

interface ISignUp {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [signUpInfo, setSignUpInfo] = useState<ISignUp>({
    name: "",
    email: "",
    password: "",
  });
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);

  const signUpMutation = useMutation({
    mutationFn: SignUpAPI,
    onSuccess: (data) => {
      if (data.ok) {
        setIsSignedUp(true);
      }
    },
    onError: (error) => {
      
    },
  });

  return (
    <div className="w-screen h-screen select-none flex items-center justify-center">
      <section className="bg-foreground rounded-lg border border-border w-96 h-fit py-2 px-4 flex flex-col gap-5">
        {!isSignedUp && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">SignUp</span>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                className="text-white px-2 border border-border rounded-md py-1 focus:outline-2 outline-border transition-all"
                placeholder="Name"
                value={signUpInfo.name}
                onChange={(e) =>
                  setSignUpInfo({
                    ...signUpInfo,
                    name: e.target.value,
                  })
                }
              />
              <input
                type="text"
                className="text-white px-2 border border-border rounded-md py-1 focus:outline-2 outline-border transition-all"
                placeholder="Email"
                value={signUpInfo.email}
                onChange={(e) =>
                  setSignUpInfo({
                    ...signUpInfo,
                    email: e.target.value,
                  })
                }
              />

              <input
                type="password"
                className="text-white px-2 border border-border rounded-md py-1 focus:outline-2 outline-border transition-all"
                placeholder="Password"
                value={signUpInfo.password}
                onChange={(e) =>
                  setSignUpInfo({
                    ...signUpInfo,
                    password: e.target.value,
                  })
                }
              />

              <button
                className={`${signUpMutation.isPending ? "bg-green-800 cursor-default" : "bg-green-400 hover:bg-green-500 cursor-pointer"} w-full rounded-lg py-1 font-semibold active:scale-95 transition-all`}
                disabled={signUpMutation.isPending}
                onClick={() => {
                  if (
                    !signUpInfo.name ||
                    !signUpInfo.email ||
                    !signUpInfo.password
                  )
                    return;

                  signUpMutation.mutate(signUpInfo);
                }}
              >
                {signUpMutation.isPending ? "Signing Up..." : "Sign Up"}
              </button>
            </div>

            <div className="text-white w-full flex items-center justify-center gap-2">
              <div className="w-24 py-0.5 bg-border rounded-full"></div>
              <span className="text-secondary-text">continue with</span>
              <div className="w-24 py-0.5 bg-border rounded-full"></div>
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full rounded-lg border border-border bg-background text-secondary-text py-1 hover:font-medium cursor-pointer hover:bg-black/30 transition-all duration-400">
                Google
              </button>

              <button className="w-full rounded-lg border border-border bg-background text-secondary-text py-1 hover:font-medium cursor-pointer hover:bg-black/30 transition-all duration-400">
                GitHub
              </button>
            </div>

            <div className="flex text-sm items-center justify-center text-white">
              <span className="">Already have an account??</span>
              <Link href={"/login"} className="text-purple-700 hover:underline">
                Log-in
              </Link>
            </div>
          </>
        )}

        {isSignedUp && (
          <div className="flex flex-col gap-4 items-center justify-center py-10">
            <span className="text-white font-semibold text-lg">
              SignUp Successful!
            </span>
            <Link
              href={"https://mail.google.com/mail"}
              target="_blank"
              className="bg-green-400 px-4 py-1 rounded-lg font-semibold hover:bg-green-500 active:scale-95 transition-all"
            >
              Verify Email
            </Link>
            <Link
              href={"/login"}
              className="bg-green-400 px-4 py-1 rounded-lg font-semibold hover:bg-green-500 active:scale-95 transition-all"
            >
              Login
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default SignUp;
