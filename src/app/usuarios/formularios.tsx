import { useId, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { roles, rolAsignable, type AltaUsuario } from "./api";

const campos = [
  ["name", "Nombre", 20, "text"],
  ["surname1", "Primer apellido", 20, "text"],
  ["surname2", "Segundo apellido", 20, "text"],
  ["email", "Correo electrónico", undefined, "email"],
  ["title", "Título", 100, "text"],
  ["phone", "Teléfono", 25, "tel"],
] as const;

const texto = (max: number) => z.string().trim().min(1, "Completa este campo.").max(max, `Máximo ${max} caracteres.`);
const rol = z.string().min(1, "Selecciona un rol.").refine(rolAsignable, "Selecciona un rol válido.");
const esquemaRol = z.object({ rol });
const esquemaAlta = esquemaRol.extend({
  name: texto(20), surname1: texto(20), surname2: texto(20),
  email: z.string().trim().pipe(z.email("Ingresa un correo electrónico válido.")),
  title: texto(100), phone: texto(25),
  status: z.enum(["0", "1"], { error: "Selecciona un estado válido." }),
});

const claseSelector = "h-8 rounded-md border bg-background px-2";

function Campo({ id, etiqueta, error, children }: {
  id: string;
  etiqueta: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <Field data-invalid={Boolean(error)} className="gap-1.5">
      <FieldLabel htmlFor={id}>{etiqueta}</FieldLabel>
      {children}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}

function opcionesRol() {
  return roles.map(({ id, nombre }) => <option key={id} value={id}>{nombre}</option>);
}

function ariaCampo(id: string, invalido: boolean) {
  return { id, "aria-invalid": invalido, "aria-describedby": invalido ? `${id}-error` : undefined };
}

type FormularioProps = { guardando: boolean; children: ReactNode };

export function FormularioAlta({ onSubmit, guardando, children }: FormularioProps & {
  onSubmit: (usuario: AltaUsuario) => Promise<void>;
}) {
  const id = useId();
  const form = useForm<z.infer<typeof esquemaAlta>>({
    resolver: zodResolver(esquemaAlta),
    defaultValues: { name: "", surname1: "", surname2: "", email: "", title: "", phone: "", rol: "", status: "1" },
  });

  return (
    <form noValidate className="space-y-4" onSubmit={form.handleSubmit((datos) =>
      onSubmit({ ...datos, rol: Number(datos.rol), status: Number(datos.status) }))}>
      <fieldset disabled={guardando || form.formState.isSubmitting}>
        <FieldGroup className="grid gap-3 sm:grid-cols-2">
          {campos.map(([name, etiqueta, maxLength, type]) => (
            <Controller key={name} name={name} control={form.control} render={({ field, fieldState }) => (
              <Campo id={`${id}-${name}`} etiqueta={etiqueta} error={fieldState.error?.message}>
                <Input {...field} {...ariaCampo(`${id}-${name}`, fieldState.invalid)} type={type} maxLength={maxLength} required />
              </Campo>
            )} />
          ))}
          <Controller name="rol" control={form.control} render={({ field, fieldState }) => (
            <Campo id={`${id}-rol`} etiqueta="Rol" error={fieldState.error?.message}>
              <select {...field} {...ariaCampo(`${id}-rol`, fieldState.invalid)} className={claseSelector} required>
                <option value="" disabled>Selecciona un rol</option>
                {opcionesRol()}
              </select>
            </Campo>
          )} />
          <Controller name="status" control={form.control} render={({ field, fieldState }) => (
            <Campo id={`${id}-status`} etiqueta="Estado" error={fieldState.error?.message}>
              <select {...field} {...ariaCampo(`${id}-status`, fieldState.invalid)} className={claseSelector} required>
                <option value="1">Activo</option><option value="0">Suspendido</option>
              </select>
            </Campo>
          )} />
        </FieldGroup>
      </fieldset>
      {children}
    </form>
  );
}

export function FormularioRol({ rolActual, onSubmit, guardando, children }: FormularioProps & {
  rolActual: number | string;
  onSubmit: (rol: number) => Promise<void>;
}) {
  const id = useId();
  const form = useForm<z.infer<typeof esquemaRol>>({
    resolver: zodResolver(esquemaRol),
    defaultValues: { rol: String(rolActual) },
  });
  return (
    <form noValidate className="space-y-4" onSubmit={form.handleSubmit(({ rol }) => onSubmit(Number(rol)))}>
      <Controller name="rol" control={form.control} render={({ field, fieldState }) => (
        <Campo id={id} etiqueta="Rol" error={fieldState.error?.message}>
          <select {...field} {...ariaCampo(id, fieldState.invalid)} className={claseSelector}
            disabled={guardando || form.formState.isSubmitting} required>
            {opcionesRol()}
          </select>
        </Campo>
      )} />
      {children}
    </form>
  );
}
