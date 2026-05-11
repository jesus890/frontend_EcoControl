import { createBrowserRouter } from "react-router";
import Home from "@/pages/Home";
import ResiduosPeligrosos from "@/pages/ResiduosPeligrosos";
import ManejoEspecial from "@/pages/ManejoEspecial";
import Trazabilidad from "@/pages/Trazabilidad";
import Layout from '@/app/layout';

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
        ],
    },
    {
        path: '/residuos-peligrosos',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ResiduosPeligrosos />
            },
        ],
    },
    {
        path: '/manejo-especial',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ManejoEspecial />
            },
        ],
    },
    {
        path: '/trazabilidad',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Trazabilidad />
            },
        ],
    },

    
]) 