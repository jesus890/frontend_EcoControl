import type { ColumnDef } from "@tanstack/react-table"
import type { ListResiduoPeligroso } from "@/interfaces/interfaces"
import { ArrowUpDown, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tag } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const statusConfig: any = {
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
  //folio
  {
    accessorFn: (row) => row.numero_folio,
    id: "numero_folio",
    header: "Número Folio",
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
        <Badge variant="outline" className={statusConfig[tipo] || ""}>
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

  //fecha salida
  {
    //define que valor usa la tabla internamente
    accessorKey: "fecha_salida",

    //define que se muestra visualmente
    cell: ({ row }) => {
      return row.original.ffecha_salida
    },

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha Salida
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

  //acciones
  {
    id: "acciones",
    header: "Acciones",

    cell: ({ row, table }) => {
      const residuo = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" className="bg-white font-bold text-azulito cursor-pointer p-4 h-12" size="sm" >...</Button>}
          />
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => table.options.meta?.abrirVistaPrevia(residuo)}>
              <span className="mt-1 mx-auto">Etiqueta</span>
              <Tag className="text-azulito mt-1"/>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => table.options.meta?.editarResiduo?.(residuo)}>
              <span className="mt-1 mx-auto">Editar</span>
              <Pencil className="text-azulito mt-1"/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
