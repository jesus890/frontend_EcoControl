import type { ColumnDef } from "@tanstack/react-table";
import type { ResiduoListadoEstadistica } from "@/interfaces/interfaces";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<ResiduoListadoEstadistica>[] = [
  //uuid  
  {
    accessorKey: "uuid",
    header: "Código",
  },
  
  //nombre residuo
  {
    accessorFn: (row) => row.residuo,
    id: "residuo",
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
    accessorFn: (row) => row.generador,
    id: "generador",
    header: "Generador",
  },

  //area generacion
  {
    accessorFn: (row) => row.area,
    id: "area",
    header: "Área",
  },


  //cantidad
  {
    accessorKey: "cantidad",
    header: "Cantidad",
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

]
