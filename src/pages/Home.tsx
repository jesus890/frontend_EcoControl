
import { useState, useEffect } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { NavBarCustom } from "@/components/navbar-custom";
import ListadoResiduos from "@/app/residuos/page";
import type {cantidadResiduosPendientes} from "@/interfaces/interfaces";
import {obtenerTotalResiduos} from "@/api/service";

export function Home() {

  const [estadisticas, setEstadisticas] = useState<cantidadResiduosPendientes>({
    totalResiduos: 0,
    totalPendiente: 0,
    totalAntiguos: 0
    });


  useEffect(() => {
    cargarEstadisticas();
  },[])


  const cargarEstadisticas = async() => {
    const result = await obtenerTotalResiduos();
    if(result)
    {
      setEstadisticas(result.data);
    }
  }

  return (
    <>
      <NavBarCustom />

      <div className="mx-auto mb-8 grid grid-cols-1 gap-5 md:grid-cols-3 p-4 mx-auto">
        <Card tabIndex={0} className="border-l-4 border-verdecito transition-transform duration-200 hover:-translate-y-2 outline-none shadow-md w-[80%]">
          <CardHeader>
            <CardTitle className="text-grisito text-[12px] font-bold"> RESIDUOS REGISTRADOS HOY </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[28px] font-bold">{estadisticas.totalResiduos}</p>
          </CardContent>
        </Card>

        <Card tabIndex={0} className="border-l-4 border-naranjita transition-transform duration-200 hover:-translate-y-2 outline-none shadow-md w-[80%]">
          <CardHeader>
            <CardTitle className="text-grisito text-[12px] font-bold"> PENDIENTES DE SALIDA </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[28px] font-bold">{estadisticas.totalPendiente}</p>
          </CardContent>
        </Card>

        <Card tabIndex={0} className="border-l-4 border-rojito transition-transform duration-200 hover:-translate-y-2 outline-none shadow-md w-[80%]">
          <CardHeader>
            <CardTitle className="text-grisito text-[12px] font-bold"> ALERTAS ACTIVAS </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[28px] font-bold">{estadisticas.totalAntiguos}</p>
          </CardContent>
        </Card>
      </div>

      <div className="w-[98%] mx-auto">
        <ListadoResiduos />
      </div>
    </>
  )
}

export default Home
