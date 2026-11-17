import { isAxiosError } from "axios";
import { axiosAuth } from "@/lib/axios";

import { SUPERUSUARIO } from "@/lib/access";
export const roles = [
  { id: 2, nombre: "Administrador" },
  { id: 3, nombre: "Almacén" },
] as const;

export const nombreRol = (rol: number | string) =>
  Number(rol) === SUPERUSUARIO
    ? "Super Administrador"
    : roles.find(({ id }) => id === Number(rol))?.nombre ?? "Sin rol reconocido";

type DatosUsuario = {
  name: string;
  surname1: string;
  surname2: string;
  email: string;
  title: string;
  phone: string;
};

export type AltaUsuario = DatosUsuario & { rol: number; status: number };
export type Usuario = DatosUsuario & {
  id: string | number;
  fullname?: string;
  rol: number | string;
  status: number | string;
};

type Respuesta<T> = { result: boolean; message: string; data: T };

function comprobar<T>(response: Respuesta<T>): T {
  if (!response.result) throw new Error(response.message);
  return response.data;
}

export async function listarUsuarios(signal?: AbortSignal) {
  const { data } = await axiosAuth.get<Respuesta<Usuario[]>>("/usuarios", { signal });
  return comprobar(data);
}

export async function crearUsuario(usuario: AltaUsuario) {
  const { data } = await axiosAuth.post<Respuesta<Usuario[]>>("/usuarios/crearUsuario", usuario);
  comprobar(data);
}

async function actualizarUsuario(usuario: Usuario, rol: number, status: number) {
  const { id, name, surname1, surname2, email, title, phone } = usuario;
  if (![name, surname1, surname2, email, title, phone].every((value) => value?.trim())) {
    throw new Error("La API requiere nombre, ambos apellidos, correo, título y teléfono para actualizar esta cuenta. Completa sus datos antes de continuar.");
  }
  const { data } = await axiosAuth.post<Respuesta<Usuario>>(
    `/usuarios/update/${encodeURIComponent(id)}`,
    { name, surname1, surname2, email, title, phone, rol, status },
  );
  comprobar(data);
}

export const rolAsignable = (rol: number | string) =>
  roles.some(({ id }) => id === Number(rol));

export function cambiarRol(usuario: Usuario, rol: number) {
  if (!rolAsignable(usuario.rol) || !rolAsignable(rol)) {
    throw new Error("No se puede modificar este rol desde el módulo.");
  }
  return actualizarUsuario(usuario, rol, Number(usuario.status));
}

export function suspenderUsuario(usuario: Usuario) {
  if (!rolAsignable(usuario.rol)) {
    throw new Error("No se puede suspender esta cuenta desde el módulo.");
  }
  return actualizarUsuario(usuario, Number(usuario.rol), 0);
}

export function mensajeError(error: unknown) {
  if (isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
    const response = error.response;
    if (response?.status === 401 || response?.status === 403) return "Tu sesión no tiene permiso para realizar esta operación.";
    if (response?.status === 422) {
      return Object.values(response.data.errors ?? {}).flat().join(" ") ||
        response.data.message || "Revisa los datos del usuario.";
    }
    return "No se pudo completar la solicitud. Consulta el listado antes de reintentar.";
  }
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}
