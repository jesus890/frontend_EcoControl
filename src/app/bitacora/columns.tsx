import type { ColumnDef } from "@tanstack/react-table"
import type { ListBitacora } from "@/interfaces/interfaces"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<ListBitacora>[] = [
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

  //cantidad
  {
    accessorKey: "cantidad",
    header: "Cantidad",
  },

  //tipo envase
  {
    accessorFn: (row) => row.tipo_envase?.descripcion,
    id: "tipo_envase",
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

  //cretib (c)
  {
    accessorKey: "cretib_c",
    header: "C",
  },

  //cretib (r)
  {
    accessorKey: "cretib_r",
    header: "R",
  },

  //cretib (e)
  {
    accessorKey: "cretib_e",
    header: "E",
  },

  //cretib (t)
  {
    accessorKey: "cretib_t",
    header: "T",
  },

  //cretib (i)
  {
    accessorKey: "cretib_i",
    header: "I",
  },

  //cretib (b)
  {
    accessorKey: "cretib_b",
    header: "B",
  },

  //cretib (m)
  {
    accessorKey: "cretib_m",
    header: "M",
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

  //fase de manejo siguiente a la salida del almacén
  {
    accessorKey: "fase_siguiente",
    header: "FASE DE MANEJO SIGUIENTE A LA SALIDA DEL ALMACÉN",
  },

  //manifiesto
  {
    accessorKey: "numero_manifiesto",
    header: "NÚMERO DE MANIFIESTO",
  },




  
]
