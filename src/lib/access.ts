export const SUPERUSUARIO = 1;

export type ModuloRestringido = "usuarios" | "trazabilidad" | "reportes" | "bitacora";

/*optiene el acceso de rol 
  1 = Super Administrador
  2 = Administrador
  3 = Almacen 
      *No podrá ver Trazabilidad
      *No podrá ver Reportes
      *No podrá ver Bitácora
      *No podrá ver Usuarios.
*/

export function puedeAcceder(modulo: ModuloRestringido, rol: unknown): boolean {
  if (modulo === "usuarios") return Number(rol) === SUPERUSUARIO;


  return Number(rol) === SUPERUSUARIO || Number(rol) === 2;
}
