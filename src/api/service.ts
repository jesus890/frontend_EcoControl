import { apiRequest } from "@/lib/api"
import { axiosAuth } from "@/lib/axios"
import type {
  ResiduoSolido1PdfI,
  ResiduoSolido2PdfI,
  ResiduoPeligroPdfI,
  ResiduoPeligroSaveI,
  ResiduoSolidoSave1I,
  ResiduoSolidoSave2I,
  ResiduoFiltroEstadistica,
  ManifiestoPeligrosoPDF,
  ILogin,
  IRestorePassword,
  IRestore2Password,
  IForgotPassword,
  ManifiestoEspecialPDF,
  ResiduoPeligroComentariosSaveI
} from "@/interfaces/interfaces"

/* 
    C   A   T   A   L   O   G   O   S
*/
export const listadoAgregacionMateria = () =>
  apiRequest<any>(axiosAuth.get("/listado_materia", {}))

export const listadoTipoResiduoRP = () =>
  apiRequest<any>(axiosAuth.get("/listado_rp_tiporesiduo", {}))

//depende del tipo de materia
export const listadoTipoResiduoxMateriaRP = (tipoMateria: Number) =>
  apiRequest<any>(
    axiosAuth.post("/listado_rp_materia_tiporesiduo", {
      tipo_materia: tipoMateria,
    })
  )

//depende de tipo residuo
export const listadoSubTipoResiduoRP = (tipoResiduo: Number) =>
  apiRequest<any>(
    axiosAuth.post("/listado_rp_subtiporesiduo", { tipo_residuo: tipoResiduo })
  )

export const listadoTipoEnvasesRP = () =>
  apiRequest<any>(axiosAuth.get("/listado_rp_tipoenvases", {}))

export const listadoTipoGeneradorRP = () =>
  apiRequest<any>(axiosAuth.get("/listado_rp_tipogenerador", {}))

//depende de tipo_generador
export const listadoAreaGeneracionRP = (tipoGenerador: Number) =>
  apiRequest<any>(
    axiosAuth.post("/listado_rp_areageneracion", {
      tipo_generador: tipoGenerador,
    })
  )

export const listadoAreaGeneracionRPGeneral = () =>
  apiRequest<any>(axiosAuth.post("/listado_rp_areageneracion_general", {}))


export const listadoAreaGeneracionMultiple = (tipo_generador: number[]) =>
  apiRequest<any>(axiosAuth.post("/listado_areageneracion_multiple", {tipo_generador: tipo_generador}))

export const listadoAgregacionMateriaMultiple = (tipo_materia: number[]) =>
  apiRequest<any>(axiosAuth.post("/listado_agregacionmateria_multiple", {agregacion_materia: tipo_materia}))




export const listadoDestinoFinalRP = () =>
  apiRequest<any>(axiosAuth.get("/listado_rp_destinofinal", {}))

export const listadoAutorizacionRP = (destino_final: Number) =>
  apiRequest<any>(
    axiosAuth.post("/listado_rp_autorizacion", { destino_final: destino_final })
  )

export const listadoTipoResiduoRSU = () =>
  apiRequest<any>(axiosAuth.get("/listado_rsu_tiporesiduo", {}))

export const listadoTipoGeneradorRSU_RME = () =>
  apiRequest<any>(axiosAuth.get("/listado_rsu_rme_tipogenerador", {}))

export const listadoAreaGeneraionRSU_RME = (tipoGenerador: Number) =>
  apiRequest<any>(
    axiosAuth.post("/listado_rsu_rme_generacion", {
      tipo_generador: tipoGenerador,
    })
  )

export const listadoDestinoFinalRSU = () =>
  apiRequest<any>(axiosAuth.get("/listado_rsu_destinofinal", {}))

export const listadoTipoResiduoRME = () =>
  apiRequest<any>(axiosAuth.get("/listado_rme_tiporesiduo", {}))

export const listadoTipoTratamientoRME = () =>
  apiRequest<any>(axiosAuth.get("/listado_rme_tipotratamiento", {}))

export const listadoTransportistasRME = () =>
  apiRequest<any>(axiosAuth.get("/listado_rme_transportistas", {}))

export const listadoAreaGeneracionMEGeneral = () =>
  apiRequest<any>(axiosAuth.post("/listado_me_areageneracion_general", {}))

/* 
    M   A   N   E   J   O          E   S   P   E   C   I   A   L   
*/

//crea el pdf rsu 
export const generarReporteRSU = (values: ResiduoSolido1PdfI) =>
  apiRequest<any>(axiosAuth.post("/generarReporteRSU", values))

//crea el pdf rme
export const generarReporteRME = (values: ResiduoSolido2PdfI) =>
  apiRequest<any>(axiosAuth.post("/generarReporteRME", values))

//guarda registro RSU
export const crearResiduoRSU = (values: ResiduoSolidoSave1I) =>
  apiRequest<any>(axiosAuth.post("/crearResiduoRSU", values))

//busca residuo RSU
export const buscarResiduoRSU = (uuid: string) =>
  apiRequest<any>(axiosAuth.post("/buscarResiduoRSU", { uuid }))

