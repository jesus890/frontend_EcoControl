import type { ColumnDef } from "@tanstack/react-table"
import type { ListBitacoraEspecial } from "@/interfaces/interfaces"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export const formatearFecha = (fecha: string | null | undefined) => {
  if (!fecha) return ""
  const iso = fecha.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return iso ? `${iso[3]}/${iso[2]}/${iso[1]}` : fecha
}

// Las mismas columnas y valores se utilizan en la tabla y en la exportación.
export const camposBitacoraEspecial = [
  {
    id: "fecha_entrada",
    titulo: "Fecha",
    valor: (row: ListBitacoraEspecial) =>
      formatearFecha(row.fecha_entrada ?? row.ffecha_entrada),
  },
  {
    id: "numero_folio",
    titulo: "Folio",
    valor: (row: ListBitacoraEspecial) => row.uuid ?? "",
  },
  {
    id: "area_generacion",
    titulo: "Área",
    valor: (row: ListBitacoraEspecial) =>
      row.area_generacion?.descripcion ?? "",
  },
  {
    id: "tipo_generador",
    titulo: "Generador",
    valor: (row: ListBitacoraEspecial) => row.tipo_generador?.descripcion ?? "",
  },
  {
    id: "tipo_residuo",
    titulo: "Tipo de Residuo",
    valor: (row: ListBitacoraEspecial) => row.tipo_residuo?.descripcion ?? "",
  },
  {
    id: "cantidad",
    titulo: "Cantidad (kg)",
    valor: (row: ListBitacoraEspecial) => row.cantidad,
  },
  {
    id: "disposicion",
    titulo: "Disposición/Área de Ingreso",
    valor: (row: ListBitacoraEspecial) =>
      row.disposicion ??
      row.area_ingreso ??
      row.destino_final?.descripcion ??
      "",
  },
  {
    id: "fecha_salida",
    titulo: "Fecha de Salida",
    valor: (row: ListBitacoraEspecial) =>
      formatearFecha(row.fecha_salida ?? row.ffecha_salida),
  },
  {
    id: "transportista",
    titulo: "Prestador de Servicio",
    valor: (row: ListBitacoraEspecial) => row.transportista?.descripcion ?? "",
  },
  {
    id: "tipo_tratamiento",
    titulo: "Tratamiento",
    valor: (row: ListBitacoraEspecial) =>
      row.tipo_tratamiento?.descripcion ?? "",
  },
  {
    id: "tipo_desc_movimiento",
    titulo: "Tipo Movimiento",
    valor: (row: ListBitacoraEspecial) =>
      row.tipo_desc_movimiento ??
      (String(row.tipo_movimiento) === "1"
        ? "Entrada"
        : String(row.tipo_movimiento) === "2"
          ? "Salida"
          : ""),
  },
  {
    id: "comentarios",
    titulo: "Comentarios",
    valor: (row: ListBitacoraEspecial) => row.comentarios ?? "",
  },
]

export const columns: ColumnDef<ListBitacoraEspecial>[] =
  camposBitacoraEspecial.map((campo) => ({
    id: campo.id,
    accessorFn: campo.valor,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {campo.titulo}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    ...(campo.id === "fecha_entrada" || campo.id === "fecha_salida"
      ? {
          sortingFn: (rowA, rowB) => {
            const campoFecha = campo.id as "fecha_entrada" | "fecha_salida"
            return (rowA.original[campoFecha] ?? "").localeCompare(
              rowB.original[campoFecha] ?? ""
            )
          },
        }
      : {}),
    ...(campo.id === "comentarios"
      ? {
          cell: ({ row }) => (
            <div className="min-w-64 whitespace-normal">
              {row.original.comentarios ?? ""}
            </div>
          ),
        }
      : {}),
  }))
