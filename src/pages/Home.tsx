
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { NavBarCustom } from "@/components/navbar-custom";
import DemoPage from "@/app/residuos/page";

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


      <div className="w-[98%] mx-auto">
        <DemoPage />
      </div>


    </>
  )
}

export default Home
