import { useState, useEffect } from "react"
import { columns } from "./columns"
import type { ListResiduoPeligroso } from "@/interfaces/interfaces"
import { DataTable } from "./data-table"
import { listadoResiduos } from "@/api/service"

import type { ResiduoPeligroPdfI , ResiduoSolido1PdfI, ResiduoSolido2PdfI} from "@/interfaces/interfaces"

import { DialogResiduoPeligroso } from "@/components/dialog-residuo-peligroso"
import { DialogSolidoUrbano1 } from "@/components/dialog-solido-urbano-1";
import { DialogSolidoUrbano2 } from "@/components/dialog-solido-urbano-2";

export default function ListadoResiduos() {

  const [data, setData] = useState<ListResiduoPeligroso[]>([])

  //dialog
  const [openRP, setOpenRP] = useState(false);
  const [openRSU, setOpenRSU] = useState(false);
  const [openRME, setOpenRME] = useState(false);

  const inicializarVariablesRP = {
    descMateria: "",
    descResiduo: "",
    descSubTipoResiduo: "",
    descGenerador: "",
    descArea: "",
    cantidad: 1,
    fEntrada: null,
    fSalida: null,
    uuid: "",
    numManifiesto: "",
  }

  const inicializarVariablesRSU = {
    nombreResiduo: "",
    descGenerador: "",
    descArea: "",
    cantidad: 1,
    fEntrada: null,
    fSalida: null,
    descDestinoFinal: "",
  }

  const inicializarVariablesRME = {
    nombreResiduo: "",
    descGenerador: "",
    descArea: "",
    cantidad: 1,
    fEntrada: null,
    fSalida: null,
    descTransportistas: "",
    descTratamiento: "",
    manifiesto: ""
  }

  //date pdf
  const [dataPdfRP, setdataPdfRP] = useState<ResiduoPeligroPdfI>(inicializarVariablesRP);
  const [dataPdfRSU, setdataPdfRSU] = useState<ResiduoSolido1PdfI>(inicializarVariablesRSU);
  const [dataPdfRME, setdataPdfRME] = useState<ResiduoSolido2PdfI>(inicializarVariablesRME);



  useEffect(() => {
    cargarListado()
  }, [])

  const cargarListado = async () => {
    const result = await listadoResiduos()
    if (result) {
       console.log(result.data);
      setData(result.data)
    }
  }

  const previsualizarPDF = (data: ListResiduoPeligroso) => {

    if (data.tipo == "RP") {
      setdataPdfRP(inicializarVariablesRP)

      const dataToGeneratePDF = {
        descMateria: "",
        descResiduo: data.tipo_residuo.descripcion,
        descSubTipoResiduo: data.subtipo_residuo?.descripcion || "",
        descGenerador: data.tipo_generador.descripcion,
        descArea: data.area_generacion.descripcion,
        cantidad: data.cantidad,
        fEntrada: data.fecha_entrada,
        fSalida: data.fecha_salida,
        uuid: data.uuid,
        numManifiesto: data.numero_manifiesto,
      }

      setdataPdfRP(dataToGeneratePDF);
      setOpenRP(true);
    }
    else if (data.tipo == "RSU")
    {
      setdataPdfRSU(inicializarVariablesRSU);

      const dataToGeneratePDF = {
        nombreResiduo: data.tipo_residuo.descripcion,
        descGenerador: data.tipo_generador.descripcion,
        descArea: data.area_generacion.descripcion,
        cantidad: data.cantidad,
        fEntrada: data.fecha_entrada,
        fSalida: data.fecha_salida,
        descDestinoFinal: data.destino_final?.descripcion || "",
      }

      setdataPdfRSU(dataToGeneratePDF);
      setOpenRSU(true);
    }
    else if (data.tipo == "RME")
    {

      setdataPdfRME(inicializarVariablesRME);

      const dataToGeneratePDF = {
        nombreResiduo: data.tipo_residuo.descripcion,
        descGenerador: data.tipo_generador.descripcion,
        descArea: data.area_generacion.descripcion,
        cantidad: data.cantidad,
        fEntrada: data.fecha_entrada,
        fSalida: data.fecha_salida,
        descTransportistas: data.transportista?.descripcion || "",
        descTratamiento: data.tipo_tratamiento?.descripcion || "",
        manifiesto: data.numero_manifiesto
      }

      setdataPdfRME(dataToGeneratePDF);
      setOpenRME(true);
    }
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        abrirVistaPrevia={previsualizarPDF}
      />

      <DialogResiduoPeligroso
        open={openRP}
        setOpen={setOpenRP}
        data={dataPdfRP}
      />

      <DialogSolidoUrbano1 
        open={openRSU}
        setOpen={setOpenRSU}
        data={dataPdfRSU}
      />

      <DialogSolidoUrbano2
        open={openRME}
        setOpen={setOpenRME}
        data={dataPdfRME}
      />
 
    </div>
  )
}
