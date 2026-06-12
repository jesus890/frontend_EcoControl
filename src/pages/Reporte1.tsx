import { useState, useEffect, useRef } from "react"

//card
import { Card, CardContent } from "@/components/ui/card"

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

import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react"

//utilidades
import { cn } from "@/lib/utils"
import { format } from "date-fns"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { Badge } from "@/components/ui/badge"

//Toast
import { toast } from "sonner"

//icons
import { MessageCircleWarning } from "lucide-react"
import { Search } from "lucide-react"
import { ImageDown } from "lucide-react"
import { ChartBarBig } from "lucide-react"

//calendar
import { Calendar } from "@/components/ui/calendar"

//buton
import { Button } from "@/components/ui/button"

//validaciones y forms
import { useForm, Controller } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import type {
  CatalogoI,
  ResiduoPeligrosoEstadistica,
  ResiduoEspecialNumEstadistica,
  ResiduoFiltroEstadistica,
  ResiduoListadoEstadistica,
} from "@/interfaces/interfaces"

import {
  listadoAgregacionMateria,
  listadoTipoGeneradorRP,
  crearEstadisticoPeligroso,
  creaReporteListadoPeligroso,
  listadoAreaGeneracionMultiple,
  listadoAgregacionMateriaMultiple
} from "@/api/service"

//graficas
import ReactECharts from "echarts-for-react"
import type { EChartsOption } from "echarts"
import "../themes/vintage"

//pdf
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

//xlsx
import * as XLSX from "xlsx"

//listado
import ListadoResiduoPeligroso from "@/app/estadisticosRP/page"

