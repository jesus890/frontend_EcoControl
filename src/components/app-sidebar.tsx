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
  ScrollText
} from "lucide-react"

import mml from "@/assets/mml.png"
import type { IUser } from "@/interfaces/interfaces"

import { puedeAcceder } from "@/lib/access"

type Props = {
  profile: IUser
}

export function AppSidebar({ profile }: Props) {

  
  const items = [
    {
      title: "Inicio",
      url: "/mml/environment/",
      icon: LayoutDashboard,
      habilitado : false
    },
    {
      title: "Residuos Peligrosos",
      url: "/mml/environment/residuos-peligrosos",
      icon: TriangleAlert,
      habilitado : false
    },
    {
      title: "Residuos sólidos Urbanos",
      url: "/mml/environment/manejo-especial",
      icon: PackageOpen,
      habilitado : false
    },
    {
      title: "Trazabilidad",
      url: "/mml/environment/trazabilidad",
      icon: FileSearchCorner,
      habilitado : !puedeAcceder("trazabilidad", profile.rol)
    },
    {
      title: "Reportes",
      url: "/mml/environment/reportes",
      icon: ChartArea,
      habilitado : !puedeAcceder("reportes", profile.rol)
    },
    {
      title: "Bitácora",
      url: "/mml/environment/bitacora",
      icon: ScrollText,
      habilitado : !puedeAcceder("bitacora", profile.rol)
    },
    {
      title: "Usuarios",
      url: "/mml/environment/usuarios",
      icon: Users,
      habilitado : !puedeAcceder("usuarios", profile.rol)
    },
    {
      title: "Configuración",
      url: "/",
      icon: Cog,
      habilitado : false
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-blanquito text-center">
        <img src={mml} className="mx-auto h-auto w-[90%]" alt="logo" />
        <p className="mt-[-2.5] mb-1 text-[18px] font-bold text-white">
          {" "}
          EcoControl{" "}
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />

        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title} className="mt-7">
                <SidebarMenuButton>
                  <div className={item.habilitado ? "pointer-events-none opacity-50 flex" : "flex"}>
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
