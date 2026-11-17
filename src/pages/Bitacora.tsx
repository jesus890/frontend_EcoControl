import { NavBarCustom } from "@/components/navbar-custom"
import ListadoBitacora from "@/app/bitacora/page"
import ListadoBitacoraEspecial from "@/app/bitacoraEspecial/page"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Bitacora() {
  return (
    <>
      <NavBarCustom />
      <div className="mx-auto w-[98%]">
        <Tabs defaultValue="peligrosos">
          <TabsList className="max-w-full">
            <TabsTrigger value="peligrosos" className="w-auto px-4">
              Residuos Peligros
            </TabsTrigger>
            <TabsTrigger value="especial" className="w-auto px-4">
              ManejoEspecial
            </TabsTrigger>
          </TabsList>
          <TabsContent value="peligrosos" keepMounted>
            <ListadoBitacora />
          </TabsContent>
          <TabsContent value="especial" keepMounted>
            <ListadoBitacoraEspecial />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default Bitacora
