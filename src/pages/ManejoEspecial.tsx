import { useEffect, useState } from "react";
import { setLlenarCatalogos } from "@/provider/Slice/CatalogoSlice";


//redux
import { useAppSelector, useAppDispatch } from "@/provider/app/hooks";

//react-router
import { useParams } from 'react-router'; 

import {
  listadoTipoResiduoRSU,
  listadoTipoGeneradorRSU_RME,
  listadoDestinoFinalRSU,
  listadoTipoResiduoRME,
  listadoTipoTratamientoRME,
  listadoTransportistasRME,
} from "../api/service"

//Tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { NavBarCustom } from "@/components/navbar-custom";

import SolidoUrbano1 from "./SolidoUrbano1";
import SolidoUrbano2 from "./SolidoUrbano2";


export function ManejoEspecial() {

  const { uuid } = useParams();

  const [tab, setTab] = useState("RSU");

  const dispatch = useAppDispatch();

  //catalogos
  const stateCatalogos = useAppSelector((state) => state.CatalogoSeleccionados);
  const generadores = stateCatalogos.tipogenerador_su;
  const residuos = stateCatalogos.tiporesiduo_rsu;
  const destinoFinal = stateCatalogos.destinofinal_rsu;
  

  useEffect(() => {
    cargarCatalogos();
    checarModulo();
  }, [])


  //carga los diferentes catalogos que no dependen de otro
  const cargarCatalogos = async () => {

    if(generadores.length == 0 || residuos.length == 0 || destinoFinal.length == 0    )
    {

      const [tiporesiduo_rsu, tipogenerador_su, destinofinal_rsu , transportistas_rme, tipotratamiento_rme , tiporesiduo_rme   ] = await Promise.all([
        listadoTipoResiduoRSU(),
        listadoTipoGeneradorRSU_RME(),
        listadoDestinoFinalRSU(),
        listadoTransportistasRME(),
        listadoTipoTratamientoRME(),
        listadoTipoResiduoRME()
      ])

      dispatch(setLlenarCatalogos({ catalogo: "tiporesiduo_rsu", value: tiporesiduo_rsu.data }));
      dispatch( setLlenarCatalogos({ catalogo: "tipogenerador_su", value: tipogenerador_su.data }));
      dispatch(setLlenarCatalogos({ catalogo: "destinofinal_rsu", value: destinofinal_rsu.data }));
      dispatch(setLlenarCatalogos({ catalogo: "transportistas_rme", value: transportistas_rme.data }));
      dispatch(setLlenarCatalogos({ catalogo: "tipotratamiento_rme", value: tipotratamiento_rme.data }));
      dispatch(setLlenarCatalogos({ catalogo: "tiporesiduo_rme", value: tiporesiduo_rme.data }));

    }

  }

  const checarModulo = () => {
    if(uuid?.includes("RSU"))
    {
      setTab("RSU")
    } 
    else if(uuid?.includes("RME"))
    {
      setTab("RME")
    }
  }


  return (
    <>
      <NavBarCustom />
      <div className="p-5">
        <Tabs value={tab} onValueChange={setTab} className="w-full h-[76vh]">
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
