import { columns } from "./columns";
import { DataTable } from "./data-table";
import type { ResiduoListadoEstadistica } from "@/interfaces/interfaces"


type Props = {
  data: ResiduoListadoEstadistica[]
}

export default function ListadoResiduoPeligroso({data}: Props)
{
 
  return (
    <div className="mt-8">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
