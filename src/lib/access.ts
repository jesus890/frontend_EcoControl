export const SUPERUSUARIO = 1;

export type ModuloRestringido = "usuarios" | "trazabilidad" | "reportes" | "bitacora";

export function puedeAcceder(modulo: ModuloRestringido, rol: unknown): boolean {
  if (modulo === "usuarios") return Number(rol) === SUPERUSUARIO;
  return Number(rol) === SUPERUSUARIO || Number(rol) === 2;
}
