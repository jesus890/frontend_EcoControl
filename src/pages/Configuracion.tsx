import { useEffect, useId, useState } from "react";
import { Navigate, useOutletContext } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserRound } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { actualizarUsuario, consultarMiPerfil, mensajeError, type Usuario } from "@/app/usuarios/api";
import type { IUser } from "@/interfaces/interfaces";

const campos = [
  ["name", "Nombre", 20, "given-name"],
  ["surname1", "Apellido paterno", 20, "family-name"],
  ["surname2", "Apellido materno", 20, "off"],
  ["title", "Título", 100, "organization-title"],
  ["phone", "Teléfono", 25, "tel"],
] as const;

const texto = (max: number) => z.string().trim().min(1, "Completa este campo.").max(max, `Máximo ${max} caracteres.`);
const esquema = z.object({
  name: texto(20), surname1: texto(20), surname2: texto(20), title: texto(100), phone: texto(25),
});
type DatosPerfil = z.infer<typeof esquema>;

function datosPerfil(usuario?: Usuario): DatosPerfil {
  return {
    name: usuario?.name ?? "", surname1: usuario?.surname1 ?? "", surname2: usuario?.surname2 ?? "",
    title: usuario?.title ?? "", phone: usuario?.phone ?? "",
  };
}

export default function Configuracion() {
  const sesion = useOutletContext<IUser & { actualizarPerfil: (datos: DatosPerfil) => void }>();
  if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;
  if (!sesion.id) return <p className="p-6" role="status">Verificando sesión…</p>;
  return <Perfil key={sesion.id} actualizarPerfil={sesion.actualizarPerfil} />;
}

function Perfil({ actualizarPerfil }: { actualizarPerfil: (datos: DatosPerfil) => void }) {
  const id = useId();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [errorCarga, setErrorCarga] = useState("");
  const [errorGuardado, setErrorGuardado] = useState("");
  const [intento, setIntento] = useState(0);
  const { control, reset, handleSubmit, formState: { isDirty, isSubmitting } } = useForm<DatosPerfil>({
    resolver: zodResolver(esquema),
    defaultValues: datosPerfil(),
  });

  useEffect(() => {
    const controller = new AbortController();
    consultarMiPerfil(controller.signal)
      .then((perfil) => {
        if (controller.signal.aborted) return;
        reset(datosPerfil(perfil));
        setUsuario(perfil);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setErrorCarga(mensajeError(error, "No se pudo cargar tu perfil."));
      });
    return () => controller.abort();
  }, [intento, reset]);

  async function guardar(datos: DatosPerfil) {
    if (!usuario) return;
    setErrorGuardado("");
    try {
      const actualizado = await actualizarUsuario({ ...usuario, ...datos }, Number(usuario.rol), Number(usuario.status));
      const guardado = datosPerfil(actualizado);
      setUsuario(actualizado);
      reset(guardado);
      actualizarPerfil(guardado);
      toast.success("Perfil actualizado.");
    } catch (error) {
      setErrorGuardado(mensajeError(error, "No se pudo guardar tu perfil. Intenta nuevamente."));
    }
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <header>
        <h1 className="text-2xl font-bold text-primary">Configuración</h1>
        <p className="mt-1 text-muted-foreground">Consulta y actualiza los datos de tu perfil.</p>
      </header>
      <div className="grid items-start gap-5 md:grid-cols-[minmax(13rem,1fr)_minmax(0,2fr)]">
        <aside className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center">
          <h2 className="text-lg font-semibold text-primary">Perfil</h2>
          <Avatar className="size-24">
            <AvatarFallback><UserRound className="size-10" aria-hidden="true" /></AvatarFallback>
          </Avatar>
          {usuario && <p className="font-medium">{[usuario.name, usuario.surname1, usuario.surname2].filter(Boolean).join(" ")}</p>}
        </aside>
        <div className="space-y-5 rounded-xl border bg-card p-5 md:p-6">
          <h2 className="text-lg font-semibold text-primary">Información personal</h2>
          {errorCarga ? (
            <div className="space-y-3">
              <p role="alert">{errorCarga}</p>
              <Button variant="outline" onClick={() => { setErrorCarga(""); setIntento((valor) => valor + 1); }}>Reintentar</Button>
            </div>
          ) : !usuario ? <p role="status">Cargando tu perfil…</p> : (
            <form noValidate className="space-y-5" onSubmit={handleSubmit(guardar)}>
              <fieldset disabled={isSubmitting}>
                <FieldGroup className="grid gap-4 sm:grid-cols-2">
                  {campos.map(([name, etiqueta, maxLength, autoComplete]) => (
                    <Controller key={name} name={name} control={control} render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`${id}-${name}`}>{etiqueta}</FieldLabel>
                        <Input {...field} id={`${id}-${name}`} autoComplete={autoComplete} maxLength={maxLength}
                          type={name === "phone" ? "tel" : "text"} required aria-invalid={fieldState.invalid}
                          aria-describedby={fieldState.invalid ? `${id}-${name}-error` : undefined} />
                        {fieldState.error && <FieldError id={`${id}-${name}-error`}>{fieldState.error.message}</FieldError>}
                      </Field>
                    )} />
                  ))}
                  <Field>
                    <FieldLabel htmlFor={`${id}-email`}>Correo electrónico</FieldLabel>
                    <Input id={`${id}-email`} value={usuario.email} type="email" readOnly className="bg-muted" />
                  </Field>
                </FieldGroup>
              </fieldset>
              {errorGuardado && <p role="alert" className="text-destructive">{errorGuardado}</p>}
              <div className="flex justify-end">
                <Button type="submit" disabled={!isDirty || isSubmitting}>{isSubmitting ? "Guardando…" : "Guardar cambios"}</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