//actualiza residuo RSU
export const actualizaResiduoRSU = (values: ResiduoSolidoSave1I) =>
  apiRequest<any>(axiosAuth.post("/actualizarResiduoRSU", values))


//guarda registro RME
export const crearResiduoRME = (values: ResiduoSolidoSave2I) =>
  apiRequest<any>(axiosAuth.post("/crearResiduoRME", values))


//busca residuo RME
export const buscarResiduoRME = (uuid: string) =>
  apiRequest<any>(axiosAuth.post("/buscarResiduoRME", { uuid }))

//actualiza residuo RME
export const actualizarResiduoRME = (values: ResiduoSolidoSave2I) =>
  apiRequest<any>(axiosAuth.post("/actualizarResiduoRME", values))







//estadisticas de barras
export const crearEstadisticoRSU = (values: ResiduoFiltroEstadistica) =>
  apiRequest<any>(axiosAuth.post("/reporteEstadisticoEspecialRSU", values))

//estadisticas en forma de listado
export const creaReporteListadoRSU = (values: ResiduoFiltroEstadistica) =>
  apiRequest<any>(axiosAuth.post("/reporteListadoEspecialRSU", values))

//estadisticas de barras
export const crearEstadisticoRME = (values: ResiduoFiltroEstadistica) =>
  apiRequest<any>(axiosAuth.post("/reporteEstadisticoEspecialRME", values))

//estadisticas en forma de listado
export const creaReporteListadoRME = (values: ResiduoFiltroEstadistica) =>
  apiRequest<any>(axiosAuth.post("/reporteListadoEspecialRME", values))

export const listadoEspecialesManifiesto = () =>
  apiRequest<any>(axiosAuth.post("/reporteListadoEspecialManifiesto", {}))

//PDF
export const generarReporteManifiestoME = (values: ManifiestoEspecialPDF) =>
  apiRequest<any>(axiosAuth.post("/generarReporteManifiestoME", values))




/* 
    R   E   S   I   D   U   O       P   E   L   I   G   R   O   S   O  
*/

//PDF
export const generarReporteResiduoPeligroso = (values: ResiduoPeligroPdfI) =>
  apiRequest<any>(axiosAuth.post("/generarReporteResiduosPeligroso", values))

//PDF
export const generarReporteManifiestoRP = (values: ManifiestoPeligrosoPDF) =>
  apiRequest<any>(axiosAuth.post("/generarReporteManifiestoRP", values))


//Guarda
export const crearResiduosPeligroso = (values: ResiduoPeligroSaveI) =>
  apiRequest<any>(axiosAuth.post("/crearResiduosPeligroso", values))

//busca
export const buscarResiduosPeligroso = (uuid: string) =>
  apiRequest<any>(axiosAuth.post("/buscarResiduoPeligroso", { uuid }))

//actualiza
export const actualizarReporteResiduosPeligroso = (values: ResiduoPeligroSaveI) =>
  apiRequest<any>(axiosAuth.post("/actualizarReporte", values))

//actualiza comentarios
export const actualizaComentariosReporte = (values: ResiduoPeligroComentariosSaveI) =>
  apiRequest<any>(axiosAuth.post("/actualizarComentarios", values))


//modulo de trazabilidad (cuando se escanea el QR)
export const crearSalidaResiduos = (folio: string, manifiesto_independiente: boolean) =>
  apiRequest<any>(
    axiosAuth.post("/crearSalidaResiduos", { folio: folio, manifiesto_independiente: manifiesto_independiente })
  )

//estadisticas de barras
export const crearEstadisticoPeligroso = (values: ResiduoFiltroEstadistica) =>
  apiRequest<any>(axiosAuth.post("/reporteEstadisticoPeligroso", values))

//estadisticas en forma de listado
export const creaReporteListadoPeligroso = (values: ResiduoFiltroEstadistica) =>
  apiRequest<any>(axiosAuth.post("/reporteListadoPeligroso", values))

//listado de solidos peligrosos y residuos peligrosos
export const listadoResiduos = () =>
  apiRequest<any>(axiosAuth.post("/listado_residuos", {}))


//listado de bitacora
export const listadoBitacora = () =>
  apiRequest<any>(axiosAuth.post("/listado_bitacora", {}))




export const obtenerTotalResiduos = () =>
  apiRequest<any>(axiosAuth.post("/obtener_total_residuos", {}))


export const listadoResiduosPeligrososManifiesto = () =>
  apiRequest<any>(axiosAuth.post("/reporteListadoPeligrosoManifiesto", {}))



/* 
  L  O   G   I    N 
*/

export const iniciarSesion = (values : ILogin) =>
  apiRequest<any>(axiosAuth.post("/login", values))

export const restaurarPrimerPassword = (values : IRestorePassword) =>
  apiRequest<any>(axiosAuth.post("/restore-first-password", values))

export const restaurarPassword = (values : IRestore2Password) =>
  apiRequest<any>(axiosAuth.post("/restore-password", values))


export const contrasenaOlvidada = (values : IForgotPassword) =>
  apiRequest<any>(axiosAuth.post("/forgot-password", values))

export const cerrarSesion = () =>
  apiRequest<any>(axiosAuth.post("/logout", {}))

export const obtenerDatosSesion = () =>
  apiRequest<any>(axiosAuth.post("/getUsuario", {}))