import type { ColumnDef } from "@tanstack/react-table"
import type {
  ListEspecialManifiestos
} from "@/interfaces/interfaces";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<ListEspecialManifiestos>[] = [

  //numero manifiesto
  {
    accessorKey: "numero_manifiesto",
    header: "Número Manifiesto",
  },

  //nombre_residuos
  {
    accessorKey: "nombre_residuos",
    header: "Residuos",
  },

  //transportista
  {
    accessorKey: "transportista",
    header: "Transportista",
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
        <Button
          disabled={residuo.transportista!="DESTINO FINAL"}
          variant="outline"
          className="bg-white font-bold text-azulito cursor-pointer p-4 h-12"
          size="sm"
          onClick={() => {
            table.options.meta?.abrirVistaPrevia(residuo)
          }}
        >
          <div>
            <FileText className="text-azulito mx-auto mt-1"/>
            <span className="mt-1">Generar</span>
          </div>
        </Button>
      )
    },
  },
]
