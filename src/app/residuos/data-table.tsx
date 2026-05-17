"use client"

import { useState } from "react"

import type { ColumnDef } from "@tanstack/react-table";

import type { SortingState } from "@tanstack/react-table"; //ordenamiento
import type { ColumnFiltersState } from "@tanstack/react-table"; //buscador

import { Input } from "@/components/ui/input"


import {

  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel, //paginacion
  getSortedRowModel,  //ordenamiento
  getFilteredRowModel //buscador
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([]); //ordenamiento
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);  //buscador


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //paginacion
    //ordenamiento
    onSortingChange: setSorting,  
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters //para buscar
    },
    //buscador
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

  })

  return (
    <div className="overflow-hidden rounded-md border">
      
      {/* Buscador */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre residuo..."
          value={(table.getColumn("tipo_residuo")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("tipo_residuo")?.setFilterValue(event.target.value)
          }
          className="max-w-sm ml-4 placeholder:text-placeholder bg-gray-50"
        />
      </div>

      <Table className="shadow-md">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="bg-white! h-[45px]"
              >
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
      
      {/* Paginacion */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
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
