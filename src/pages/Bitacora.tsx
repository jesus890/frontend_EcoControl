import { NavBarCustom } from "@/components/navbar-custom";
import ListadoBitacora from "@/app/bitacora/page";

export function Bitacora() {

  
  return (
    <>
      <NavBarCustom />

      <div className="w-[98%] mx-auto">
        <ListadoBitacora />
      </div>
    </>
  )
}

export default Bitacora
