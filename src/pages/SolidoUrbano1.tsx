import { useState, useEffect } from "react"

//icons
import { CirclePlus } from "lucide-react"
import { Tag } from "lucide-react"

//card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

//field
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

//popover
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

//combobox
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

//dialog
import { DialogManejoEspecial } from "@/components/dialog-manejo-especial"

//calendar
import { Calendar } from "@/components/ui/calendar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

//validaciones y forms
import { useForm, Controller } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import type { CatalogoI } from "@/interfaces/interfaces"

import {
  listadoTipoResiduoRSU,
  listadoTipoGeneradorRSU_RME,
  listadoAreaGeneraionRSU_RME,
  listadoDestinoFinalRSU
} from "../api/service"

export function SolidoUrbano1() {
  const [open, setOpen] = useState<boolean>(false);

  const [generadores, setGeneradores] = useState<CatalogoI[]>([]);
  const [areas, setAreas] = useState<CatalogoI[]>([]);
  const [residuos, setTipoResiduo] = useState<CatalogoI[]>([]);
  const [destinoFinal, setDestinoFinal] = useState<CatalogoI[]>([]);

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  //schema
  const schema = z.object({
    tipoResiduo: z
      .string()
      .nullable()
      .refine((val) => val !== null && val !== "", {
        message: "Selecciona un tipo de residuo",
      }),

    cantidad: z
      .number({ error: "La cantidad debe ser un número" })
      .positive("La cantidad debe ser mayor a 0"),

    tipoGenerador: z
      .string()
      .nullable()
      .refine((val) => val !== null && val !== "", {
        message: "Selecciona un tipo de generador",
      }),

    tipoArea: z
      .string()
      .nullable()
      .refine((val) => val !== null && val !== "", {
        message: "Selecciona un tipo de tipo de area",
      }),

      tipoDestinoFinal: z
      .string()
      .nullable()
      .refine((val) => val !== null && val !== "", {
        message: "Selecciona un destino final",
      }),

    fEntrada: z.date().min(new Date(), { error: "Fecha invalida" }),

    fSalida: z.date(),

    observaciones: z.string(),
  })

  type FormValues = z.infer<typeof schema>

  //useform
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipoResiduo: "",
      cantidad: 0,
      tipoGenerador: "",
      tipoArea: "",
      fEntrada: new Date(),
      fSalida: new Date(),
      observaciones: "",
    },
    mode: "onBlur",
  })

  const values = form.watch()

  useEffect(() => {
    cargarCatalogos()
  }, [])

  //load catalogos
  const cargarCatalogos = async () => {

    const [generadores, residuos , destinoFinal] = await Promise.all([
      listadoTipoGeneradorRSU_RME(),
      listadoTipoResiduoRSU(),
      listadoDestinoFinalRSU()
    ])

    console.log({generadores})

    setGeneradores(generadores.data);
    setTipoResiduo(residuos.data);
    setDestinoFinal(destinoFinal.data);
  }

  //al seleccionar un valor de generador , actualiza el listado de areas acorde al primer filtro
  const generadorOnChange = async (value: string | null) => {
    if (value !== null) {
      const selectedTipo = generadores.find(
        (item) => item.descripcion === value
      )
      if (selectedTipo) {
        const result = await listadoAreaGeneraionRSU_RME(selectedTipo.id)
        setAreas(result.data)
      }
    } else {
      setAreas([])
    }
  }

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setOpen(true)
  }

  return (
    <div className="p-5">
      <Card tabIndex={0} className="w-full h-[70vh] shadow-md">
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="mx-auto grid grid-cols-1 gap-5 p-4 md:grid-cols-3">
              
              {/* Tipo del residuo */}
              <Controller
                name="tipoResiduo"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[13px] font-bold text-negrito">
                        Tipo de Residuo *
                      </FieldLabel>

                      <Combobox
                        items={residuos}
                        value={field.value ?? ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <ComboboxInput placeholder="Selecciona un tipo de residuo..." />

                        <ComboboxContent>
                          <ComboboxEmpty className="text-placeholder">
                            No se encontraron resultados.
                          </ComboboxEmpty>

                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem
                                key={item.id}
                                value={String(item.descripcion)}
                              >
                                {item.descripcion}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>

                      {fieldState.error && (
                        <FieldError className="text-rojito">
                          {fieldState.error.message}
                        </FieldError>
                      )}
                    </Field>
                  )
                }}
              />

              {/* Cantidad */}
              <Controller
                name="cantidad"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="cantidad"
                      className="text-[13px] font-bold text-negrito"
                    >
                      Cantidad (kg) *
                    </FieldLabel>

                    <Input
                      id="cantidad"
                      type="number"
                      placeholder="Ej. 25"
                      className="placeholder:text-placeholder"
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? undefined : Number(value))
                      }}
                    />

                    {fieldState.error && (
                      <FieldError className="text-rojito">
                        {fieldState.error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* TipoGenerador */}
              <Controller
                name="tipoGenerador"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[13px] font-bold text-negrito">
                        Tipo Generador *
                      </FieldLabel>

                      <Combobox
                        items={generadores}
                        value={field.value ?? ""}
                        onValueChange={(value) => (
                          field.onChange(value),
                          generadorOnChange(value)
                        )}
                      >
                        <ComboboxInput placeholder="Selecciona un generador..." />

                        <ComboboxContent>
                          <ComboboxEmpty className="text-placeholder">
                            No se encontraron resultados.
                          </ComboboxEmpty>

                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem
                                key={item.id}
                                value={String(item.descripcion)}
                              >
                                {item.descripcion}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>

                      {fieldState.error && (
                        <FieldError className="text-rojito">
                          {fieldState.error.message}
                        </FieldError>
                      )}
                    </Field>
                  )
                }}
              />

              {/* Area de Generación (depende de TipoGenerador) */}
              <Controller
                name="tipoArea"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[13px] font-bold text-negrito">
                        Tipo Área *
                      </FieldLabel>

                      <Combobox
                        items={areas}
                        value={field.value ?? ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <ComboboxInput placeholder="Selecciona un tipo de área..." />

                        <ComboboxContent>
                          <ComboboxEmpty className="text-placeholder">
                            No se encontraron resultados.
                          </ComboboxEmpty>

                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem
                                key={item.id}
                                value={String(item.descripcion)}
                              >
                                {item.descripcion}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>

                      {fieldState.error && (
                        <FieldError className="text-rojito">
                          {fieldState.error.message}
                        </FieldError>
                      )}
                    </Field>
                  )
                }}
              />

              {/* Fecha de entrada */}
              <Controller
                name="fEntrada"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="fEntrada"
                      className="text-[13px] font-bold text-negrito"
                    >
                      Fecha de Entrada *
                    </FieldLabel>

                    <Popover>
                      <PopoverTrigger disabled>
                        <div
                          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-left text-base text-placeholder transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
                          aria-invalid={fieldState.invalid}
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Selecciona una fecha ..."}
                        </div>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          defaultMonth={field.value}
                          captionLayout="dropdown"
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>

                    {fieldState.error && (
                      <FieldError className="text-rojito">
                        {fieldState.error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Fecha de entrada */}
              <Controller
                name="fSalida"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="fSalida"
                      className="text-[13px] font-bold text-negrito"
                    >
                      Fecha de Entrada *
                    </FieldLabel>

                    <Popover>
                      <PopoverTrigger disabled>
                        <div
                          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-left text-base text-placeholder transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
                          aria-invalid={fieldState.invalid}
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Selecciona una fecha ..."}
                        </div>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          defaultMonth={field.value}
                          captionLayout="dropdown"
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>

                    {fieldState.error && (
                      <FieldError className="text-rojito">
                        {fieldState.error.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Destino Final */}
              <Controller
                name="tipoDestinoFinal"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[13px] font-bold text-negrito">
                        Destino Final *
                      </FieldLabel>

                      <Combobox
                        items={destinoFinal}
                        value={field.value ?? ""}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <ComboboxInput placeholder="Selecciona un destino final ..." />

                        <ComboboxContent>
                          <ComboboxEmpty className="text-placeholder">
                            No se encontraron resultados.
                          </ComboboxEmpty>

                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem
                                key={item.id}
                                value={String(item.descripcion)}
                              >
                                {item.descripcion}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>

                      {fieldState.error && (
                        <FieldError className="text-rojito">
                          {fieldState.error.message}
                        </FieldError>
                      )}
                    </Field>
                  )
                }}
              />
              

            </FieldGroup>

            <Button
              type="submit"
              className="cursor-pointer hover:bg-[#305a78] focus:bg-[#305a78] focus:outline-none"
            >
              <Tag />
              <span>Vista Previa Etiqueta </span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SolidoUrbano1
