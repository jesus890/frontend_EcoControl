import { Outlet } from "react-router"
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="relative w-full min-w-0">
        <SidebarTrigger className="absolute top-6 left-0 z-50" />

        <div className="w-full">
          <Outlet />
        </div>
      </SidebarInset>

       
      <Toaster />
    </SidebarProvider>
  )
}
