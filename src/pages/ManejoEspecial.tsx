import {useState, useEffect} from "react";

import { CirclePlus } from 'lucide-react';

//card
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

//field
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

//select
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
import { Textarea } from "@/components/ui/textarea"

//validaciones y forms
import { useForm, Controller } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { NavBarCustom } from "@/components/navbar-custom"

import type { CatalogoI } from "@/interfaces/interfaces";
import {listadoAreaGeneracion , listadoTipoEnvases, listadoTipoGenerador, listadoTipoResiduo  } from "../api/service";


export function ManejoEspecial() {
  

  const [envases, setEnvases] = useState<CatalogoI[]>([]);
  const [generadores, setGeneradores] = useState<CatalogoI[]>([]);
  const [areas, setAreas] = useState<CatalogoI[]>([]);
  const [tipoResiduo, setTipoResiduo] = useState<CatalogoI[]>([]);

  useEffect(() => {
    cargarCatalogos();
  }, [])


  const cargarCatalogos = async()=> {

    const [envases, generadores, areas, residuos] = await Promise.all([
      listadoTipoEnvases(),
      listadoTipoGenerador(),
      listadoAreaGeneracion(),
      listadoTipoResiduo()
    ])

    setEnvases(envases.data);
    setGeneradores(generadores.data);
    setAreas(areas.data);
    setTipoResiduo(residuos.data);
  }
  

  //schema
  const schema = z.object({
    tipoResiduo: z.string().min(1, "Selecciona un tipo de residuo"),

    cantidad: z
      .number({ error: "La cantidad debe ser un número" })
      .positive("La cantidad debe ser mayor a 0"),

    tipoGenerador: z.string().min(1, "Selecciona un tipo de generador"),

    tipoArea: z.string().min(1, "Selecciona una área"),

    fEntrada: z.date().min(new Date(), { error: "Fecha invalida" }),

    fSalida: z.date().min(new Date(), { error: "Fecha invalida" }),

    observaciones: z.string()
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
      observaciones: ""
    },
    mode: "onBlur",
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data)
  }

  return (
    <>
      <NavBarCustom />
      <div className="p-5">
        <Card tabIndex={0} className="h-[76vh] w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-[16px] font-bold text-azulito">
              Registro de Residuos de Manejo Especial
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="mx-auto grid grid-cols-1 gap-5 p-4 md:grid-cols-3">
                
                {/* Tipo del residuo */}
                <Controller
                  name="tipoResiduo"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="tipoResiduo"
                        className="text-[13px] font-bold text-negrito"
                      >
                        Tipo de Residuo *
                      </FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="tipoResiduo">
                          <SelectValue placeholder="Selecciona tipo ..." />
                        </SelectTrigger>

                        <SelectContent className="w-full!">
                          <SelectGroup>
                            {tipoResiduo.map((item) => (
                              <SelectItem key={Number(item.id)} value={item.descripcion}>
                                {item.descripcion}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {fieldState.error && (
                        <FieldError className="text-rojito">
                          {fieldState.error.message}
                        </FieldError>
                      )}
                    </Field>
                  )}
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

               

                {/* TipoGenerador */}
                <Controller
                  name="tipoGenerador"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="tipoGenerador"
                        className="text-[13px] font-bold text-negrito"
                      >
                        Tipo de Generador *
                      </FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="tipoEnvase">
                          <SelectValue placeholder="Selecciona un envase" />
                        </SelectTrigger>

                        <SelectContent className="w-full!">
                          <SelectGroup>
                            {generadores.map((item) => (
                              <SelectItem key={Number(item.id)} value={item.descripcion}>
                                {item.descripcion}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {fieldState.error && (
                        <FieldError className="text-rojito">
                          {fieldState.error.message}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* TipoArea */}
                <Controller
                  name="tipoArea"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="tipoArea"
                        className="text-[13px] font-bold text-negrito"
                      >
                        Área de Generación *
                      </FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="tipoEnvase">
                          <SelectValue placeholder="Selecciona un envase" />
                        </SelectTrigger>

                        <SelectContent className="w-full!">
                          <SelectGroup>
                            {areas.map((item) => (
                              <SelectItem key={Number(item.id)} value={item.descripcion}>
                                {item.descripcion}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

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

                      <Popover >
                        <PopoverTrigger>
                          <div
                            className="h-8 w-full rounded-lg text-placeholder text-left border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
                            aria-invalid={fieldState.invalid}
                          >
                            {field.value
                              ? field.value.toLocaleDateString()
                              : "Select date"}
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
                        Fecha de Entrada *
                      </FieldLabel>

                      <Popover >
                        <PopoverTrigger>
                          <div
                            className="h-8 w-full rounded-lg text-placeholder text-left border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
                            aria-invalid={fieldState.invalid}
                          >
                            {field.value
                              ? field.value.toLocaleDateString()
                              : "Select date"}
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

                {/* Observaciones */}
                <Controller
                  name="observaciones"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="observaciones"
                        className="text-[13px] font-bold text-negrito"
                      >
                        Observaciones
                      </FieldLabel>

                      <Textarea
                        id="observaciones"
                        placeholder="Ej. Notas adicionales sobre el residuo..."
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

              <Button  type="submit" className="hover:bg-red-500 focus:bg-red-500 focus:outline-none cursor-pointer">
                <CirclePlus />
                <span>Registrar Residuos</span>
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default ManejoEspecial
