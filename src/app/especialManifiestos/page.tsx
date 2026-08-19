import { useState, useEffect } from "react"
import { columns } from "./columns"
import type { ListEspecialManifiestos} from "@/interfaces/interfaces"
import { DataTable } from "./data-table"
import { listadoEspecialesManifiesto } from "@/api/service"

import { DialogSeleccionarManifiestoME } from "@/components/dialog-seleccionar-manifiesto-me"

export default function ListadoEspecialManifiestos() {

  const [data, setData] = useState<ListEspecialManifiestos[]>([]);
  const [dataSelected, setDataSelected]  = useState<ListEspecialManifiestos>({
    numero_manifiesto: "",
    transportista: "",
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
    const result = await listadoEspecialesManifiesto()
    if (result) 
      setData(result.data)
  }

  const previsualizarPDF = (data: ListEspecialManifiestos) => {
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

      <DialogSeleccionarManifiestoME
        data={dataSelected}
        open={openDialog}
        setOpen={setOpenDialog}
      />

    

    </div>
  )
}
