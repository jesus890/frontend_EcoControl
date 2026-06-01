//card
import { Card, CardContent } from "@/components/ui/card"

//listado
import ListadoRPManifiestos from "@/app/residuosRPManifiestos/page";


export function Reporte4() {
  return (
    <div className="p-5">
      
      <Card className="mt-2 h-full w-full shadow-md">
        <CardContent>
          {/* Listado */}
          <ListadoRPManifiestos />
        </CardContent>
      </Card>
    </div>
  )
}

export default Reporte4