export interface CatalogoI {
    id: Number;
    descripcion: String;
    created_at : Date,
    updated_at: Date | null
}

export interface CatalogoSimple {
    id: Number;
    descripcion: String;
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
    nombreResiduo: String,
    cantidad: Number,
    descGenerador: String,
    descArea: String,
    fEntrada: String;
    fSalida : String;
    descDestinoFinal: String;
}

export interface ResiduoSolido2PdfI {
    nombreResiduo: String,
    cantidad: Number,
    descGenerador: String,
    descArea: String,
    fEntrada: String;
    fSalida : String;
    descTratamiento : String;
    descTransportistas : String;
    manifiesto: String;
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
    descResiduo: String,
    descSubTipoResiduo: String|null,
    cantidad: Number,
    descEnvase: String,
    descGenerador: String,
    descArea: String,
    descDestinoFinal: String|null,
    descAutorizacion: String|null,
    fEntrada: string;
}


export interface ResiduoPeligroPdfI {
    descResiduo: string,
    descSubTipoResiduo: string|null;
    descGenerador: string,
    descArea: string,
    cantidad: number,
    fEntrada: string|null;
    fSalida : string|null;
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
    tipo: string;
    ffecha_entrada: string;
    fecha_entrada: Date;
}
