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

type Props = {
  profile: IUser
}

export function AppSidebar({ profile }: Props) {

  
  const getAcceso = (modulo : string) => {

    const rol = Number(profile.rol)
    let deshabilitado = false;

    if(modulo == "trazabilidad" || modulo == "reportes" || modulo == "usuarios" )
    {
      if(rol > 2)
      {
        deshabilitado = true;
      }
    }
  
    return deshabilitado

  }


  const items = [
    {
      title: "Inicio",
      url: "/mml/environment/",
      icon: LayoutDashboard,
      habilitado : getAcceso("inicio")
    },
    {
      title: "Residuos Peligrosos",
      url: "/mml/environment/residuos-peligrosos",
      icon: TriangleAlert,
      habilitado : getAcceso("residuos-peligrosos")
    },
    {
      title: "Residuos sólidos Urbanos",
      url: "/mml/environment/manejo-especial",
      icon: PackageOpen,
      habilitado : getAcceso("manejo-especial")
    },
    {
      title: "Trazabilidad",
      url: "/mml/environment/trazabilidad",
      icon: FileSearchCorner,
      habilitado : getAcceso("trazabilidad")
    },
    {
      title: "Reportes",
      url: "/mml/environment/reportes",
      icon: ChartArea,
      habilitado : getAcceso("reportes")
    },
    {
      title: "Bitácora",
      url: "/mml/environment/bitacora",
      icon: ScrollText,
      habilitado : getAcceso("bitacora")
    },
    {
      title: "Usuarios",
      url: "/",
      icon: Users,
      habilitado : getAcceso("usuarios")
    },
    {
      title: "Configuración",
      url: "/",
      icon: Cog,
      habilitado : getAcceso("configuracion")
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
