"use client";

import { useSession } from "next-auth/react";
import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export const MainLayout: React.FC<Props> = ({ children }) => {
  const { data: session, status } = useSession();
  const path = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (!session && status === "unauthenticated" && !path.startsWith("/auth")) {
      router.push("/auth/login");
    }
  }, [session]);

  return (
    <>
      {path.startsWith("/auth") ? (
        <div className="flex flex-row min-h-full pt-[80px]">
          <main className="main flex flex-col flex-grow bg-gray">
            {children}
          </main>
        </div>
      ) : (
        status !== "loading" &&
        session?.user && (
          <div className="flex flex-row min-h-full pt-[80px]">
            <Sidebar
              sidebarOpen={sidebarOpen}
              onOutsideClick={() => setSidebarOpen(false)}
            />

            <main className="main flex flex-col flex-grow bg-gray overflow-auto md:ml-64">
              <button
                className="md:hidden p-4 focus:outline-none max-w-[80px]"
                onClick={toggleSidebar}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
              {children}
            </main>
          </div>
        )
      )}
    </>
  );
};
