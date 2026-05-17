import { useState, useEffect } from "react";

import { NavBarCustom } from "@/components/navbar-custom";

//card
import { Card, CardContent } from "@/components/ui/card";

//field
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanSearch } from "lucide-react";

import { ArrowBigDownDash } from "lucide-react";
import { Loader } from "lucide-react";

//validaciones y forms
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

//endpoint
import {
  crearSalidaResiduosPeligroso,
  generarReporteResiduoPeligroso,
} from "@/api/service";

//interfaces
import type { ResiduoPeligroPdfI, ReporteI } from "@/interfaces/interfaces";

import { toast } from "sonner";
import { MessageCircleCheck } from "lucide-react";
import { MessageCircleWarning } from "lucide-react";

import { Html5QrcodeScanner } from "html5-qrcode";

export function Trazabilidad() {
  //schema
  const schema = z.object({
    folio: z.string().min(1, "El folio es obligatorio"),
  })

  type FormValues = z.infer<typeof schema>

  //useform
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      folio: "",
    },
    mode: "onBlur",
  })

  const [dataPdf, setReporteData] = useState<ReporteI>();
  const [loading, setLoading] = useState<Boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {

      setReporteData({
        photo_blob: "",
        pdf_blob: ""
      });

      //actualiza la salida y num manifiesto
      const result = await crearSalidaResiduosPeligroso(data.folio)

      console.log({ result })

      if (result.result == false) {
        toast(
          result.message, //error
          {
            icon: <MessageCircleWarning className="text-rojito" />,
            className: "bg-white !text-negrito !font-bold border !shadow-sm",
          }
        )
      } else result.result && result.data
      {
        const dataToGeneratePDF: ResiduoPeligroPdfI = {
          descResiduo: result.data.descResiduo,
          descSubTipoResiduo: result.data.descSubTipoResiduo,
          descGenerador: result.data.descGenerador,
          descArea: result.data.descArea,
          cantidad: result.data.cantidad,
          fEntrada: result.data.fecha_entrada,
          fSalida: result.data.fecha_salida,
          uuid: result.data.uuid,
          numManifiesto: result.data.numero_manifiesto,
        }

        const result2 = await generarReporteResiduoPeligroso(dataToGeneratePDF)
        setReporteData(result2.data)

        toast(
          result.message, //sucess
          {
            icon: <MessageCircleCheck className="text-verdecito" />,
            className: "bg-white !text-negrito !font-bold border !shadow-sm",
          }
        )
      }
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

  const descargarFicha = async () => {
    try {
      setLoading(true)
      await sleep(4000) // 4 segundos
      downloadBase64Pdf(dataPdf?.pdf_blob)
    } catch (ex) {
      console.log({ ex })
    } finally {
      setLoading(false)
    }
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  function downloadBase64Pdf(base64: any, fileName = "reporte.pdf") {
    const cleanBase64 = base64.replace(/^data:application\/pdf;base64,/, "")
    const binaryString = atob(cleanBase64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const blob = new Blob([bytes], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
  }

  //habilita el QR
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false
    )

    scanner.render(
      (decodedText) => {
        console.log("QR leído:", decodedText)

        form.setValue("folio", decodedText)

        // detener scanner después de leer
        scanner.clear()
      },
      (error) => {
        // errores de lectura continuos
        console.log(error)
      }
    )

    return () => {
      scanner.clear().catch(() => {})
    }
  }, [])

  return (
    <>
      <NavBarCustom />

      <div className="h-full w-full p-5">
        <Card tabIndex={0} className="h-full w-full shadow-md">
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[40%_60%]">
                <div>
                  {/* QR */}
                  <Controller
                    name="folio"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="folio"
                          className="mt-4 text-[13px] font-bold text-negrito"
                        >
                          Folio o Código QR *
                        </FieldLabel>

                        <Input
                          id="folio"
                          placeholder="MML-RP-001-2026"
                          className="placeholder:text-placeholder"
                          value={field.value ?? ""}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === "" ? undefined : value)
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

                  <Button
                    type="submit"
                    className="mt-2 mb-3 w-[80%] cursor-pointer bg-[#239954] p-4 hover:bg-[#52BE80] focus:bg-[#52BE80] focus:outline-none"
                  >
                    <ScanSearch />
                    <span>Buscar</span>
                  </Button>

                  <div id="reader" className="w-full max-w-md" />
                </div>

                {/* IMG */}
                <div className="max-h-[50vh] w-full overflow-y-auto border-l border-dashed border-placeholder">
                  <div className="">
                    <Button
                      onClick={() => descargarFicha()}
                      size="sm"
                      variant="ghost"
                      className="absolute top-30 right-3 bottom-3 h-12 w-12 cursor-pointer rounded-full bg-[#611232] text-white hover:bg-[#7a163f]"
                    >
                      {loading ? (
                        <Loader className="size-10 animate-spin text-white" />
                      ) : (
                        <ArrowBigDownDash className="size-10 text-white" />
                      )}
                    </Button>

                    <img
                      className="w-full object-contain"
                      src={dataPdf?.photo_blob}
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Trazabilidad
