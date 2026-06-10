"use client"

import { useState } from "react"

import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"

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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  abrirVistaPrevia: (
    row: TData
  ) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  abrirVistaPrevia,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([]) //ordenamiento
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) //buscador

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
    },

    onColumnFiltersChange: setColumnFilters,

    getFilteredRowModel: getFilteredRowModel(),

    meta: {
      abrirVistaPrevia,
    },
  })

  return (
    <div className="overflow-hidden rounded-md border">

      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar..."
          value={
            (table
              .getColumn("nombre_residuos")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("nombre_residuos")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm ml-4"
        />
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