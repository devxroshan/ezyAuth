"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Stores
import { useUserStore } from "../stores/user.store";
import { useAppStore } from "../stores/app.store";

const Navbar = () => {
  // Hooks
  const pathname = usePathname();

  // useStates
  const [isSideNav, setSideNav] = useState<boolean>(false);

  // Stores
  const userStore = useUserStore();
  const appStore = useAppStore();

  const omittedPaths: string[] = ["/login", "/signup"];

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
  ];

  return (
    <>
      <nav
        className={`bg-foreground w-screen h-12 md:h-screen md:w-56 lg:w-[20vw] md:border-r md:flex-col border-b border-border flex items-center justify-start px-3 md:py-2 md:px-4 md:gap-6 ${
          omittedPaths.includes(pathname) ? "hidden" : ""
        }`}
      >
        <div className="flex items-center md:justify-start justify-center gap-3 select-none md:w-full">
          <Image
            src={"/menu-icon.png"}
            width={30}
            height={30}
            alt="Menu"
            className="cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 md:hidden"
            onClick={() => setSideNav(!isSideNav)}
          />

          <span className="font-semibold md:font-bold text-lg text-white md:text-2xl">
            <span className="text-green-400">ezy</span>Auth
          </span>
        </div>

        <div className="hidden w-full md:flex flex-col items-center justify-start gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="text-white hover:text-black hover:bg-green-400 rounded-lg hover:px-6 py-1.5 hover:font-medium transition-all duration-500 w-full"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="gap-2 rounded-lg cursor-pointer transition-all duration-300 items-center justify-start text-white select-none mt-[70vh] hover:bg-gray-700/20 w-full py-2 hidden md:flex px-2" onClick={() => appStore.setIsAccountSettings(true)}>
          <Image
            src={"/test.png"}
            width={35}
            height={35}
            alt="Profile Pic"
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-medium text-sm">{userStore.user?.name}</span>
            <input
              className="text-xs font-medium text-gray-500 outline-none w-32 lg:w-46 flex-1 select-none cursor-pointer"
              readOnly
              defaultValue={userStore.user?.email ?? ""}
            />
          </div>
        </div>
      </nav>

      {isSideNav && (
        <section className="fixed py-8 flex flex-col items-start px-5 gap-3 h-screen w-56 bg-foreground border-r border-border">
          <div className="flex flex-col items-center w-full gap-2">
            {navLinks.map((link) => (
              <Link
                className="text-white hover:text-black transition-all duration-500 hover:bg-green-400 hover:font-medium w-full hover:px-6 py-1.5 rounded-lg"
                key={link.name}
                href={link.path}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div
            className="flex gap-2 rounded-lg cursor-pointer transition-all duration-300 items-center justify-start text-white select-none mt-[70vh] hover:bg-gray-700/20 w-full py-2 px-2"
            onClick={() => appStore.setIsAccountSettings(true)}
          >
            <Image
              src={"/test.png"}
              width={35}
              height={35}
              alt="Profile Pic"
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-medium text-sm">Roshan Kewat</span>
              <input
                className="text-xs font-medium text-gray-500 outline-none w-28 flex-1"
                readOnly
                defaultValue={userStore.user?.email ?? ""}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Navbar;
