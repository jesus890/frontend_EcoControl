import { useEffect, useState } from "react"
import { listadoBitacoraEspecial } from "@/api/service"
import type { ListBitacoraEspecial } from "@/interfaces/interfaces"
import { Button } from "@/components/ui/button"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export default function ListadoBitacoraEspecial() {
  const [data, setData] = useState<ListBitacoraEspecial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let activo = true
    const cargarListado = async () => {
      setLoading(true)
      setError("")
      try {
        const result = await listadoBitacoraEspecial()
        if (!result.result) throw new Error(result.message)
        if (activo)
          setData(
            [...result.data].sort((a, b) =>
              b.created_at.localeCompare(a.created_at)
            )
          )
      } catch (ex) {
        if (activo)
          setError(
            ex instanceof Error
              ? ex.message
              : "No se pudo cargar la bitácora de manejo especial."
          )
      } finally {
        if (activo) setLoading(false)
      }
    }
    void cargarListado()
    return () => {
      activo = false
    }
  }, [intento])

  if (loading)
    return (
      <p role="status" className="p-4">
        Cargando bitácora de manejo especial...
      </p>
    )
  if (error)
    return (
      <div className="p-4">
        <p role="alert" className="text-rojito">
          {error}
        </p>
        <Button
          className="mt-2"
          onClick={() => setIntento((actual) => actual + 1)}
        >
          Reintentar
        </Button>
      </div>
    )
  return <DataTable columns={columns} data={data} />
}
