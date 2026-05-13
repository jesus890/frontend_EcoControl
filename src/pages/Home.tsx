
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { NavBarCustom } from "@/components/navbar-custom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Home() {

  return (
    <>
      <NavBarCustom />

      <div className="mx-auto mb-8 grid grid-cols-1 gap-2 md:grid-cols-4 p-4">
        <Card tabIndex={0} className="border-l-4 border-verdecito transition-transform duration-200 hover:-translate-y-2 outline-none shadow-md">
          <CardHeader>
            <CardTitle className="text-grisito text-[12px] font-bold"> RESIDUOS REGISTRADOS HOY </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[28px] font-bold">24</p>
          </CardContent>
        </Card>

        <Card tabIndex={0} className="border-l-4 border-naranjita transition-transform duration-200 hover:-translate-y-2 outline-none shadow-md">
          <CardHeader>
            <CardTitle className="text-grisito text-[12px] font-bold"> PENDIENTES DE SALIDA </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[28px] font-bold">8</p>
          </CardContent>
        </Card>

        <Card tabIndex={0} className="border-l-4 border-rojito transition-transform duration-200 hover:-translate-y-2 outline-none shadow-md">
          <CardHeader>
            <CardTitle className="text-grisito text-[12px] font-bold"> ALERTAS ACTIVAS </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[28px] font-bold">2</p>
          </CardContent>
        </Card>

        <Card tabIndex={0} className="border-l-4 border-moradito transition-transform duration-200 hover:-translate-y-2 outline-none shadow-md">
          <CardHeader>
            <CardTitle className="text-grisito text-[12px] font-bold"> CUMPLIMIENTO </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[28px] font-bold">98%</p>
          </CardContent>
        </Card>
      </div>

      <div className="w-[98%] mx-auto rounded-md border - shadow-md overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-[#f2f3f4] ">
            <TableRow>
              <TableHead className="w-full text-moradito font-bold" colSpan={9}>
                Últimos Registros de Residuos
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="w-[10%] wrap-break-word whitespace-normal">FOLIO</TableHead>
              <TableHead className="w-[20%] wrap-break-word whitespace-normal">NOMBRE DEL RESIDUO</TableHead>
              <TableHead className="w-[10%] wrap-break-word whitespace-normal">GENERADOR</TableHead>
              <TableHead className="w-[10%] wrap-break-word whitespace-normal">ÁREA</TableHead>
              <TableHead className="w-[10%] wrap-break-word whitespace-normal">CANTIDAD (KG)</TableHead>
              <TableHead className="w-[10%] wrap-break-word whitespace-normal">ESTADO</TableHead>
              <TableHead className="w-[10%] wrap-break-word whitespace-normal">FECHA ENTRADA</TableHead>
              <TableHead className="w-[10%] wrap-break-word whitespace-normal">FECHA SALIDA</TableHead>
              <TableHead className="w-[10%] wrap-break-word whitespace-normal">ACCIONES</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white">
            <TableRow>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">RES-2026-0001</TableCell>
              <TableCell className="font-medium w-[20%] wrap-break-word whitespace-normal">Aceite Quemado</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">Operaciones Mina</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">Zona A</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">245.5</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">Activo</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">2026-03-1</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">-</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">----</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">RES-2026-0001</TableCell>
              <TableCell className="font-medium w-[20%] wrap-break-word whitespace-normal">Aceite Quemado</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">Operaciones Mina</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">Zona A</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">245.5</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">Activo</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">2026-03-1</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">-</TableCell>
              <TableCell className="font-medium w-[10%] wrap-break-word whitespace-normal">----</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default Home
