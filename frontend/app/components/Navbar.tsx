"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  // Hooks
  const pathname = usePathname()

  const [isSideNav, setSideNav] = useState<boolean>(false);

  const omittedPaths:string[] = ["/login", "/signup"]

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Trash",
      path: "/trash",
    },
  ];

  return (
    <>
      <nav className={`bg-foreground w-screen h-12 md:h-screen md:w-56 lg:w-72 md:border-r md:flex-col border-b border-border flex items-center justify-start px-3 md:py-2 md:px-4 md:gap-6 ${omittedPaths.includes(pathname)?"hidden":""}`}>
        <div className="flex items-center md:justify-start justify-center gap-3 select-none md:w-full">
          <Image
            src={"/menu-icon.png"}
            width={30}
            height={30}
            alt="Menu"
            className="cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 md:hidden"
            onClick={() => setSideNav(!isSideNav)}
          />

          <span className="font-semibold md:font-bold text-lg text-white md:text-2xl">ezyAuth</span>
        </div>

        <div className="hidden w-full md:flex flex-col items-center justify-start gap-2">
            {navLinks.map(link => (
                <Link key={link.name} href={link.path} className="text-white hover:text-black hover:bg-white rounded-lg hover:px-6 py-1.5 hover:font-medium transition-all duration-500 w-full">{link.name}</Link>
            ))}
        </div>
      </nav>

      {isSideNav && (
        <section className="fixed py-8 flex flex-col items-start px-5 gap-3 h-screen w-56 bg-foreground border-r border-border">
          {navLinks.map((link) => (
            <Link
              className="text-white hover:text-black transition-all duration-500 hover:bg-white hover:font-medium w-full hover:px-6 py-1.5 rounded-lg"
              key={link.name}
              href={link.path}
            >
              {link.name}
            </Link>
          ))}
        </section>
      )}
    </>
  );
};

export default Navbar;
