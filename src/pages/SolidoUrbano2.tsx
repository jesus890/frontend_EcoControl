import { useState, useEffect } from "react"

//icons
import { CirclePlus } from "lucide-react"
import { Tag } from "lucide-react"

//card
import { Card, CardContent } from "@/components/ui/card"

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
import { DialogSolidoUrbano2 } from "@/components/dialog-solido-urbano-2"

//calendar
import { Calendar } from "@/components/ui/calendar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

//validaciones y forms
import { useForm, Controller } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import type { CatalogoI, ResiduoSolido2PdfI } from "@/interfaces/interfaces"

import {
  listadoTipoGeneradorRSU_RME,
  listadoAreaGeneraionRSU_RME,
  listadoTipoResiduoRME,
  listadoTipoTratamientoRME,
  listadoTransportistasRME,
} from "../api/service"

export function SolidoUrbano2() {

  const [open, setOpen] = useState<boolean>(false)

  const [generadores, setGeneradores] = useState<CatalogoI[]>([])
  const [areas, setAreas] = useState<CatalogoI[]>([])
  const [residuos, setTipoResiduo] = useState<CatalogoI[]>([])
  const [tratamientos, setTipoTratamiento] = useState<CatalogoI[]>([])
  const [transportistas, setTipoTransportistas] = useState<CatalogoI[]>([])

  //dia actual
  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  const [dataPdf, setdataPdf] = useState<ResiduoSolido2PdfI>({
    nombreResiduo: "",
    descGenerador: "",
    descArea: "",
    cantidad: 1,
    fEntrada: todayString,
    fSalida: todayString,
    descTransportistas: "",
    descTratamiento: "",
    manifiesto: "",
  })

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

    fEntrada: z.string().min(1, "Fecha requerida"),

    fSalida: z.string().min(1, "Fecha requerida"),

    tipoTransportista: z
      .string()
      .nullable()
      .refine((val) => val !== null && val !== "", {
        message: "Selecciona un tipo de tipo de transportista",
      }),

    tipoTratamiento: z
      .string()
      .nullable()
      .refine((val) => val !== null && val !== "", {
        message: "Selecciona un tipo de tipo de tratamiento",
      }),

    manifiestos: z.string(),
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
      fEntrada: todayString,
      fSalida: todayString,
      tipoTransportista: "",
      tipoTratamiento: "",
      manifiestos: "",
    },
    mode: "onBlur",
  })

  const values = form.watch()

  useEffect(() => {
    cargarCatalogos()
  }, [])

  //load catalogos
  const cargarCatalogos = async () => {
    const [residuos, generadores, tratamientos, transportistas] =
      await Promise.all([
        listadoTipoResiduoRME(),
        listadoTipoGeneradorRSU_RME(),
        listadoTipoTratamientoRME(),
        listadoTransportistasRME(),
      ])

    setTipoResiduo(residuos.data)
    setGeneradores(generadores.data)
    setTipoTratamiento(tratamientos.data)
    setTipoTransportistas(transportistas.data)
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
    console.log({data})
    setOpen(true)
  }

  const previsualizarPDF = () => {
    const dataToGeneratePDF = {
      nombreResiduo: String(values.tipoResiduo),
      descGenerador: String(values.tipoGenerador),
      descArea: String(values.tipoArea),
      cantidad: values.cantidad,
      fEntrada: values.fEntrada,
      fSalida: values.fEntrada,
      descTransportistas: String(values.tipoTransportista),
      descTratamiento: String(values.tipoTratamiento),
      manifiesto: String(values.manifiestos),
    }

    setdataPdf(dataToGeneratePDF)
    setOpen(true)
  }

  return (
    <div className="p-5">
      <Card tabIndex={0} className="h-[70vh] w-full shadow-md">
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
                          className="h-8 w-full cursor-pointer rounded-lg border border-input bg-transparent px-2.5 py-1 text-left text-base text-placeholder transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm"
                          aria-invalid={fieldState.invalid}
                        >
                          {field.value
                            ? (() => {
                                const [year, month, day] =
                                  field.value.split("-")

                                return `${day}/${month}/${year}`
                              })()
                            : "Selecciona una fecha ..."}
                        </div>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? new Date(field.value + "T00:00:00")
                              : undefined
                          }
                          defaultMonth={
                            field.value
                              ? new Date(field.value + "T00:00:00")
                              : new Date()
                          }
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            if (!date) return

                            const formatted = `${date.getFullYear()}-${String(
                              date.getMonth() + 1
                            ).padStart(2, "0")}-${String(
                              date.getDate()
                            ).padStart(2, "0")}`

                            field.onChange(formatted)
                          }}
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

              {/* Fecha de salida */}
              <Controller
                name="fSalida"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="fSalida"
                      className="text-[13px] font-bold text-negrito"
                    >
                      Fecha de Salida *
                    </FieldLabel>

                    <Popover>
                      <PopoverTrigger disabled>
                        <div
                          className="h-8 w-full cursor-pointer rounded-lg border border-input bg-transparent px-2.5 py-1 text-left text-base text-placeholder transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm"
                          aria-invalid={fieldState.invalid}
                        >
                          {field.value
                            ? (() => {
                                const [year, month, day] =
                                  field.value.split("-")

                                return `${day}/${month}/${year}`
                              })()
                            : "Selecciona una fecha ..."}
                        </div>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            field.value
                              ? new Date(field.value + "T00:00:00")
                              : undefined
                          }
                          defaultMonth={
                            field.value
                              ? new Date(field.value + "T00:00:00")
                              : new Date()
                          }
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            if (!date) return

                            const formatted = `${date.getFullYear()}-${String(
                              date.getMonth() + 1
                            ).padStart(2, "0")}-${String(
                              date.getDate()
                            ).padStart(2, "0")}`

                            field.onChange(formatted)
                          }}
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

              {/* Tratamientos */}
              <Controller
                name="tipoTratamiento"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[13px] font-bold text-negrito">
                        Tipo Tratamiento
                      </FieldLabel>

                      <Combobox
                        items={tratamientos}
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

              {/* Transportistas */}
              <Controller
                name="tipoTransportista"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[13px] font-bold text-negrito">
                        Transportistas
                      </FieldLabel>

                      <Combobox
                        items={transportistas}
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

              {/* Manifiestos */}
              <Controller
                name="manifiestos"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="manifiestos"
                      className="text-[13px] font-bold text-negrito"
                    >
                      Manifiestos
                    </FieldLabel>

                    <Input
                      id="manifiestos"
                      type="text"
                      placeholder="Ej. Aceite Quemado"
                      className="placeholder:text-placeholder"
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value)
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
            </FieldGroup>

            <Button
              type="submit"
              className="mt-4 ml-4 cursor-pointer bg-[#239954] p-4 hover:bg-[#52BE80] focus:bg-[#52BE80] focus:outline-none"
            >
              <CirclePlus />
              <span>Registrar Sólido urbano</span>
            </Button>

            <Button
              onClick={form.handleSubmit(previsualizarPDF)}
              className="mt-4 ml-4 cursor-pointer p-4 hover:bg-[#5D86A6] focus:bg-[#5D86A6] focus:outline-none"
            >
              <Tag />
              <span>Vista Previa Etiqueta</span>
            </Button>

            <DialogSolidoUrbano2 open={open} setOpen={setOpen} data={dataPdf} />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SolidoUrbano2
