import { Outlet } from "react-router";
import Header from "./Header";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset } from "../ui/sidebar";

export default function Layout() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="p-4 pt-0">
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
}
