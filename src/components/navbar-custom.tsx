import { useState, useEffect } from "react";
import { useLocation } from "react-router";


export function NavBarCustom() {
 const location = useLocation();
 const [pathName, setPathName]= useState<string>();


 useEffect(()=> {
    obtenerTitulo()
 }, [location.pathname])


 const obtenerTitulo = () => {
    let rutename = "";

    switch(location.pathname)
    {
      case '/mml/environment/':
        rutename = "Dashboard";
      break;
      
      case "/mml/environment/residuos-peligrosos":
        rutename = "Residuos Peligrosos"
      break;

      case "/mml/environment/manejo-especial":
        rutename = "Residuos Sólidos Urbanos";
      break;

      case "/mml/environment/trazabilidad":
        rutename = "Búsqueda de Trazabilidad";
      break;

      case "/mml/environment/reportes":
        rutename = "Reportes"
      break;

    }

    setPathName(rutename);
 }

  return (
    <>
      <div className="mb-6  w-full bg-white shadow-md">
        <p className="ml-8 h-[40px] text-[20px] font-bold text-azulito"> {pathName} </p>
      </div>
    </>
  )
}
