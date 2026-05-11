import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  TriangleAlert,
  ChartArea,
  PackageOpen,
  FileSearchCorner,
  Users,
  Cog,
} from "lucide-react"

export function AppSidebar() {
  const items = [
    {
      title: "Inicio",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Residuos Peligrosos",
      url: "/residuos-peligrosos",
      icon: TriangleAlert,
    },
    {
      title: "Residuos sólidos Urbanos",
      url: "/manejo-especial",
      icon: PackageOpen,
    },
    {
      title: "Trazabilidad",
      url: "/trazabilidad",
      icon: FileSearchCorner,
    },
    {
      title: "Reportes",
      url: "/",
      icon: ChartArea,
    },
    {
      title: "Usuarios",
      url: "/",
      icon: Users,
    },
    {
      title: "Configuración",
      url: "/",
      icon: Cog,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-blanquito text-center">
        <p className="mt-6 text-[18px] font-bold text-white"> EcoControl </p>
        <p className="-mt-2.5 mb-2 text-[12px] font-thin text-blanquito">
          v1.0 — Sistema de Residuos
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />

        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title} className="mt-7">
                <SidebarMenuButton>
                  <div className="flex">
                    <a href={item.url} className="flex">
                      <item.icon className="mr-4 ml-2 h-6! w-6! text-blanquito" />
                      <span className="text-blanquito">{item.title}</span>
                    </a>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
