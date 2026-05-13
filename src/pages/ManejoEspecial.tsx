//Tabss
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { NavBarCustom } from "@/components/navbar-custom";
import SolidoUrbano1 from "./SolidoUrbano1";
import SolidoUrbano2 from "./SolidoUrbano2";


export function ManejoEspecial() {
  return (
    <>
      <NavBarCustom />
      <div className="p-5">
        <Tabs defaultValue="RSU" className="w-full h-[76vh]">
          <TabsList>
            <TabsTrigger value="RSU"> RSU </TabsTrigger>
            <TabsTrigger value="RME"> RME </TabsTrigger>
          </TabsList>
          <TabsContent value="RSU">
              <SolidoUrbano1 />
          </TabsContent>
          <TabsContent value="RME">
              <SolidoUrbano2 />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default ManejoEspecial
