import { useState, useEffect, useCallback, useMemo } from "react";
import { createColumns } from "./columns";
import { DataTable } from "./data-table"
import { listadoBitacora } from "@/api/service"

import type { ListBitacora } from "@/interfaces/interfaces"
import { actualizaComentariosReporte } from "@/api/service";

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

  const handleComentariosChange =  useCallback (async (uuid: string, comentarios: string) => {
    setData((currentData) =>
      currentData.map((bitacora) =>
        bitacora.uuid === uuid ? { ...bitacora, comentarios } : bitacora
      )
    )

    if(comentarios!= "")
    {
      try
      {
        const dataToSave = {
          "uuid":  uuid,
          "comentarios": comentarios
        }

        await actualizaComentariosReporte(dataToSave)
      }
      catch(ex)
      {
        console.log({ex})
      }
    }

    // Aquí se puede invocar posteriormente el endpoint con { uuid, comentarios }.
  }, [])

  const columns = useMemo(
    () => createColumns(handleComentariosChange),
    [handleComentariosChange]
  )

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
      />
    </div>
  )
}
