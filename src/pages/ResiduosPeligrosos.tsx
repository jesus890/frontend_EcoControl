import { useState, useEffect } from "react"

//react-router
import { useNavigate, useParams } from "react-router";

//redux
import { setLlenarCatalogos } from "@/provider/Slice/CatalogoSlice";
import { useAppDispatch, useAppSelector } from "@/provider/app/hooks";

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
import { Tag } from "lucide-react"

//validaciones y forms
import { useForm, Controller } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { NavBarCustom } from "@/components/navbar-custom"

import type { CatalogoI, ResiduoPeligroPdfI } from "@/interfaces/interfaces"

import {
  listadoAgregacionMateria,
  listadoTipoResiduoxMateriaRP,
  listadoAreaGeneracionRP,
  listadoTipoEnvasesRP,
  listadoTipoGeneradorRP,
  listadoAutorizacionRP,
  listadoDestinoFinalRP,
  crearResiduosPeligroso,
  actualizarReporteResiduosPeligroso,
  listadoSubTipoResiduoRP,
  buscarResiduosPeligroso,
} from "../api/service"

import { DialogResiduoPeligroso } from "@/components/dialog-residuo-peligroso"

import { toast } from "sonner"
import { MessageCircleCheck } from "lucide-react"
import { MessageCircleWarning } from "lucide-react"


