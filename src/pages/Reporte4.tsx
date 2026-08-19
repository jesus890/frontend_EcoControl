//Tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

//card
import { Card, CardContent } from "@/components/ui/card";

//listado
import ListadoRPManifiestos from "@/app/residuosRPManifiestos/page";
import ListadoEspecialManifiestos from "@/app/especialManifiestos/page";


export function Reporte4() {
  return (
    <div className="p-5">
      <Card className="mt-2 h-full w-full shadow-md">
        <CardContent>
         
          <Tabs defaultValue="listado1" className="h-[76vh] w-full">
            <TabsList className="w-max min-w-full flex-nowrap">
              <TabsTrigger value="listado1" className="w-full p-3">
                <span> Residuos Peligrosos </span>
              </TabsTrigger>

              <TabsTrigger value="listado2" className="w-full p-3">
                <span> Manejo Especial </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="listado1">
              <ListadoRPManifiestos />
            </TabsContent>

            <TabsContent value="listado2">
              <ListadoEspecialManifiestos />
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reporte4
