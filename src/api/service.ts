import { apiRequest } from "@/lib/api";
import { axiosAuth } from "@/lib/axios";
import type { ResiduoSolido1PdfI, ResiduoSolido2PdfI, ResiduoPeligroPdfI , ResiduoPeligroSaveI, ResiduoSolidoSave1I } from "@/interfaces/interfaces";



export const listadoAreaGeneracionRP = (tipoGenerador:Number) =>
    apiRequest<any>(
            axiosAuth.post('/listado_rp_areageneracion', {tipo_generador: tipoGenerador })
        );

export const listadoAutorizacionRP = (destino_final:Number) =>
    apiRequest<any>(
            axiosAuth.post('/listado_rp_autorizacion', {destino_final: destino_final })
        );

export const listadoTipoEnvasesRP = () =>
    apiRequest<any>(
            axiosAuth.get('/listado_rp_tipoenvases', {})
        );

export const listadoDestinoFinalRP = () =>
    apiRequest<any>(
            axiosAuth.get('/listado_rp_destinofinal', {})
        );

export const listadoTipoGeneradorRP = () =>
    apiRequest<any>(
            axiosAuth.get('/listado_rp_tipogenerador', {})
        );

export const listadoTipoResiduoRP = () =>
    apiRequest<any>(
            axiosAuth.get('/listado_rp_tiporesiduo', {})
        );

//depende de tipo residuo
export const listadoSubTipoResiduoRP = (tipoResiduo:Number) =>
    apiRequest<any>(
            axiosAuth.post('/listado_rp_subtiporesiduo', {tipo_residuo: tipoResiduo})
        );


export const listadoTipoResiduoRSU = () =>
    apiRequest<any>(
            axiosAuth.get('/listado_rsu_tiporesiduo', {})
        );

export const listadoTipoGeneradorRSU_RME = () =>
    apiRequest<any>(
            axiosAuth.get('/listado_rsu_rme_tipogenerador', {})
        );

export const listadoAreaGeneraionRSU_RME = (tipoGenerador:Number) =>
    apiRequest<any>(
            axiosAuth.post('/listado_rsu_rme_generacion', {tipo_generador: tipoGenerador })
        );

export const listadoDestinoFinalRSU = () =>
    apiRequest<any>(
            axiosAuth.get('/listado_rsu_destinofinal', {})
        ); 

export const listadoTipoResiduoRME = () =>
    apiRequest<any>(
            axiosAuth.get('/listado_rme_tiporesiduo', {})
        ); 

export const listadoTipoTratamientoRME = () =>
    apiRequest<any>(
            axiosAuth.get('/listado_rme_tipotratamiento', {})
        ); 

export const listadoTransportistasRME = () =>
    apiRequest<any>(
            axiosAuth.get('/listado_rme_transportistas', {})
        ); 


//reportes residuos solidos urbanos
export const generarReporteRSU = (values:ResiduoSolido1PdfI) =>
    apiRequest<any>(
            axiosAuth.post('/generarReporteRSU', values)
        );
 
export const generarReporteRME = (values:ResiduoSolido2PdfI) =>
    apiRequest<any>(
            axiosAuth.post('/generarReporteRME', values)
        );

export const crearReporteRSU = (values:ResiduoSolidoSave1I) =>
    apiRequest<any>(
            axiosAuth.post('/crearReporteRSU', values)
        );


//reporte de residuo peligroso
export const generarReporteResiduoPeligroso = (values:ResiduoPeligroPdfI) =>
    apiRequest<any>(
            axiosAuth.post('/generarReporteResiduosPeligroso', values)
        );  

export const crearReporteResiduosPeligroso = (values:ResiduoPeligroSaveI) =>
    apiRequest<any>(
            axiosAuth.post('/crearReporteResiduosPeligroso', values)
        );

export const crearSalidaResiduosPeligroso = (folio:string) =>
    apiRequest<any>(
            axiosAuth.post('/crearSalidaResiduosPeligroso', {folio: folio})
        );