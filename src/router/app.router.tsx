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
import NotFound from "@/pages/NotFound";

import { Navigate } from "react-router";


interface RouteGuardProps {
    children: React.ReactNode;
}

function RouteGuard({ children }: RouteGuardProps) {
    const sesion = JSON.parse(localStorage.getItem('sesionIniciada') || '{}');

    let enabled = true ;

    sesion?.rol === 3 ? enabled = false : enabled;

    if (!enabled) {
        return <Navigate to="/mml/environment" replace />;
    }

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
                path: "trazabilidad",
                element: (
                    <RouteGuard >
                        <Trazabilidad />
                    </RouteGuard>
                )
            },
            {
                path: "reportes",
                element: (
                    <RouteGuard >
                        <Reportes />
                    </RouteGuard>
                )
            },
            {
                path: "bitacora",
                element: (
                    <RouteGuard >
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