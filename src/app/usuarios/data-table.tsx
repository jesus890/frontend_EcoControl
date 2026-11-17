import { useState } from "react";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable, type ColumnDef, type ColumnFiltersState, type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Usuario } from "./api";

export function UsuariosTable({ data, columns }: { data: Usuario[]; columns: ColumnDef<Usuario>[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const status = String(columnFilters.find(({ id }) => id === "status")?.value ?? "");
  const table = useReactTable({
    data, columns, getRowId: (user) => String(user.id),
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getColumnCanGlobalFilter: (column) => ["nombre", "email"].includes(column.id),
  });

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex flex-wrap gap-3 p-4">
        <Input className="max-w-sm" aria-label="Buscar usuarios" placeholder="Buscar por nombre o correo"
          value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} />
        <select className="rounded-md border bg-background px-3 text-sm" aria-label="Filtrar por estado"
          value={status} onChange={(event) => table.getColumn("status")?.setFilterValue(event.target.value || undefined)}>
          <option value="">Todos los estados</option>
          <option value="1">Activo</option>
          <option value="0">Suspendido</option>
        </select>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id} aria-sort={header.column.getIsSorted() === "asc" ? "ascending" :
                  header.column.getIsSorted() === "desc" ? "descending" : undefined}>
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <Button variant="ghost" size="sm" onClick={header.column.getToggleSortingHandler()}>
                      {flexRender(header.column.columnDef.header, header.getContext())}<ArrowUpDown />
                    </Button>
                  ) : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          )) : <TableRow><TableCell colSpan={columns.length} className="py-8 text-center">No se encontraron usuarios.</TableCell></TableRow>}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
        <span>{table.getFilteredRowModel().rows.length} usuarios</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>Anterior</Button>
          <Button variant="outline" size="sm" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Siguiente</Button>
        </div>
      </div>
    </div>
  );
}
