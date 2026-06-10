import { useState, useEffect } from "react"
import { columns } from "./columns"
import type { ListResiduoPeligrosoManifiestos } from "@/interfaces/interfaces"
import { DataTable } from "./data-table"
import { listadoResiduosPeligrososManifiesto } from "@/api/service"

import { DialogSeleccionarManifiesto } from "@/components/dialog-seleccionar-manifiesto"

export default function ListadoRPManifiestos() {

  const [data, setData] = useState<ListResiduoPeligrosoManifiestos[]>([]);
  const [dataSelected, setDataSelected]  = useState<ListResiduoPeligrosoManifiestos>({
    numero_manifiesto: "",
    destino_final: "",
    nombre_residuos: "",
    fecha_salida: new Date(),
    ffecha_salida: ""
  });

  //dialog
  const [openDialog, setOpenDialog] = useState(false);
  
  useEffect(() => {
    cargarListado()
  }, [])

  const cargarListado = async () => {
    const result = await listadoResiduosPeligrososManifiesto()
    if (result) 
      setData(result.data)
  }

  const previsualizarPDF = (data: ListResiduoPeligrosoManifiestos) => {
    console.log({data});
    setOpenDialog(true);
    setDataSelected(data);
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        abrirVistaPrevia={previsualizarPDF}
      />

      {/* <DialogResiduoPeligrosoManfiesto
        data={dataSelected}
        open={openRP}
        setOpen={setOpenRP}
      /> */}

      <DialogSeleccionarManifiesto
        data={dataSelected}
        open={openDialog}
        setOpen={setOpenDialog}
      />

    </div>
  )
}
