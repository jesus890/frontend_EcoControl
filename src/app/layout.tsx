import { useEffect, useState} from "react"
import { Outlet } from "react-router"
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"

import { LogOutIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cerrarSesion , obtenerDatosSesion } from "@/api/service"
import type { IUser } from "@/interfaces/interfaces";
import photo from "@/assets/profile.png"
import { useNavigate } from "react-router"

export default function Layout() {

  const [profile, setProfile] = useState<IUser>({
    'id' : "",
    "name": "",
    "surname1": "",
    "surname2": "",
    "email": "",
    "rol": "",
    "fullname": ""
  });

  const [isUserLogged, setUserLogged ] = useState(false);

  //redirecciona a login si no hay token - si lo hay redirecciona a dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && location.pathname !== "/login") {
      navigate("/login");
    }

    if (token && location.pathname === "/login") {
      navigate("/");
    }

    //para detectar si el usuario se ha logueado
    token ? setUserLogged(true) : setUserLogged(false);

  }, [location]);


  //obtiene informacion del usuario logueado
  useEffect(() => {
    if(isUserLogged)
      getUserInformation();
  }, [isUserLogged])


  const getUserInformation = async() => {
    try
    {
      const response =  await obtenerDatosSesion();
      if (response.result)
      {
        setProfile(response.data);
        localStorage.setItem('sesionIniciada', JSON.stringify(response.data));
      }
      else
      {
        navigate("/login");
      }
    }
    catch (error) //ocurre un error
    {
      navigate("/login");
    }
  }


  const navigate = useNavigate()

  //cierra la sesion del usuario logueado
  const closeSesion = async () => {
    try {
      await cerrarSesion()
      localStorage.removeItem("token");
      localStorage.removeItem("sesionIniciada");
      navigate("/login")
    } catch (ex) {
      console.log({ ex })
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar profile={profile}/>

      <SidebarInset className="relative w-full min-w-0">
        <div className="flex! bg-white p-3">
          <SidebarTrigger className="left-0 z-50" />
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={photo} alt="shadcn" />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>{profile.fullname}</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => closeSesion()}>
                  <LogOutIcon />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="w-full">
          <Outlet />
        </div>
      </SidebarInset>

      <Toaster />
    </SidebarProvider>
  )
}
