import { useState, useEffect } from "react"

import { CirclePlus } from "lucide-react"

//card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

//field
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

//combobox
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

//popover
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

//calendar
import { Calendar } from "@/components/ui/calendar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

//icons 
import { Tag } from 'lucide-react';


//validaciones y forms
import { useForm, Controller } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { NavBarCustom } from "@/components/navbar-custom"

import type { CatalogoI , ResiduoPeligroPdfI , ResiduoPeligroSaveI } from "@/interfaces/interfaces"

import {
  listadoAreaGeneracionRP,
  listadoTipoEnvasesRP,
  listadoTipoGeneradorRP,
  listadoAutorizacionRP,
  listadoDestinoFinalRP,
  obtenerGenerarNumManifiesto,
  crearReporteResiduosPeligroso,
  listadoTipoResiduoRP,
  listadoSubTipoResiduoRP
} from "../api/service"

import { DialogResiduoPeligroso } from "@/components/dialog-residuo-peligroso"

import { toast } from "sonner"

export function ResiduosPeligrosos() {

  const [open, setOpen] = useState<boolean>(false);
  const [tipoResiduo, setTipoResiduo] = useState<CatalogoI[]>([]);
  const [subTipoResiduo, setSubTipoResiduo] = useState<CatalogoI[]>([]);
  const [envases, setEnvases] = useState<CatalogoI[]>([]);
  const [generadores, setGeneradores] = useState<CatalogoI[]>([]);
  const [areas, setAreas] = useState<CatalogoI[]>([]);
  const [destinoFinal, setDestinoFinal] = useState<CatalogoI[]>([]);
  const [autorizacion, setAutorizacion] = useState<CatalogoI[]>([]);

  const [uuid, setUuid] =useState("");


  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dataPdf, setdataPdf] = useState<ResiduoPeligroPdfI>({
    nombreResiduo: "",
    descGenerador: "",
    descArea: "",
    cantidad: 1,
    fEntrada: today,
    uuid : null
  });

  // const [dataToSave, setdataToSave] = useState<ResiduoPeligroSaveI>({
  //   nombreResiduo: "",
  //   cantidad: 0,
  //   descEnvase: "",
  //   descGenerador: "",
  //   descArea: "",
  //   numManifiesto: "",
  //   descDestinoFinal: null,
  //   descAutorizacion: null,
  //   fEntrada: new Date
  // });
  
  //schema
  const schema = z.object({

    nombreResiduo: z.string().min(1, "El nombre es obligatorio"),

    tipoResiduo: z
      .string()
      .refine((val) => val !== null && val !== "", {
        message: "Selecciona un tipo de residuo",
      }),

    subTipoResiduo: z
      .string().nullable(),

    cantidad: z
      .number({ error: "La cantidad debe ser un número" })
      .positive("La cantidad debe ser mayor a 0"),

    tipoEnvase: z
      .string()
      .refine((val) => val !== null && val !== "", {
        message: "Selecciona un tipo de envase",
      }),

    tipoGenerador: z
      .string()
      .refine((val) => val !== null && val !== "", {
        message: "Selecciona un tipo de generador",
      }),

    tipoArea: z
      .string()
      .refine((val) => val !== null && val !== "", {
        message: "Selecciona un tipo de tipo de area",
      }),

    tipoAutorizacion: z
      .string().nullable(),

    tipoDestinoFinal: z
      .string().nullable(),

    fEntrada: z.date().min(today, { error: "Fecha invalida" })

  })

  type FormValues = z.infer<typeof schema>

  //inicializacion de variables
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cantidad: 0,
      nombreResiduo: "",
      tipoResiduo: "",
      subTipoResiduo: "",
      tipoEnvase: "",
      tipoGenerador: "",
      tipoArea: "",
      tipoAutorizacion: null,
      tipoDestinoFinal: null,
      fEntrada: new Date()
    },
    mode: "onBlur",
  })

  //valores del form
  const values = form.watch()

  useEffect(() => {
    cargarCatalogos()
  }, [])

  const cargarCatalogos = async () => {

    const [residuos, envases, generadores, destinoFinal ] = await Promise.all([
      listadoTipoResiduoRP(),
      listadoTipoEnvasesRP(),
      listadoTipoGeneradorRP(),
      listadoDestinoFinalRP()
    ])

    setTipoResiduo(residuos.data);
    setEnvases(envases.data);
    setGeneradores(generadores.data);
    setDestinoFinal(destinoFinal.data);
  }

  //al seleccionar un residuo, actualiza el listado de subtipo residuo acorde al primer filtro
  const residuoOnChange = async(value: string|null)=> {
    if(value !== null)
    {
      const selectedTipo = tipoResiduo.find((item) => item.descripcion === value)
      if(selectedTipo)
      {
        console.log({selectedTipo})
        const result = await listadoSubTipoResiduoRP(selectedTipo.id);
        setSubTipoResiduo(result.data);
      }      
    }
    else
    {
      setSubTipoResiduo([])
    }
  }

  //al seleccionar un valor de generador , actualiza el listado de areas acorde al primer filtro
  const generadorOnChange = async(value: string|null)=> {
    if(value !== null)
    {
      const selectedTipo = generadores.find((item) => item.descripcion === value)
      if(selectedTipo)
      {
        const result = await listadoAreaGeneracionRP(selectedTipo.id);
        setAreas(result.data);
      }      
    }
    else
    {
      setAreas([])
    }
  }

  //al seleccionar un valor de autorizacion, actualiza el listado de autorizacion acorde al primer filtro
  const destinoFinalOnChange = async(value: string|null)=> {
    if(value !== null)
    {
      const selectedTipo = destinoFinal.find((item) => item.descripcion === value)
      if(selectedTipo)
      {
        const result = await listadoAutorizacionRP(selectedTipo.id);
        setAutorizacion(result.data);
      }      
    }
    else
    {
      setAutorizacion([])
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async(data) => {

     const dataToSave = {
      nombreResiduo: data.nombreResiduo,
      cantidad: data.cantidad,
      descEnvase: data.tipoEnvase,
      descGenerador: data.tipoGenerador,
      descArea: data.tipoArea,
      numManifiesto: data.manifiesto,
      descDestinoFinal: data.tipoDestinoFinal,
      descAutorizacion: data.tipoAutorizacion,
      fEntrada: data.fEntrada
     }

     const result = await crearReporteResiduosPeligroso(dataToSave);
     if(result.data)
     {
        toast("El registro ha sido creado!")
        setUuid(result.data.uuid);
     }
  
     console.log({result})

  }



  const previsualizarPDF = () => {
  
    const dataToGeneratePDF = {
      nombreResiduo: values.nombreResiduo,
      descGenerador: String(values.tipoGenerador),
      descArea: String(values.tipoArea),
      cantidad: values.cantidad,
      fEntrada :  values.fEntrada,
      uuid: uuid ? uuid : null
    }

    console.log({dataToGeneratePDF});


    setdataPdf(dataToGeneratePDF);
    setOpen(true);
  }

  return (
    <>
      <NavBarCustom />
      <div className="p-5">
        <Card tabIndex={0} className="h-[76vh] w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-[16px] font-bold text-azulito">
              Registro de Residuos Peligrosos
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="mx-auto grid grid-cols-1 gap-5 p-4 md:grid-cols-3">
                
                {/* Nombre */}
                <Controller
                  name="nombreResiduo"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="nombreResiduo"
                        className="text-[13px] font-bold text-negrito"
                      >
                        Nombre del Residuo *
                      </FieldLabel>

                      <Input
                        id="nombreResiduo"
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

                {/* TipoResiduo */}
                <Controller
                  name="tipoResiduo"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[13px] font-bold text-negrito">Tipo de Residuo *</FieldLabel>

                        <Combobox
                          items={tipoResiduo}
                          value={field.value ?? ""}
                          onValueChange={(value) => (field.onChange(value), residuoOnChange(value)) }
                        >
                          <ComboboxInput placeholder="Selecciona un tipo de residuo..." />

                          <ComboboxContent>
                            <ComboboxEmpty>
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
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </Field>
                    )
                  }}
                />


                {/* SubTipoResiduo  */}
                 <Controller
                  name="subTipoResiduo"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[13px] font-bold text-negrito">SubTipo Residuo</FieldLabel>

                        <Combobox
                          items={subTipoResiduo}
                          value={field.value ?? ""}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <ComboboxInput placeholder="Selecciona un subtipo de residuo..." />

                          <ComboboxContent>
                            <ComboboxEmpty>
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
                          <FieldError>{fieldState.error.message}</FieldError>
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
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          )
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

                {/* TipoEnvase */}
                <Controller
                  name="tipoEnvase"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[13px] font-bold text-negrito">Tipo de Envase *</FieldLabel>

                        <Combobox
                          items={envases}
                          value={field.value ?? ""}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <ComboboxInput placeholder="Selecciona un envase..." />

                          <ComboboxContent>
                            <ComboboxEmpty>
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
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </Field>
                    )
                  }}
                />

                {/* TipoGenerador */}
                <Controller
                  name="tipoGenerador"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[13px] font-bold text-negrito">Tipo Generador *</FieldLabel>

                        <Combobox
                          items={generadores}
                          value={field.value ?? ""}
                          onValueChange={(value) => (field.onChange(value), generadorOnChange(value))}
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
                          <FieldError className="text-rojito">{fieldState.error.message}</FieldError>
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
                        <FieldLabel className="text-[13px] font-bold text-negrito">Tipo Área *</FieldLabel>

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
                          <FieldError className="text-rojito">{fieldState.error.message}</FieldError>
                        )}
                      </Field>
                    )
                  }}
                />

               
                {/* Destino Final */}
                <Controller
                  name="tipoDestinoFinal"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[13px] font-bold text-negrito">Destino Final</FieldLabel>

                        <Combobox
                          items={destinoFinal}
                          value={field.value ?? ""}
                          onValueChange={(value) => (field.onChange(value), destinoFinalOnChange(value))}
                        >
                          <ComboboxInput placeholder="Selecciona un destino final..." />

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
                          <FieldError className="text-rojito">{fieldState.error.message}</FieldError>
                        )}
                      </Field>
                    )
                  }}
                />

                {/* Autorización (depende de Destino Final)*/}
                <Controller
                  name="tipoAutorizacion"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[13px] font-bold text-negrito">Tipo Autorización</FieldLabel>

                        <Combobox
                          items={autorizacion}
                          value={field.value ?? ""}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <ComboboxInput placeholder="Selecciona un tipo de autorización..." />

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
                          <FieldError className="text-rojito">{fieldState.error.message}</FieldError>
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

                <DialogResiduoPeligroso
                  open={open}
                  setOpen={setOpen}
                  data={dataPdf}
                />

              </FieldGroup>

              <Button
                type="submit"
                className="cursor-pointer hover:bg-[#305a78] focus:bg-[#305a78] focus:outline-none"
              >
                <CirclePlus />
                <span>Registrar Residuos</span>
              </Button>
          
               <Button
                onClick={form.handleSubmit(previsualizarPDF)}
                className="cursor-pointer hover:bg-[#305a78] focus:bg-[#305a78] focus:outline-none"
              >
                <Tag />
                <span>Vista Previa Etiqueta</span>
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default ResiduosPeligrosos