export function Reporte1() {

  //catalogos
  const [residuos, setResiduos] = useState<CatalogoI[]>([]);
  const [generadores, setGeneradores] = useState<CatalogoI[]>([]);
  const [areas, setAreas] = useState<CatalogoI[]>([]);
  const [materias, setMateria] = useState<CatalogoI[]>([])

  //estadisticas
  const [cantidades, setCantidades] = useState<string[]>([]);
  const [descripciones, setDescripciones] = useState<string[]>([]);

  const [estadisticas, setEstadisticas] =
    useState<ResiduoEspecialNumEstadistica>({
      total_acumulado: 0,
      registros: 0,
      tipox_residuo: 0,
    })

  const [filtros, setFiltros] = useState<ResiduoFiltroEstadistica>({
    tipoFecha: null,
    fRangos: null,
    tipo_residuo: [],
    tipo_generador: [],
    area_generacion: [],
    agregacion_materia: []
  })

  //tipo de fecha
  const [tipoFecha, setTipoFecha] = useState<CatalogoI[]>([])

  //listado
  const [data, setData] = useState<ResiduoListadoEstadistica[]>([])

  //grafica
  const chartRef = useRef<ReactECharts>(null)

  //schema
  const schema = z.object({

    tipoMateria: z.array(z.number()),

    tipoFecha: z.string().refine((val) => val !== null && val !== "", {
      message: "Selecciona un tipo de fecha",
    }),

    tipoResiduo: z.array(z.number()),

    tipoGenerador: z.array(z.number()),

    tipoArea: z.array(z.number()),

    fRangos: z.object({
      from: z.string().min(1, "La fecha inicial es requerida"),
      to: z.string().min(1, "La fecha final es requerida"),
    }),

    tipoExportacion: z.string(),
  })

  type FormValues = z.infer<typeof schema>

  //useform
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipoFecha: "",
      fRangos: {
        from: "",
        to: "",
      },
      tipoResiduo: [],
      tipoGenerador: [],
      tipoArea: [],
      tipoExportacion: "",
    },
    mode: "onBlur",
  })

  const values = form.watch()

  useEffect(() => {
    cargarCatalogos()
    cargarEstadistica()
  }, [])

  useEffect(() => {
    cargarListado()
  }, [filtros])

  //carga los diferentes catalogos que no dependen de otro
  const cargarCatalogos = async () => {

    const [resultado2, resultado3] = await Promise.all([
      listadoTipoGeneradorRP(),
      listadoAgregacionMateria()
    ])
    if (resultado2.data) {
      setGeneradores(resultado2.data)
      setMateria(resultado3.data)
    }

    setTipoFecha([
      {
        id: 1,
        descripcion: "Fecha de Entrada",
        created_at: new Date(),
        updated_at: null,
      },
      {
        id: 2,
        descripcion: "Fecha de Salida",
        created_at: new Date(),
        updated_at: null,
      },
    ])

    
  }

  //carga las estadisticas totales
  const cargarEstadistica = async () => {
    setDescripciones([])
    setCantidades([])

    const dataToSend = {
      tipoFecha: String(values.tipoFecha),
      fRangos: values.fRangos,
      tipo_residuo: values.tipoResiduo,
      tipo_generador: values.tipoGenerador,
      area_generacion: values.tipoArea,
      agregacion_materia: values.tipoMateria
    }

    //guarda los filtros en un state
    setFiltros(dataToSend)

    const cantidades: string[] = []
    const descripciones: string[] = []

    let totalAcumulado = 0
    let tipoxResiduo = 0

    const result = await crearEstadisticoPeligroso(dataToSend)
    const data: ResiduoPeligrosoEstadistica[] = result.data

    data.forEach((element) => {
      cantidades.push(String(element.cantidad_total))
      descripciones.push(element.descripcion)

      totalAcumulado += Number(element.cantidad_total)
      tipoxResiduo += Number(element.totalx_residuo)
    })

    setDescripciones(descripciones)
    setCantidades(cantidades)

    setEstadisticas({
      total_acumulado: totalAcumulado,
      registros: tipoxResiduo,
      tipox_residuo: data.length,
    })
  }

  //guarda la información
  const onSubmit: SubmitHandler<FormValues> = async () => {
    try {
      await cargarEstadistica()
    } catch (ex) {
      toast(
        "Ocurrio un error, vaya esto es incomodo", //error
        {
          icon: <MessageCircleWarning className="text-rojito" />,
          className: "bg-white !text-negrito !font-bold border !shadow-sm",
        }
      )
    }
  }

  //exporta la grafica en pdf y xlsx
  const exportarGrafica = () => {
    const timestamp = Date.now()

    const echartsInstance = chartRef.current?.getEchartsInstance()

    if (!echartsInstance) return

    // imagen del chart
    const img = echartsInstance.getDataURL({
      type: "png",
      pixelRatio: 1,
      backgroundColor: "#fff",
    })

    // PDF
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    // tamaños página
    const pageWidth = pdf.internal.pageSize.getWidth()

    // márgenes
    const margin = 10

    // posiciones gráfica
    const chartY = 25
    const chartHeight = 120
    const chartWidth = pageWidth - margin * 2

    // título
    pdf.setFontSize(16)
    pdf.text("Reporte de Residuos Peligrosos", margin, 15)

    // gráfica
    pdf.addImage(img, "PNG", margin, chartY, chartWidth, chartHeight)

    // columnas automáticas
    const columns = data.length > 0 ? Object.keys(data[0]) : []

    // tabla
    autoTable(pdf, {
      startY: chartY + chartHeight + 10,

      head: [columns],

      body: data.map((row: any) => columns.map((col) => row[col])),

      styles: {
        fontSize: 8,
        cellPadding: 2,
      },

      headStyles: {
        fillColor: [41, 128, 185],
      },

      margin: {
        left: margin,
        right: margin,
      },

      theme: "grid",
    })

    // guardar pdf
    pdf.save(`ResiduosPeligrosos_${timestamp}.pdf`)

    //excel
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos")
    XLSX.writeFile(workbook, `ResiduosPeligrosos_${timestamp}.xlsx`)
  }

  const generarColorPastel = () => {
    const hue = Math.floor(Math.random() * 360)
    return `hsl(${hue}, 65%, 78%)`
  }

  const option: EChartsOption = {
    title: {
      text: "Acumulación por Residuo (kg)",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {},
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: "category",
      data: descripciones,
    },
    series: [
      {
        name: "",
        type: "bar",
        label: {
          show: true,
          position: "right",
          formatter: ({ value }) => `${value} kg`,
        },
        data: cantidades.map((value) => ({
          value,
          itemStyle: {
            color: generarColorPastel(),
          },
        })),
      },
    ],
  }

  const cargarListado = async () => {
    const result = await creaReporteListadoPeligroso(filtros)
    if (result) {
      setData(result.data)
    }
  }

  const cargarCatalogoNombreResiduo = async (ids: number[]) => {
    setResiduos([])
    const result = await listadoAgregacionMateriaMultiple(ids)
    console.log({result})
    if (result) {
      setResiduos(result.data)
    }
  }

  const cargarCatalogoArea = async (ids: number[]) => {
    setAreas([])
    const result = await listadoAreaGeneracionMultiple(ids)
    if (result) {
      setAreas(result.data)
    }
  }

  useEffect(() => {
    cargarCatalogoArea(values.tipoGenerador)
  }, [values.tipoGenerador])

   useEffect(() => {
    cargarCatalogoNombreResiduo(values.tipoMateria)
  }, [values.tipoMateria])


  return (
    <div className="p-5">
      {/* Buscador */}
      <Card tabIndex={0} className="h-full w-full shadow-md">
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="mx-auto grid grid-cols-1 gap-5 p-4 md:grid-cols-3">
              
              {/* TipoFecha */}
              <Controller
                name="tipoFecha"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[13px] font-bold text-negrito">
                        Seleccione tipo de Fecha
                      </FieldLabel>

                      <Combobox
                        items={tipoFecha}
                        value={field.value ?? ""}
                        onValueChange={(value) => field.onChange(value)}
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

              {/* Fecha de entrada */}
              <Controller
                name="fRangos"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="fRangos"
                      className="text-[13px] font-bold text-negrito"
                    >
                      Rango de Fechas
                    </FieldLabel>

                    <Popover>
                      <PopoverTrigger>
                        <div
                          className="flex h-8 w-full cursor-pointer items-center rounded-lg border border-input bg-transparent px-2.5 py-1 text-left text-base text-placeholder transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm"
                          aria-invalid={fieldState.invalid}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {field.value?.from ? (
                            field.value?.to ? (
                              <>
                                {format(
                                  new Date(field.value.from + "T00:00:00"),
                                  "dd/MM/yyyy"
                                )}{" "}
                                -{" "}
                                {format(
                                  new Date(field.value.to + "T00:00:00"),
                                  "dd/MM/yyyy"
                                )}
                              </>
                            ) : (
                              format(
                                new Date(field.value.from + "T00:00:00"),
                                "dd/MM/yyyy"
                              )
                            )
                          ) : (
                            "Selecciona un rango ..."
                          )}
                        </div>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="range"
                          numberOfMonths={2}
                          selected={
                            field.value
                              ? {
                                  from: field.value.from
                                    ? new Date(field.value.from + "T00:00:00")
                                    : undefined,
                                  to: field.value.to
                                    ? new Date(field.value.to + "T00:00:00")
                                    : undefined,
                                }
                              : undefined
                          }
                          defaultMonth={
                            field.value?.from
                              ? new Date(field.value.from + "T00:00:00")
                              : new Date()
                          }
                          onSelect={(range) => {
                            field.onChange({
                              from: range?.from
                                ? `${range.from.getFullYear()}-${String(
                                    range.from.getMonth() + 1
                                  ).padStart(2, "0")}-${String(
                                    range.from.getDate()
                                  ).padStart(2, "0")}`
                                : "",

                              to: range?.to
                                ? `${range.to.getFullYear()}-${String(
                                    range.to.getMonth() + 1
                                  ).padStart(2, "0")}-${String(
                                    range.to.getDate()
                                  ).padStart(2, "0")}`
                                : "",
                            })
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

              {/* Tipo de Materia */}
              <Controller
                name="tipoMateria"
                control={form.control}
                defaultValue={[]}
                render={({ field, fieldState }) => {
                  const selectedValues: number[] = field.value || []

                  const toggleItem = (id: number) => {
                    if (selectedValues.includes(id)) {
                      field.onChange(
                        selectedValues.filter((item: number) => item !== id)
                      )
                    } else {
                      field.onChange([...selectedValues, id])
                    }
                  }

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[13px] font-bold text-negrito">
                        Tipo Residuo
                      </FieldLabel>

                      <Popover>
                        <PopoverTrigger>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="min-h-[32px] w-full justify-between bg-white"
                          >
                            <div className="flex h-full flex-wrap gap-1 overflow-auto">
                              {selectedValues.length > 0 ? (
                                selectedValues.map((id: number) => {
                                  const materia = materias?.find(
                                    (item) => Number(item.id) === id
                                  )

                                  return (
                                    <Badge key={id} variant="ghost">
                                      {materia?.descripcion}
                                    </Badge>
                                  )
                                })
                              ) : (
                                <span className="text-muted-foreground">
                                  Selecciona uno o mas tipo de residuo...
                                </span>
                              )}
                            </div>

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar residuo..." />

                            <CommandList>
                              <CommandEmpty>
                                No se encontraron resultados.
                              </CommandEmpty>

                              <CommandGroup>
                                {/* Seleccionar todo */}
                                <CommandItem
                                  onSelect={() => {
                                    const todos =
                                      residuos?.map((item) =>
                                        Number(item.id)
                                      ) || []

                                    const todosSeleccionados =
                                      selectedValues.length === todos.length

                                    field.onChange(
                                      todosSeleccionados ? [] : todos
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedValues.length === residuos?.length
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  SELECCIONAR TODO
                                </CommandItem>

                                {/* Lista */}
                                {materias?.map((item) => (
                                  <CommandItem
                                    key={Number(item.id)}
                                    value={String(item.descripcion)}
                                    onSelect={() => toggleItem(Number(item.id))}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedValues.includes(Number(item.id))
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />

                                    {item.descripcion}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {fieldState.error && (
                        <FieldError className="text-rojito">
                          {fieldState.error.message}
                        </FieldError>
                      )}
                    </Field>
                  )
                }}
              />

              {/* Nombre de Residuo */}
              <Controller
                name="tipoResiduo"
                control={form.control}
                defaultValue={[]}
                render={({ field, fieldState }) => {
                  const selectedValues: number[] = field.value || []

                  const toggleItem = (id: number) => {
                    if (selectedValues.includes(id)) {
                      field.onChange(
                        selectedValues.filter((item: number) => item !== id)
                      )
                    } else {
                      field.onChange([...selectedValues, id])
                    }
                  }

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[13px] font-bold text-negrito">
                        Nombre Residuo
                      </FieldLabel>

                      <Popover>
                        <PopoverTrigger>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="min-h-[32px] w-full justify-between bg-white"
                          >
                            <div className="flex h-full flex-wrap gap-1 overflow-auto">
                              {selectedValues.length > 0 ? (
                                selectedValues.map((id: number) => {
                                  const residuo = residuos?.find(
                                    (item) => Number(item.id) === id
                                  )

                                  return (
                                    <Badge key={id} variant="ghost">
                                      {residuo?.descripcion}
                                    </Badge>
                                  )
                                })
                              ) : (
                                <span className="text-muted-foreground">
                                  Selecciona uno o más residuos...
                                </span>
                              )}
                            </div>

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar residuo..." />

                            <CommandList>
                              <CommandEmpty>
                                No se encontraron resultados.
                              </CommandEmpty>

                              <CommandGroup>
                                {/* Seleccionar todo */}
                                <CommandItem
                                  onSelect={() => {
                                    const todos =
                                      residuos?.map((item) =>
                                        Number(item.id)
                                      ) || []

                                    const todosSeleccionados =
                                      selectedValues.length === todos.length

                                    field.onChange(
                                      todosSeleccionados ? [] : todos
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedValues.length === residuos?.length
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  SELECCIONAR TODO
                                </CommandItem>

                                {/* Lista */}
                                {residuos?.map((item) => (
                                  <CommandItem
                                    key={Number(item.id)}
                                    value={String(item.descripcion)}
                                    onSelect={() => toggleItem(Number(item.id))}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedValues.includes(Number(item.id))
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />

                                    {item.descripcion}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {fieldState.error && (
                        <FieldError className="text-rojito">
                          {fieldState.error.message}
                        </FieldError>
                      )}
                    </Field>
                  )
                }}
              />

              {/* Tipo de Generador */}
              <Controller
                name="tipoGenerador"
                control={form.control}
                defaultValue={[]}
                render={({ field, fieldState }) => {
                  const selectedValues: number[] = field.value || []

                  const toggleItem = (id: number) => {
                    if (selectedValues.includes(id)) {
                      field.onChange(
                        selectedValues.filter((item: number) => item !== id)
                      )
                    } else {
                      field.onChange([...selectedValues, id])
                    }
                  }

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[13px] font-bold text-negrito">
                        Generador
                      </FieldLabel>

                      <Popover>
                        <PopoverTrigger>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="min-h-[32px] w-full justify-between bg-white"
                          >
                            <div className="flex h-full flex-wrap gap-1 overflow-auto">
                              {selectedValues.length > 0 ? (
                                selectedValues.map((id: number) => {
                                  const generador = generadores?.find(
                                    (item) => Number(item.id) === id
                                  )

                                  return (
                                    <Badge key={id} variant="ghost">
                                      {generador?.descripcion}
                                    </Badge>
                                  )
                                })
                              ) : (
                                <span className="text-muted-foreground">
                                  Selecciona uno o más generadores...
                                </span>
                              )}
                            </div>

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar residuo..." />

                            <CommandList>
                              <CommandEmpty>
                                No se encontraron resultados.
                              </CommandEmpty>

                              <CommandGroup>
                                {/* Seleccionar todo */}
                                <CommandItem
                                  onSelect={() => {
                                    const todos =
                                      generadores?.map((item) =>
                                        Number(item.id)
                                      ) || []

                                    const todosSeleccionados =
                                      selectedValues.length === todos.length

                                    field.onChange(
                                      todosSeleccionados ? [] : todos
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedValues.length ===
                                        generadores?.length
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  SELECCIONAR TODO
                                </CommandItem>

                                {/* Lista */}
                                {generadores?.map((item) => (
                                  <CommandItem
                                    key={Number(item.id)}
                                    value={String(item.descripcion)}
                                    onSelect={() => toggleItem(Number(item.id))}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedValues.includes(Number(item.id))
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />

                                    {item.descripcion}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {fieldState.error && (
                        <FieldError className="text-rojito">
                          {fieldState.error.message}
                        </FieldError>
                      )}
                    </Field>
                  )
                }}
              />

              {/* Tipo de Area */}
              <Controller
                name="tipoArea"
                control={form.control}
                defaultValue={[]}
                render={({ field, fieldState }) => {
                  const selectedValues: number[] = field.value || []

                  const toggleItem = (id: number) => {
                    if (selectedValues.includes(id)) {
                      field.onChange(
                        selectedValues.filter((item: number) => item !== id)
                      )
                    } else {
                      field.onChange([...selectedValues, id])
                    }
                  }

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-[13px] font-bold text-negrito">
                        Área de Generación
                      </FieldLabel>

                      <Popover>
                        <PopoverTrigger>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="min-h-[32px] w-full justify-between bg-white"
                          >
                            <div className="flex h-full flex-wrap gap-1 overflow-auto">
                              {selectedValues.length > 0 ? (
                                selectedValues.map((id: number) => {
                                  const area = areas?.find(
                                    (item) => Number(item.id) === id
                                  )

                                  return (
                                    <Badge key={id} variant="ghost">
                                      {area?.descripcion}
                                    </Badge>
                                  )
                                })
                              ) : (
                                <span className="text-muted-foreground">
                                  Selecciona uno o más áeas...
                                </span>
                              )}
                            </div>

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar residuo..." />

                            <CommandList>
                              <CommandEmpty>
                                No se encontraron resultados.
                              </CommandEmpty>

                              <CommandGroup>
                                {/* Seleccionar todo */}
                                <CommandItem
                                  onSelect={() => {
                                    const todos =
                                      generadores?.map((item) =>
                                        Number(item.id)
                                      ) || []

                                    const todosSeleccionados =
                                      selectedValues.length === todos.length

                                    field.onChange(
                                      todosSeleccionados ? [] : todos
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedValues.length ===
                                        generadores?.length
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  SELECCIONAR TODO
                                </CommandItem>

                                {/* Lista */}
                                {areas?.map((item) => (
                                  <CommandItem
                                    key={Number(item.id)}
                                    value={String(item.descripcion)}
                                    onSelect={() => toggleItem(Number(item.id))}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedValues.includes(Number(item.id))
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />

                                    {item.descripcion}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

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
              className="mt-4 ml-4 cursor-pointer bg-[#239954] p-4 hover:bg-[#52BE80] focus:bg-[#52BE80] focus:outline-none"
            >
              <Search />
              <span>Generar Reporte</span>
            </Button>

            <Button
              onClick={form.handleSubmit(exportarGrafica)}
              className="mt-4 ml-4 cursor-pointer p-4 hover:bg-[#5D86A6] focus:bg-[#5D86A6] focus:outline-none"
            >
              <ImageDown />
              <span>Exportar</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Graficas */}
      <Card className="mt-2 h-full w-full shadow-md">
        <CardContent>
          {/* Estadisticas */}
          <div className="flex p-4">
            <ChartBarBig className="ml-3 text-azulito" />
            <p className="ml-3 text-lg font-bold text-azulito">
              Resultados del Reporte
            </p>

            <div className="ml-auto flex gap-3">
              <div
                tabIndex={0}
                className="flex h-[50px] w-[140px] items-center justify-center rounded bg-azulito text-center font-bold text-white shadow-md transition-transform duration-200 outline-none hover:-translate-y-2"
              >
                <div>
                  <p className="mx-auto text-center text-[18px]">
                    {estadisticas.total_acumulado} Kg
                  </p>
                  <p className="text-[12px] font-thin"> Total Acumulado </p>
                </div>
              </div>

              <div
                tabIndex={0}
                className="flex h-[50px] w-[140px] items-center justify-center rounded bg-verdecito text-center font-bold text-white shadow-md transition-transform duration-200 outline-none hover:-translate-y-2"
              >
                <div>
                  <p className="mx-auto text-center text-[18px]">
                    {estadisticas.registros}
                  </p>
                  <p className="text-[12px] font-thin"> Registros </p>
                </div>
              </div>

              <div
                tabIndex={0}
                className="flex h-[50px] w-[140px] items-center justify-center rounded bg-emerald-600 text-center font-bold text-white shadow-md transition-transform duration-200 outline-none hover:-translate-y-2"
              >
                <div>
                  <p className="mx-auto text-center text-[18px]">
                    {estadisticas.tipox_residuo}
                  </p>
                  <p className="text-[12px] font-thin"> Tipos de Residuo </p>
                </div>
              </div>
            </div>
          </div>

          {/* Graficas */}
          <ReactECharts
            ref={chartRef}
            option={option}
            style={{ height: "500px", width: "100%" }}
            opts={{ renderer: "canvas" }}
            theme="vintage"
          />

          {/* Listado */}

          <ListadoResiduoPeligroso data={data} />
        </CardContent>
      </Card>
    </div>
  )
}

export default Reporte1
