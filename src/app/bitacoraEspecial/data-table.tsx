"use client"

import { useState } from "react"
import type { ListBitacoraEspecial } from "@/interfaces/interfaces"
import { camposBitacoraEspecial } from "./columns"

import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  FilterFn,
} from "@tanstack/react-table"

//icons
import { ImageDown } from "lucide-react"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel, //paginacion
  getSortedRowModel, //ordenamiento
  getFilteredRowModel, //buscador
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

//xlsx
import * as XLSX from "xlsx"

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]

// }

interface DataTableProps<TData extends ListBitacoraEspecial, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  // abrirVistaPrevia: (row: TData) => void
  // editarResiduo: (row: TData) => void
}

const exportarExcel = (data: ListBitacoraEspecial[]) => {
  const dataExportar = data.map((item) =>
    Object.fromEntries(
      camposBitacoraEspecial.map((campo) => [campo.titulo, campo.valor(item)])
    )
  )
  const worksheet = XLSX.utils.json_to_sheet(dataExportar, {
    header: camposBitacoraEspecial.map((campo) => campo.titulo),
  })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Manejo Especial")
  XLSX.writeFile(workbook, `bitacoraEspecial${Date.now()}.xlsx`)
}

export function DataTable<TData extends ListBitacoraEspecial, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]) //ordenamiento
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) //buscador
  const [globalFilter, setGlobalFilter] = useState("")

  const globalFilterFn: FilterFn<TData> = (row, _, value) => {
    const search = String(value).toLowerCase()
    return camposBitacoraEspecial.some((campo) =>
      String(campo.valor(row.original) ?? "")
        .toLowerCase()
        .includes(search)
    )
  }

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
      globalFilter,
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
          className="ml-4 max-w-sm"
        />
        <Button
          onClick={() => exportarExcel(data)}
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
                <TableHead key={header.id}>
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          className="bg-azulito font-bold text-white hover:bg-[#5D86A6] hover:text-white focus:bg-[#5D86A6] focus:outline-none"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>

        <Button
          variant="outline"
          className="bg-azulito font-bold text-white hover:bg-[#5D86A6] hover:text-white focus:bg-[#5D86A6] focus:outline-none"
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
