import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import type { ListResiduoPeligrosoManifiestos } from "@/interfaces/interfaces"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DialogResiduoPeligrosoManfiesto } from "./dialog-residuo-manifiesto-rp"

//validaciones y forms
import { useForm, Controller } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

//field
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

interface PropI {
  data: ListResiduoPeligrosoManifiestos
  open: boolean
  setOpen: (prev: boolean) => void
}

export function DialogSeleccionarManifiesto({ data, open, setOpen }: PropI) {

  const [transportista, setTransportista] = useState(0);

  const [openDialog, setDialog] = useState(false);

  const [dataManifiesto, setdataManifiesto] = useState({
    destino_final: "",
    numero_manifiesto: "",
    transportista: 0,
    num_placa: "",
    responsable_recepcion: "",
  })

  useEffect(() => {
    if(data)
    {
      setTransportista(data.destino_final === "TAESA" ? 4 : 6);
      setdataManifiesto({
        destino_final: "",
        numero_manifiesto: "",
        transportista: data.destino_final === "TAESA" ? 4 : 6,
        num_placa: "",
        responsable_recepcion: ""
      })
    }
  }, [data])

  //schema
  const schema = z.object({
    
    responsable2: z.string().refine((val) => val !== null && val !== "", {
      message: "Seleccione un responsable",
    }),

    num_placa: z.string().refine((val) => val !== null && val !== "", {
      message: "Seleccione un responsable",
    }),
  })

  type FormValues = z.infer<typeof schema>

  //inicializacion de variables
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      responsable2: "", //obligatorio
      num_placa: "",
    },
    mode: "onBlur",
  })

  const onSubmit: SubmitHandler<FormValues> = async (preData) => {
    try {
      const dataToSave = {
        destino_final: data.destino_final,
        numero_manifiesto: data.numero_manifiesto,
        transportista: data.destino_final == "BIOS TERRA" ? 6 : transportista,
        num_placa: preData.num_placa,
        responsable_recepcion: preData.responsable2
      }

      setdataManifiesto(dataToSave)
      setDialog(true)
    } catch (ex) {}
  }

  return (
    <div>
      <DialogResiduoPeligrosoManfiesto
        data={dataManifiesto}
        open={openDialog}
        setOpen={setDialog}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="font-bold text-azulito">
              Complemente los datos para el manifiesto
            </DialogTitle>
          </DialogHeader>

          {/* CONTENIDO SCROLLEABLE */}
          {data.destino_final == "TAESA" && (
            <div className="flex-1 overflow-y-auto px-4">
              <RadioGroup
                defaultValue="4"
                className="w-fit"
                onValueChange={(value) => setTransportista(value)}
              >
                <div className="flex items-center gap-3">
                  <Label className="text-bold">
                    Seleccione un transportista
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="4" id="4" />
                  <Label htmlFor="r1">
                    Transportes San Isidro del Norte, S.A de C.V.
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="5" id="5" />
                  <Label htmlFor="r2">Transportes Osoyer S.A. de C.V.</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="mx-auto grid grid-cols-1 gap-5 p-4 md:grid-cols-1">
              {/* Responsable Recepcion */}
              <Controller
                name="responsable2"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="responsable2"
                      className="text-[13px] font-bold text-negrito"
                    >
                      Responsable de la recepción y transporte de los residuos.
                    </FieldLabel>

                    <Input
                      id="responsable2"
                      type="text"
                      placeholder="Escriba el responsable de recepción ..."
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

              {/* Numero de placa */}
              <Controller
                name="num_placa"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="placa"
                      className="text-[13px] font-bold text-negrito"
                    >
                      Número de placa del transportista
                    </FieldLabel>

                    <Input
                      id="num_placa"
                      type="text"
                      placeholder="Número de placa ..."
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
          </form>

          {/* FOOTER FIJO */}
          <DialogFooter className="border-t p-4">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="cursor-pointer hover:bg-[#5D86A6] focus:bg-[#5D86A6] focus:outline-none"
            >
              <span>Generar Manifiesto</span>
            </Button>
            <Button
              className="cursor-pointer bg-[#922b21] hover:bg-[#A94438] focus:bg-[#A94438] focus:outline-none"
              onClick={() => setOpen(false)}
            >
              <span>Cancelar</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
