import { createBrowserRouter } from "react-router";

import Layout from "@/app/layout";

import Login from "@/pages/Login";
import RestorePassword from "@/pages/RestorePassword";
import ChangePassword from "@/pages/ChangePassword";

import Home from "@/pages/Home";
import ResiduosPeligrosos from "@/pages/ResiduosPeligrosos";
import ManejoEspecial from "@/pages/ManejoEspecial";
import Trazabilidad from "@/pages/Trazabilidad";
import Reportes from "@/pages/Reportes";
import Bitacora from "@/pages/Bitacora";
import Configuracion from "@/pages/Configuracion";
import Usuarios from "@/pages/Usuarios";
import NotFound from "@/pages/NotFound";

import { Navigate, useOutletContext } from "react-router";
import { puedeAcceder, type ModuloRestringido } from "@/lib/access";
import type { IUser } from "@/interfaces/interfaces";


function RouteGuard({ children, modulo }: { children: React.ReactNode; modulo: ModuloRestringido }) {
    const profile = useOutletContext<IUser>();

    if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;
    if (!profile?.id) return <p className="p-6" role="status">Verificando acceso…</p>;
    if (!puedeAcceder(modulo, profile.rol)) return <Navigate to="/mml/environment" replace />;

    return children;
}

export const appRouter = createBrowserRouter([

    {
        path: "/",
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "olvidaste-tu-contraseña",
                element: <RestorePassword />,
            },
            {
                path: "actualizar-contraseña",
                element: <ChangePassword />,
            },
        ],
    },

    
    {
        path: "/mml/environment",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "residuos-peligrosos",
                element: <ResiduosPeligrosos />,
            },
            {
                path: "residuos-peligrosos/:uuid",
                element: <ResiduosPeligrosos />,
            },
            {
                path: "manejo-especial",
                element: <ManejoEspecial />,
            },
            {
                path: "manejo-especial/:uuid",
                element: <ManejoEspecial />,
            },

            {
                path: "configuracion",
                element: <Configuracion />,
            },
            {
                path: "usuarios",
                element: <RouteGuard modulo="usuarios"><Usuarios /></RouteGuard>,
            },
            {
                path: "trazabilidad",
                element: (
                    <RouteGuard modulo="trazabilidad">
                        <Trazabilidad />
                    </RouteGuard>
                )
            },
            {
                path: "reportes",
                element: (
                    <RouteGuard modulo="reportes">
                        <Reportes />
                    </RouteGuard>
                )
            },
            {
                path: "bitacora",
                element: (
                    <RouteGuard modulo="bitacora">
                        <Bitacora />
                    </RouteGuard>
                )
            },

        ],
    },



    {
        path: "*",
        element: <NotFound />,
    },
]);