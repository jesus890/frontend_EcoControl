import { useState, useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table"
import { listadoBitacora } from "@/api/service"

import type { ListBitacora } from "@/interfaces/interfaces"

export default function ListadoBitacora() {
  
  const [data, setData] = useState<ListBitacora[]>([])

  useEffect(() => {
    cargarListado()
  }, [])

  const cargarListado = async () => {
    const result = await listadoBitacora()
    if (result) {
      setData(result.data)
    }
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
      />
    </div>
  )
}
