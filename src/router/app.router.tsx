import { createBrowserRouter } from "react-router";
import Home from "@/pages/Home";
import ResiduosPeligrosos from "@/pages/ResiduosPeligrosos";
import ManejoEspecial from "@/pages/ManejoEspecial";
import Trazabilidad from "@/pages/Trazabilidad";
import Reportes from "@/pages/Reportes";
import Layout from '@/app/layout';


import NotFound from "@/pages/NotFound";


export const appRouter = createBrowserRouter([
    {
        path: '/mml/environment/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
        ],
    },
    {
        path: '/mml/environment/residuos-peligrosos',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ResiduosPeligrosos />
            },
        ],
    },
    {
        path: '/mml/environment/manejo-especial',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ManejoEspecial />
            },
        ],
    },
    {
        path: '/mml/environment/trazabilidad',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Trazabilidad />
            },
        ],
    },
    {
        path: '/mml/environment/reportes',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Reportes />
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]) 