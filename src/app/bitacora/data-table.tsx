"use client"

import { useState } from "react";

import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  FilterFn,
} from "@tanstack/react-table";

//icons
import { ImageDown } from "lucide-react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel, //paginacion
  getSortedRowModel, //ordenamiento
  getFilteredRowModel, //buscador
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

//xlsx
import * as XLSX from "xlsx"

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]

// }

interface DataTableProps<
  TData extends Record<string, any>,
  TValue
> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  // abrirVistaPrevia: (row: TData) => void
  // editarResiduo: (row: TData) => void
}

const cretibColumnIds = new Set([
  "cretib_c",
  "cretib_r",
  "cretib_e",
  "cretib_t",
  "cretib_i",
  "cretib_b",
  "cretib_m",
])

const exportarExcel = <T extends Record<string, any>>(data: T[]) => {

  const dataExportar = data.map((item) => ({
    "Código": item.uuid ?? "",
    "Nombre Residuo": item.tipo_residuo?.descripcion ?? "",
    "Cantidad": item.cantidad ?? "",
    "Tipo Envase": item.tipo_envase?.descripcion ?? "",
    "C": item.cretib_c ?? "",
    "R": item.cretib_r ?? "",
    "E": item.cretib_e ?? "",
    "T": item.cretib_t ?? "",
    "I": item.cretib_i ?? "",
    "B": item.cretib_b ?? "",
    "M": item.cretib_m ?? "",
    "Generador": item.tipo_generador?.descripcion ?? "",
    "Area": item.area_generacion?.descripcion ?? "",

    "Fecha Entrada": item.fecha_entrada ? new Date(item.fecha_entrada).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) : "",

    "Fecha Salida": item.fecha_salida ? new Date(item.fecha_salida).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) : "",

    "FASE DE MANEJO SIGUIENTE A LA SALIDA DEL ALMACÉN" : item.fase_manejo_siguiente ?? "",
    "NÚMERO DE MANIFIESTO" : item.numero_manifiesto ?? "",
    "COMENTARIOS" : item.comentarios ?? "",

  }));

  const timestamp = Date.now();

  const worksheet = XLSX.utils.json_to_sheet(dataExportar);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Datos"
  );

  XLSX.writeFile(
    workbook,
    `bitacora${timestamp}.xlsx`
  );
};


export function DataTable<
  TData extends Record<string, any>,
  TValue
>({
  columns,
  data
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([]) //ordenamiento
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) //buscador
  const [globalFilter, setGlobalFilter] = useState("");

  const globalFilterFn: FilterFn<any> = (row, _, value) => {
    const search = value.toLowerCase();

    return [
      row.getValue("uuid"),
      row.getValue("tipo_residuo"),
      row.getValue("numero_folio"),
    ]
      .some(
        (val) =>
          String(val ?? "")
            .toLowerCase()
            .includes(search)
      );
  };

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),

    onSortingChange: setSorting,

    getSortedRowModel: getSortedRowModel(),

    state: {
      sorting,
      columnFilters,
      globalFilter
    },

    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,

    onColumnFiltersChange: setColumnFilters,

    getFilteredRowModel: getFilteredRowModel(),

  })


  return (
    <div className="overflow-hidden rounded-md border">

      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm ml-4"
        />
        <Button
          onClick={()=> exportarExcel(data)}
          className="ml-4 cursor-pointer p-4 hover:bg-[#5D86A6] focus:bg-[#5D86A6] focus:outline-none"
        >
          <ImageDown />
              <span>Exportar</span>
            </Button>
      </div>

      <Table>

        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (

            <TableRow key={headerGroup.id}>

              {headerGroup.headers.map((header) => (

                <TableHead
                  key={header.id}
                  className={cretibColumnIds.has(header.column.id) ? "border" : undefined}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>

              ))}

            </TableRow>

          ))}
        </TableHeader>

        <TableBody>

          {table.getRowModel().rows?.length ? (

            table.getRowModel().rows.map((row) => (

              <TableRow key={row.id} className="bg-white">

                {row.getVisibleCells().map((cell) => (

                  <TableCell
                    key={cell.id}
                    className={cretibColumnIds.has(cell.column.id) ? "border" : undefined}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>

                ))}

              </TableRow>

            ))

          ) : (

            <TableRow>

              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No hay resultados.
              </TableCell>

            </TableRow>

          )}

        </TableBody>

      </Table>

      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          className="bg-azulito hover:bg-[#5D86A6] hover:text-white focus:bg-[#5D86A6] focus:outline-none text-white font-bold"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>

        <Button
          variant="outline"
          className="bg-azulito hover:bg-[#5D86A6] hover:text-white focus:bg-[#5D86A6] focus:outline-none text-white font-bold"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>

    </div>
  )
}
