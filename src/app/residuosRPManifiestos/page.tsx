import { useState, useEffect } from "react"
import { columns } from "./columns"
import type { ListResiduoPeligrosoManifiestos } from "@/interfaces/interfaces"
import { DataTable } from "./data-table"
import { listadoResiduosPeligrososManifiesto } from "@/api/service"

import { DialogResiduoPeligrosoManfiesto } from "@/components/dialog-residuo-manifiesto-rp"
// import { DialogResiduoPeligroso } from "@/components/dialog-residuo-peligroso"
// import { DialogSolidoUrbano1 } from "@/components/dialog-solido-urbano-1";
// import { DialogSolidoUrbano2 } from "@/components/dialog-solido-urbano-2";

export default function ListadoRPManifiestos() {

  const [data, setData] = useState<ListResiduoPeligrosoManifiestos[]>([])

  //dialog
  const [openRP, setOpenRP] = useState(false);


  useEffect(() => {
    cargarListado()
  }, [])

  const cargarListado = async () => {
    const result = await listadoResiduosPeligrososManifiesto()
    if (result) 
    {
      setData(result.data)
    }
  }

  const previsualizarPDF = (data: ListResiduoPeligrosoManifiestos) => {
    console.log({data});
    setOpenRP(true);
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        abrirVistaPrevia={previsualizarPDF}
      />

      <DialogResiduoPeligrosoManfiesto 
        open={openRP}
        setOpen={setOpenRP}
      />
    </div>
  )
}
