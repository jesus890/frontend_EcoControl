import type { ColumnDef } from "@tanstack/react-table"
import type { ListResiduoPeligroso } from "@/interfaces/interfaces"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const statusConfig:any = {
  RP: "bg-[#611232] text-white font-bold border-none shadow-md",
  RSU: "bg-[#E57825] text-white font-bold border-none shadow-md",
  RME: "bg-[#F6A003] text-white font-bold border-none shadow-md",
}

export const columns: ColumnDef<ListResiduoPeligroso>[] = [
  //uuid  
  {
    accessorKey: "uuid",
    header: "Código",
  },
  //nombre residuo
  {
    accessorFn: (row) => row.tipo_residuo?.descripcion,
    id: "tipo_residuo",
    //columna con ordenamiento
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre Residuo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  //nombre generador
  {
    accessorFn: (row) => row.tipo_generador?.descripcion,
    id: "tipo_generador",
    header: "Generador",
  },
  //area generacion
  {
    accessorFn: (row) => row.area_generacion?.descripcion,
    id: "area_generacion",
    header: "Área",
  },
  //cantidad
  {
    accessorKey: "cantidad",
    header: "Cantidad",
  },
  //tipo (RP, RSU o RME)
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string

      return (
        <Badge
          variant="outline"
          className={statusConfig[tipo] || ""}
        >
          {tipo}
        </Badge>
      )
    },
  },
  //fecha entrada
  {
    //define que valor usa la tabla internamente
    accessorKey: "fecha_entrada", 

    //define que se muestra visualmente
    cell: ({ row }) => {
      return row.original.ffecha_entrada
    },

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha Entrada
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },

    //define como se ordena
    sortingFn: (rowA, rowB, columnId) => {
      const fechaA = new Date(rowA.getValue<string>(columnId)).getTime()

      const fechaB = new Date(rowB.getValue<string>(columnId)).getTime()

      return fechaA - fechaB
    },
  },
]
