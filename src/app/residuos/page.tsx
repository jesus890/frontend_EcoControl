import { useState, useEffect } from "react"
import { columns } from "./columns";
import type { ListResiduoPeligroso } from "@/interfaces/interfaces";
import { DataTable } from "./data-table";
import { listadoResiduos } from "@/api/service";



export default function DemoPage() {
  
  const [data, setData] = useState<ListResiduoPeligroso[]>([]);

  useEffect(() => {
    cargarListado();
  }, [])

  const cargarListado = async() => {
    const result = await listadoResiduos();
    if(result)
    {
        setData(result.data);
    }
  }

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}