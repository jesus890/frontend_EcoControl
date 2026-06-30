export interface CatalogoI {
    id: Number;
    descripcion: String;
    created_at : Date,
    updated_at: Date | null
}

export interface CatalogoSimple {
    id: number;
    descripcion: string;
}

export interface ReporteI {
    photo_blob: string;
    pdf_blob: string;
}


//Solidos Urbanos
export interface ManejoEspecialI {
    tipoResiduo: string,
    cantidad: number,
    tipoGenerador: string,
    tipoArea: string,
    fEntrada: Date,
    fSalida: Date,
    observaciones: string
}

export interface ResiduoSolido1PdfI {
    nombreResiduo: string,
    cantidad: Number,
    descGenerador: string,
    descArea: string,
    fEntrada: Date | null | string;
    fSalida : Date | null | string;
    descDestinoFinal: string;
}

export interface ResiduoSolido2PdfI {
    nombreResiduo: string,
    cantidad: Number,
    descGenerador: string,
    descArea: string,
    fEntrada: Date | null | string;
    fSalida : Date | null | string;
    descTratamiento : string;
    descTransportistas : string;
    manifiesto: string;
}

export interface ResiduoSolidoSave1I {
    descResiduo: String|null,
    cantidad: Number,
    descGenerador: String|null,
    descArea: String|null,
    fEntrada: String;
    fSalida: String;
    descDestinoFinal: String|null; 
}

export interface ResiduoSolidoSave2I {
    descResiduo: String|null,
    cantidad: Number,
    descGenerador: String|null,
    descArea: String|null,
    fEntrada: String;
    fSalida: String;
    descTratamiento: String|null;
    descTransportista: String|null; 
}



//Residuos Peligrosos 

export interface ResiduoPeligroSaveI {
    descMateria: string,
    descResiduo: string,
    descSubTipoResiduo: string|null,
    cantidad: number,
    descEnvase: string,
    descGenerador: string,
    descArea: string,
    descDestinoFinal: string|null,
    descAutorizacion: string|null,
    fEntrada: string;
}


export interface ResiduoPeligroPdfI {
    descMateria: string,
    descResiduo: string,
    descSubTipoResiduo: string|null;
    descGenerador: string,
    descArea: string,
    cantidad: number,
    fEntrada: Date | null | string;
    fSalida : Date | null | string;
    uuid: string|null;
    numManifiesto: string|null;
}


export interface ListResiduoPeligroso {
    id: number;
    uuid: string;
    tipo_residuo: CatalogoSimple;
    subtipo_residuo: CatalogoSimple | null;
    cantidad: number;
    tipo_generador: CatalogoSimple;
    area_generacion: CatalogoSimple;
    numero_manifiesto: string;

    destino_final: CatalogoSimple | null;
    transportista: CatalogoSimple | null;
    tipo_tratamiento: CatalogoSimple | null;

    tipo: string;
    ffecha_entrada: string;
    ffecha_salida: string;
    fecha_entrada: Date;
    fecha_salida: Date;
}









//Listado de estadisticas graficas
export interface ResiduoPeligrosoEstadistica {
  id: number;
  descripcion: string;
  cantidad_total: number;
  totalx_residuo: number;
}

//Listado datable de estadisticas 
export interface ResiduoListadoEstadistica {
  uuid: string;
  residuo: string;
  generador: string;
  area: string;
  fecha_entrada: string;
  ffecha_entrada: string;
  fecha_salida: string;
  ffecha_salida: string;
  cantidad: number;
}

//estadisticas generales basicas
export interface ResiduoEspecialNumEstadistica {
  total_acumulado: number;
  registros : number;
  tipox_residuo: number;
}

//Filtro para el buscador
export interface ResiduoFiltroEstadistica {
  tipoFecha: string  | null;  

  fRangos: {
    from: string
    to: string
  } | null,

  tipo_residuo: number[];
  tipo_generador: number[];
  area_generacion: number[];
  agregacion_materia: number[];
}

export interface cantidadResiduosPendientes {
  totalResiduos: number;
  totalPendiente: number;
  totalAntiguos: number;
}




//Listado de manifiestos
export interface ListResiduoPeligrosoManifiestos {
  numero_manifiesto: string;
  destino_final: string;
  nombre_residuos: string;
  fecha_salida: Date;
  ffecha_salida: string;
}


export interface ManifiestoPeligrosoPDF {
  destino_final: string;
  numero_manifiesto: string;
  transportista: number;
  num_placa: string;
  responsable_recepcion: string;
}


export interface ILogin {
  email: string;
  password: string; 
}

export interface IForgotPassword {
  email: string;
}


export interface IRestorePassword {
  email: String;
  password: String; 
  password_confirmation: String;
}

export interface IRestore2Password {
  email: string | undefined;
  token: string | undefined;
  password: string; 
  password_confirmation: string;
}

export interface IUser {
  id: string;
  name: string; 
  surname1: string;
  surname2: string;
  email: string;
  rol: string;
  fullname: string;
}