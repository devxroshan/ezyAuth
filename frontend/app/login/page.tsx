'use client';
import React from "react";
import Link from "next/link";

const Login = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <section className="bg-foreground rounded-lg border border-border w-96 h-fit py-2 px-4 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Login</span>
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="text"
            className="text-white px-2 border border-border rounded-md py-1 focus:outline-2 outline-border transition-all"
            placeholder="Email"
          />

          <input
            type="password"
            className="text-white px-2 border border-border rounded-md py-1 focus:outline-2 outline-border transition-all"
            placeholder="Password"
          />

          <div className="w-full flex items-center justify-end">
            <span className="text-white text-sm hover:font-medium cursor-pointer transition-all">
              Forgot Password
            </span>
          </div>

          <button className="bg-white w-full rounded-lg py-1 font-semibold cursor-pointer hover:bg-gray-300 active:scale-95 transition-all">
            Login
          </button>
        </div>

        <div className="text-white w-full flex items-center justify-center gap-2">
          <div className="w-24 py-0.5 bg-border rounded-full"></div>
          <span className="text-secondary-text">continue with</span>
          <div className="w-24 py-0.5 bg-border rounded-full"></div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="w-full rounded-lg border border-border bg-background text-secondary-text py-1 hover:font-medium cursor-pointer hover:bg-black/30 transition-all duration-400">Google</button>

          <button className="w-full rounded-lg border border-border bg-background text-secondary-text py-1 hover:font-medium cursor-pointer hover:bg-black/30 transition-all duration-400">GitHub</button>
        </div>

        <div className="flex text-sm items-center justify-center text-white">
          <span className="">Don't have an account??</span>
          <Link href={"/signup"} className="text-purple-700 hover:underline">Sign-Up</Link>
        </div>
      </section>
    </div>
  );
};

export default Login;
