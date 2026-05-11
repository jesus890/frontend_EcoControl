export interface CatalogoI {
    id: Number;
    descripcion: String;
    created_at : Date,
    updated_at: Date | null
}

export interface ReporteI {
    photo_blob: string;
    pdf_blob: string;
}

export interface ManejoEspecialI {
    tipoResiduo: string,
    cantidad: number,
    tipoGenerador: string,
    tipoArea: string,
    fEntrada: Date,
    fSalida: Date,
    observaciones: string
}


export interface ResiduoPeligroSaveI {
    nombreResiduo: String,
    cantidad: Number,
    descEnvase: String,
    descGenerador: String,
    descArea: String,
    descDestinoFinal: String|null,
    descAutorizacion: String|null,
    fEntrada: string;
}


export interface ResiduoPeligroPdfI {
    nombreResiduo: string,
    descGenerador: string,
    descArea: string,
    cantidad: number,
    fEntrada: string|null;
    fSalida : string|null;
    uuid: string|null;
}
