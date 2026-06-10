//Tabss
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { NavBarCustom } from "@/components/navbar-custom"
import Reporte1 from "./Reporte1"
import Reporte2 from "./Reporte2"
import Reporte3 from "./Reporte3"
import Reporte4 from "./Reporte4"
import { Skull } from "lucide-react"
import { Package } from "lucide-react"
import { ScrollText } from "lucide-react"

export function Reportes() {
  return (
    <>
      <NavBarCustom />
      <div className="p-5 overflow-x-auto">
        <Tabs defaultValue="reporte1" className="h-[76vh] w-full">
          <TabsList className="w-max min-w-full flex-nowrap">
            <TabsTrigger value="reporte1" className="w-full p-3">
              <Skull />
              <span> Reporte Residuos Peligrosos </span>
            </TabsTrigger>

            <TabsTrigger value="reporte2" className="w-full p-3">
              <Package />
              <span> Reporte Sólido Especial (RSU) </span>
            </TabsTrigger>

            <TabsTrigger value="reporte3" className="w-full p-3">
              <Package />
              <span> Reporte Residuo Especial (RME) </span>
            </TabsTrigger>

            <TabsTrigger value="reporte4" className="w-full p-3">
              <ScrollText />
              <span> Manifiestos </span>
            </TabsTrigger>

          </TabsList>

          <TabsContent value="reporte1">
            <Reporte1 />
          </TabsContent>

          <TabsContent value="reporte2">
            <Reporte2 />
          </TabsContent>

          <TabsContent value="reporte3">
            <Reporte3 />
          </TabsContent>

          <TabsContent value="reporte4">
            <Reporte4 />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default Reportes
