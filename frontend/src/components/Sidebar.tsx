"use client";

import { SessionType } from "@/types";
import {
  ChartBarSquareIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Props {
  sidebarOpen: boolean;
  onOutsideClick: () => void;
}

export const Sidebar: React.FC<Props> = ({ sidebarOpen, onOutsideClick }) => {
  const { data: session } = useSession() as SessionType;
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: "/", label: "Dashboard", icon: ChartBarSquareIcon },
    { href: "/leads", label: "Leads", icon: UserGroupIcon },
    { href: "/feedbacks", label: "Feedbacks", icon: StarIcon },
    { href: "/sources", label: "Sources", icon: DocumentTextIcon },
    { href: "/settings", label: "Settings", icon: Cog6ToothIcon },
  ];

  const isPathActive = (path: string) => {
    return pathname === "/"
      ? pathname === path
      : pathname.startsWith(path) && path !== "/";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOutsideClick]);

  return (
    session?.user && (
      <aside
        ref={sidebarRef}
        className={`sidebar fixed top-[80px] left-0 h-full w-64 border-1 md:shadow p-4 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-150 ease-in-out z-50 bg-white`}
      >
        <div className="sidebar-content font-secondary mt-4">
          <ul className="flex flex-col w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.href}
                  className={`mt-2 rounded-full hover:bg-gray-100 ${
                    isPathActive(item.href) ? "active bg-gray" : ""
                  }`}
                >
                  <Link
                    href={item.href}
                    className="flex flex-row items-center h-10 px-3"
                  >
                    <Icon className="h-5 w-5" />
                    <h5 className="ml-3">{item.label}</h5>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    )
  );
};