export function ResiduosPeligrosos() {

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { uuid } = useParams();

  //catalogos
  const stateCatalogos = useAppSelector((state) => state.CatalogoSeleccionados);
  const materias =  stateCatalogos.agregacionmateria_rp;
  const envases = stateCatalogos.envases_rp;
  const generadores = stateCatalogos.generadores_rp;
  const destinoFinal = stateCatalogos.destinofinal_rp;

  const [open, setOpen] = useState<boolean>(false);

  const [tipoResiduo, setTipoResiduo] = useState<CatalogoI[]>([]);
  const [subTipoResiduo, setSubTipoResiduo] = useState<CatalogoI[]>([]);
  const [areas, setAreas] = useState<CatalogoI[]>([]);
  
  const [autorizacion, setAutorizacion] = useState<CatalogoI[]>([]);

  const [uuidGenerate, setuuidGenerate] = useState("");

  const today = new Date();

  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`


  //generar el pdf
  const [dataPdf, setdataPdf] = useState<ResiduoPeligroPdfI>({
    uuid: null,
    descMateria: "",
    descResiduo: "",
    cantidad: 1,

    descSubTipoResiduo: "",
    descGenerador: "",
    descArea: "",
    
    fEntrada: todayString,
    fSalida: null,
    numManifiesto: "",
  })


  //schema
  const schema = z.object({
    tipoMateria: z.string().refine((val) => val !== null && val !== "", {
      message: "Selecciona un tipo de estado de la matería",
    }),

    tipoResiduo: z.string().refine((val) => val !== null && val !== "", {
      message: "Selecciona un tipo de residuo",
    }),

    subTipoResiduo: z.string().nullable(),

    cantidad: z
      .number({ error: "La cantidad debe ser un número" })
      .positive("La cantidad debe ser mayor a 0"),

    tipoEnvase: z.string().refine((val) => val !== null && val !== "", {
      message: "Selecciona un tipo de envase",
    }),

    tipoGenerador: z.string().refine((val) => val !== null && val !== "", {
      message: "Selecciona un tipo de generador",
    }),

    tipoArea: z.string().refine((val) => val !== null && val !== "", {
      message: "Selecciona un tipo de tipo de area",
    }),

    tipoAutorizacion: z.string().nullable(),
   
    tipoDestinoFinal: z.string().refine((val) => val !== null && val !== "", {
      message: "Selecciona un destino final",
    }),

    fEntrada: z.string().min(1, "Fecha requerida"),
  })

  type FormValues = z.infer<typeof schema>

  //inicializacion de variables
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cantidad: 0,
      tipoMateria: "", //obligatorio
      tipoResiduo: "", //obligatorio
      subTipoResiduo: null,
      tipoEnvase: "", //obligatorio
      tipoGenerador: "", //obligatorio
      tipoArea: "", //obligatorio
      tipoAutorizacion: null,
      tipoDestinoFinal: "", //obligatorio
      fEntrada: todayString,
    },
    mode: "onBlur",
  })

  //valores del form
  const values = form.watch()

  useEffect(() => {
    cargarCatalogos()
  }, [])

  useEffect(() => {
    if(uuid)
    cargarDatos(uuid)
  }, [uuid])

 
  //carga los diferentes catalogos que no dependen de otro
  const cargarCatalogos = async () => {
    if(materias.length == 0 || envases.length == 0 || generadores.length == 0 || destinoFinal.length == 0)
    {
      
      const [listMateria, listEnvases, listGeneradores, listDestinoFinal] = await Promise.all([
        listadoAgregacionMateria(),
        listadoTipoEnvasesRP(),
        listadoTipoGeneradorRP(),
        listadoDestinoFinalRP(),
      ])

      dispatch(setLlenarCatalogos({ catalogo: "agregacionmateria_rp", value: listMateria.data }));
      dispatch(setLlenarCatalogos({ catalogo: "envases_rp", value: listEnvases.data }));
      dispatch(setLlenarCatalogos({ catalogo: "generadores_rp", value: listGeneradores.data }));
      dispatch(setLlenarCatalogos({ catalogo: "destinofinal_rp", value: listDestinoFinal.data }));
    }
  }


  //busca si existe un registro con el uuid, si existe carga los datos en el form
  const cargarDatos = async (uuid: string) => {
    
    await buscarResiduosPeligroso(uuid).then((result) => {

      if(result)
      {
        const dataToEdit = {
          uuid: result.data.uuid,
          descMateria: result.data.agregacion_materia?.descripcion || "",  //agregacion_materia
          descResiduo: result.data.tipo_residuo?.descripcion || "",  //tipo_residuo
          descSubTipoResiduo: result.data.subtipo_residuo?.descripcion || null,  //subtipo_residuo
          cantidad: result.data.cantidad,
          descEnvase:  result.data.tipo_envase?.descripcion || "",  //tipo_envase
          descGenerador: result.data.tipo_generador?.descripcion || "",  //tipo_generador
          descArea: result.data.area_generacion?.descripcion || "",  //area_generacion
          descDestinoFinal: result.data.destino_final?.descripcion || "",  //destino_final
          descAutorizacion: result.data.autorizacion?.descripcion || null,  //autorizacion
          fEntrada: result.data.fecha_entrada,
          fSalida: result.data.fecha_salida,
        }

        setuuidGenerate(dataToEdit.uuid);
        form.setValue("tipoMateria", dataToEdit.descMateria);
        form.setValue("tipoResiduo", dataToEdit.descResiduo);
        form.setValue("subTipoResiduo", dataToEdit.descSubTipoResiduo);
        form.setValue("cantidad", dataToEdit.cantidad);
        form.setValue("tipoEnvase", dataToEdit.descEnvase);
        form.setValue("tipoGenerador", dataToEdit.descGenerador);
        form.setValue("tipoArea", dataToEdit.descArea);
        form.setValue("tipoAutorizacion", dataToEdit.descArea);
        form.setValue("tipoDestinoFinal", dataToEdit.descDestinoFinal);
      }
    })
  }

  
  //al seleccionar un tipo de materia, actualiza el listado de residuos acorde al primer filtro
  const materiaOnChange = async (value: string | null) => {
    if (value !== null) {
      form.setValue("tipoResiduo", "")
      form.setValue("subTipoResiduo", null)

      const selectedTipo = materias.find((item) => item.descripcion === value)
      if (selectedTipo) {
        const result = await listadoTipoResiduoxMateriaRP(selectedTipo.id);
        setTipoResiduo(result.data);
      }
    }
  }

  //al seleccionar un residuo, actualiza el listado de subtipo residuo acorde al primer filtro
  const residuoOnChange = async (value: string | null) => {
    if (value !== null) {
      form.setValue("subTipoResiduo", null)

      const selectedTipo = tipoResiduo.find(
        (item) => item.descripcion === value
      )
      if (selectedTipo) {
        const result = await listadoSubTipoResiduoRP(selectedTipo.id);
        setSubTipoResiduo(result.data);
      }
    }
  }

  //al seleccionar un valor de generador , actualiza el listado de areas acorde al primer filtro
  const generadorOnChange = async (value: string | null) => {
    if (value !== null) {
      form.setValue("tipoArea", "")
      const selectedTipo = generadores.find(
        (item) => item.descripcion === value
      )
      if (selectedTipo) {
        const result = await listadoAreaGeneracionRP(selectedTipo.id);
        setAreas(result.data);
      }
    }
  }

  //al seleccionar un valor de autorizacion, actualiza el listado de autorizacion acorde al primer filtro
  const destinoFinalOnChange = async (value: string | null) => {
    if (value !== null) {
      const selectedTipo = destinoFinal.find(
        (item) => item.descripcion === value
      )
      if (selectedTipo) {
        const result = await listadoAutorizacionRP(selectedTipo.id)
        setAutorizacion(result.data)
      }
    } else {
      setAutorizacion([])
    }
  }

  //guarda
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const dataToSave = {
        uuid : undefined,
        descMateria: data.tipoMateria,
        descResiduo: data.tipoResiduo,
        descSubTipoResiduo: data.subTipoResiduo,
        cantidad: data.cantidad,
        descEnvase: data.tipoEnvase,
        descGenerador: data.tipoGenerador,
        descArea: data.tipoArea,
        descDestinoFinal: data.tipoDestinoFinal,
        descAutorizacion: data.tipoAutorizacion,
        fEntrada: data.fEntrada,
      }

      const result = await crearResiduosPeligroso(dataToSave)
      if (result) {
        toast(
          "El registro ha sido creado!", //sucess
          {
            icon: <MessageCircleCheck className="text-verdecito" />,
            className: "bg-white !text-negrito !font-bold border !shadow-sm",
          }
        )

        console.log({result})
        navigate(`/mml/environment/residuos-peligrosos/${result.data.uuid}`);
        setuuidGenerate(result.data.uuid)

      }
    } catch (
      ex //error
    ) {
      toast(
        "Ocurrio un error, vaya esto es incomodo", //error
        {
          icon: <MessageCircleWarning className="text-rojito" />,
          className: "bg-white !text-negrito !font-bold border !shadow-sm",
        }
      )
    }
  }

  //actualiza
  const onEdit : SubmitHandler<FormValues> = async (data) => {
    try {

      const dataToSave = {
        uuid : uuid?.toString(),
        descMateria: data.tipoMateria,
        descResiduo: data.tipoResiduo,
        descSubTipoResiduo: data.subTipoResiduo,
        cantidad: data.cantidad,
        descEnvase: data.tipoEnvase,
        descGenerador: data.tipoGenerador,
        descArea: data.tipoArea,
        descDestinoFinal: data.tipoDestinoFinal,
        descAutorizacion: data.tipoAutorizacion,
        fEntrada: data.fEntrada,
      }

      const result = await actualizarReporteResiduosPeligroso(dataToSave)
      if (result) {
        toast(
          "El registro ha sido actulizado!", //sucess
          {
            icon: <MessageCircleCheck className="text-verdecito" />,
            className: "bg-white !text-negrito !font-bold border !shadow-sm",
          }
        )
      }
    } catch (
      ex //error
    ) {
      toast(
        "Ocurrio un error, vaya esto es incomodo", //error
        {
          icon: <MessageCircleWarning className="text-rojito" />,
          className: "bg-white !text-negrito !font-bold border !shadow-sm",
        }
      )
    }
  } 

  const previsualizarPDF = () => {
    const dataToGeneratePDF = {
      descMateria: String(values.tipoMateria),
      descResiduo: String(values.tipoResiduo),
      descSubTipoResiduo:
        values.subTipoResiduo !== null ? String(values.subTipoResiduo) : "",
      descGenerador: String(values.tipoGenerador),
      descArea: String(values.tipoArea),
      cantidad: values.cantidad,
      fEntrada: new Date(values.fEntrada),
      fSalida: null,
      uuid: uuidGenerate ? uuidGenerate : null,
      numManifiesto: null,
    }

    setdataPdf(dataToGeneratePDF)
    setOpen(true)
  }

  return (
    <>
      <NavBarCustom />
      <div className="p-5">
        <Card
          tabIndex={0}
          className="h-[76vh] w-full overflow-y-auto shadow-md"
        >
          <CardHeader>
            <CardTitle className="text-[16px] font-bold text-azulito">
              Registro de Residuos Peligrosos
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="mx-auto grid grid-cols-1 gap-5 p-4 md:grid-cols-3">
                
                {/* TipoMateria */}
                <Controller
                  name="tipoMateria"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[13px] font-bold text-negrito">
                          Tipo de Residuo *
                        </FieldLabel>

                        <Combobox
                          items={materias}
                          value={field.value ?? ""}
                          onValueChange={(value) => (
                            field.onChange(value),
                            materiaOnChange(value)
                          )}
                        >
                          <ComboboxInput placeholder="Selecciona un tipo de matería..." />

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

                {/* TipoResiduo */}
                <Controller
                  name="tipoResiduo"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[13px] font-bold text-negrito">
                          Nombre del Residuo *
                        </FieldLabel>

                        <Combobox
                          items={tipoResiduo}
                          value={field.value ?? ""}
                          onValueChange={(value) => (
                            field.onChange(value),
                            residuoOnChange(value)
                          )}
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
                        <FieldLabel className="text-[13px] font-bold text-negrito">
                          SubTipo Residuo
                        </FieldLabel>

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
                          field.onChange(value === "" ? "" : Number(value))
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
                        <FieldLabel className="text-[13px] font-bold text-negrito">
                          Tipo de Envase *
                        </FieldLabel>

                        <Combobox
                          items={envases}
                          value={field.value ?? ""}
                          onValueChange={(value) => {
                            field.onChange(value)
                          }}
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
                          onValueChange={(value) => (
                            field.onChange(value),
                            destinoFinalOnChange(value)
                          )}
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
                          <FieldError className="text-rojito">
                            {fieldState.error.message}
                          </FieldError>
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
                        <FieldLabel className="text-[13px] font-bold text-negrito">
                          Tipo Autorización
                        </FieldLabel>

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
                        <PopoverTrigger >
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

                <DialogResiduoPeligroso
                  open={open}
                  setOpen={setOpen}
                  data={dataPdf}
                />
              </FieldGroup>

              <Button
                onClick={uuidGenerate ? form.handleSubmit(onEdit) : form.handleSubmit(onSubmit) }
                className="mt-4 ml-4 cursor-pointer bg-[#239954] p-4 hover:bg-[#52BE80] focus:bg-[#52BE80] focus:outline-none"
              >
                <CirclePlus />
                <span>  { uuidGenerate ? 'Actualizar Residuo' : 'Registrar Residuo' }  </span>
              </Button>

              <Button
                onClick={form.handleSubmit(previsualizarPDF)}
                className="mt-4 ml-4 cursor-pointer p-4 hover:bg-[#5D86A6] focus:bg-[#5D86A6] focus:outline-none"
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
