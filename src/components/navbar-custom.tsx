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
      case '/':
        rutename = "Dashboard";
      break;
      
      case "/residuos-peligrosos":
        rutename = "Residuos Peligrosos"
      break;

      case "/manejo-especial":
        rutename = "Residuos Sólidos Urbanos";
      break;

      case "/trazabilidad":
        rutename = "Búsqueda de Trazabilidad";
      break;
    }

    setPathName(rutename);
 }



  return (
    <>
    <div className="mb-6 h-20 w-full bg-white shadow-md">
        <br />
        <p className="ml-8 text-[20px] font-bold text-azulito"> {pathName} </p>
      </div>
    </>
  )
}
