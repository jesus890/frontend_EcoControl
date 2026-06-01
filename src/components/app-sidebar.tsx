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

import mml from "@/assets/mml.png";

export function AppSidebar() {
  const items = [
    {
      title: "Inicio",
      url: "/mml/environment/",
      icon: LayoutDashboard,
    },
    {
      title: "Residuos Peligrosos",
      url: "/mml/environment/residuos-peligrosos",
      icon: TriangleAlert,
    },
    {
      title: "Residuos sólidos Urbanos",
      url: "/mml/environment/manejo-especial",
      icon: PackageOpen,
    },
    {
      title: "Trazabilidad",
      url: "/mml/environment/trazabilidad",
      icon: FileSearchCorner,
    },
    {
      title: "Reportes",
      url: "/mml/environment/reportes",
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
        <img
          src={mml}
          className="w-[90%] h-auto mx-auto"
          alt="logo"
        />
        <p className="mb-1  mt-[-2.5] text-[18px] font-bold text-white"> EcoControl </p>
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

      
      <SidebarFooter>
        {/* <img
          src={smc}
          className="w-full h-auto"
          alt="logo"
        /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
