import { apiRequest } from "@/lib/api";
import { axiosAuth } from "@/lib/axios";


export const listadoAreaGeneracion = () =>
    apiRequest<any>(
            axiosAuth.get('/listadoAreaGeneracion', {})
        );

export const listadoTipoEnvases = () =>
    apiRequest<any>(
            axiosAuth.get('/listadoTipoEnvases', {})
        );


export const listadoTipoGenerador = () =>
    apiRequest<any>(
            axiosAuth.get('/listadoTipoGenerador', {})
        );

export const listadoTipoResiduo = () =>
    apiRequest<any>(
            axiosAuth.get('/listadoTipoResiduo', {})
        );   