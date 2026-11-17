import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormularioAlta, FormularioRol } from "@/app/usuarios/formularios";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UsuariosTable } from "@/app/usuarios/data-table";
import { cambiarRol, rolAsignable, crearUsuario, listarUsuarios, mensajeError, nombreRol, suspenderUsuario, type Usuario } from "@/app/usuarios/api";

const nombre = (usuario: Usuario) =>
  usuario.fullname || [usuario.name, usuario.surname1, usuario.surname2].filter(Boolean).join(" ");

type Modal = { tipo: "alta" } | { tipo: "rol" | "suspender"; usuario: Usuario };

export default function Usuarios() {
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modal, setModal] = useState<Modal | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState("");
  const [errorListado, setErrorListado] = useState("");
  const [cargando, setCargando] = useState(true);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    listarUsuarios(controller.signal)
      .then((data) => { if (!controller.signal.aborted) setUsuarios(data); })
      .catch((error: unknown) => { if (!controller.signal.aborted) setErrorListado(mensajeError(error)); })
      .finally(() => { if (!controller.signal.aborted) setCargando(false); });
    return () => controller.abort();
  }, [revision]);

  function recargar() {
    setErrorListado("");
    setCargando(true);
    setRevision((value) => value + 1);
  }

  function abrir(value: Modal) {
    setErrorModal("");
    setModal(value);
  }

  async function guardar(operacion: () => Promise<void>, mensaje: string) {
    if (guardando) return;
    setGuardando(true);
    setErrorModal("");
    try {
      await operacion();
      toast.success(mensaje);
      setModal(null);
      recargar();
    } catch (error) {
      setErrorModal(mensajeError(error));
    } finally {
      setGuardando(false);
    }
  }

  const columns: ColumnDef<Usuario>[] = [
    { id: "nombre", accessorFn: nombre, header: "Nombre" },
    { accessorKey: "email", header: "Correo electrónico" },
    { id: "rol", accessorFn: (usuario) => nombreRol(usuario.rol), header: "Rol" },
    {
      id: "status", accessorFn: (usuario) => String(usuario.status), header: "Estado", filterFn: "equalsString",
      cell: ({ row }) => {
        const activo = Number(row.original.status) === 1;
        return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${activo ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}>
          {activo ? "Activo" : "Suspendido"}
        </span>;
      },
    },
    {
      id: "acciones", header: "Acciones", cell: ({ row: { original: usuario } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" aria-label={`Acciones para ${nombre(usuario)}`} />}>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => abrir({ tipo: "rol", usuario })}>{rolAsignable(usuario.rol) ? "Cambiar rol" : "Consultar rol"}</DropdownMenuItem>
              {Number(usuario.status) === 1 && rolAsignable(usuario.rol) && (
                <DropdownMenuItem onClick={() => abrir({ tipo: "suspender", usuario })}>Suspender usuario</DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const rolSoloLectura = modal?.tipo === "rol" && !rolAsignable(modal.usuario.rol);

  const pieModal = (
    <>
      {errorModal && <p role="alert" className="text-destructive">{errorModal}</p>}
      <DialogFooter>
        <Button type="button" variant="outline" disabled={guardando} onClick={() => setModal(null)}>
          {rolSoloLectura ? "Cerrar" : "Cancelar"}
        </Button>
        {!rolSoloLectura && (
          <Button type="submit" variant={modal?.tipo === "suspender" ? "destructive" : "default"} disabled={guardando}>
            {guardando ? "Guardando…" : modal?.tipo === "alta" ? "Crear usuario" : modal?.tipo === "rol" ? "Guardar cambios" : "Suspender usuario"}
          </Button>
        )}
      </DialogFooter>
    </>
  );

  return (
    <section className="space-y-5 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Administración de usuarios</h1>
        <Button className="bg-green-700 text-white hover:bg-green-800" onClick={() => abrir({ tipo: "alta" })}><Plus /> Nuevo usuario</Button>
      </div>
      {cargando ? <p role="status">Cargando usuarios…</p> : errorListado ? (
        <div><p role="alert">{errorListado}</p><Button variant="outline" onClick={recargar}>Reintentar</Button></div>
      ) : <UsuariosTable data={usuarios} columns={columns} />}

      <Dialog open={modal !== null} onOpenChange={(open) => { if (!open && !guardando) setModal(null); }}>
        {modal && <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg" showCloseButton={!guardando}>
          <DialogHeader>
            <DialogTitle>{modal.tipo === "alta" ? "Nuevo usuario" : modal.tipo === "rol" ? (rolSoloLectura ? "Rol asignado" : "Cambiar rol") : "Suspender usuario"}</DialogTitle>
            <DialogDescription>{modal.tipo === "alta"
              ? "Captura los datos y selecciona un rol. La contraseña se genera en el servidor."
              : nombre(modal.usuario)}</DialogDescription>
          </DialogHeader>
          {modal.tipo === "alta" ? (
            <FormularioAlta guardando={guardando} onSubmit={(datos) => guardar(() => crearUsuario(datos), "Usuario creado.")}>
              {pieModal}
            </FormularioAlta>
          ) : modal.tipo === "rol" ? (
            <>
              <p>Rol actual: <strong>{nombreRol(modal.usuario.rol)}</strong></p>
              {rolSoloLectura ? pieModal : (
                <FormularioRol key={modal.usuario.id} rolActual={modal.usuario.rol} guardando={guardando}
                  onSubmit={(rol) => guardar(() => cambiarRol(modal.usuario, rol), "Rol actualizado.")}>
                  {pieModal}
                </FormularioRol>
              )}
            </>
          ) : (
            <form className="space-y-4" onSubmit={(event) => {
              event.preventDefault();
              void guardar(() => suspenderUsuario(modal.usuario), "Usuario suspendido.");
            }}>
              <p>La cuenta quedará marcada como suspendida. Sus datos y su rol se conservarán.</p>
              {pieModal}
            </form>
          )}
        </DialogContent>}
      </Dialog>
    </section>
  );
}
