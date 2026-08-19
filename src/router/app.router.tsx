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
import NotFound from "@/pages/NotFound";

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
                element: <Trazabilidad />,
            },
            {
                path: "reportes",
                element: <Reportes />,
            },
        ],
    },



    {
        path: "*",
        element: <NotFound />,
    },
]);