"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconSearch,
  IconStethoscope,
  IconCalendar,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SidebarDemo() {
  const links = [
    {
      label: "Buscar",
      href: "/",
      icon: (
        <IconSearch className="text-[#1E5ACD] h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Mis citas",
      href: "#",
      icon: (
        <IconCalendar className="text-[#1E5ACD] h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Tratamientos",
      href: "#",
      icon: (
        <IconStethoscope className="text-[#1E5ACD] h-5 w-5 flex-shrink-0" />
      ),
    },
    {
        label: "Mi perfil",
        href: "#",
        icon: (
          <IconUser className="text-[#1E5ACD] h-5 w-5 flex-shrink-0" />
        ),
    }
  ];

  const [open, setOpen] = useState(false); // Add this line back

  return (
    <div className={cn(
      "fixed left-0 top-0 flex flex-col md:flex-row bg-gray-50 dark:bg-neutral-900 h-screen w-[60px] border-r border-gray-200 dark:border-neutral-800",
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col h-full justify-between py-12">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mb-16">
              {open ? <Logo /> : <LogoIcon />}
            </div>
            <div><br></br></div>
            <div className="flex flex-col gap-8">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div><br></br></div>
          <div className="fixed bottom-0 left-0 w-full pt-2 pb-1">
            <SidebarLink
              link={{
                label: "Salir",
                href: "#",
                icon: (
                  <IconArrowLeft className="text-[#1E5ACD] h-3 w-3 flex-shrink-0" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex items-center text-sm text-black py-1 relative z-100"
    >
      <img 
        src="/static/fisio_find_logo.webp"
        alt="Logo"
        className="h-1.5 w-auto flex-shrink-0"
      />
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-5 items-center text-base text-black py-2 relative z-100"
    >
      <img 
        src="/static/fisio_find_logo.webp"
        alt="Fisio Find logo"
        className="h-0.5 w-auto flex-shrink-0"
      />
    </Link>
  );
};


