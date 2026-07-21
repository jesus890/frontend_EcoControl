import { useState, useEffect, useRef } from "react";

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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//endpoint
import {
  crearSalidaResiduos,
  generarReporteResiduoPeligroso,
  generarReporteRME
} from "@/api/service";

//interfaces
import type { ResiduoPeligroPdfI, ResiduoSolido2PdfI,  ReporteI } from "@/interfaces/interfaces";

import { toast } from "sonner";
import { MessageCircleCheck } from "lucide-react";
import { MessageCircleWarning } from "lucide-react";

import { Html5QrcodeScanner } from "html5-qrcode";

import { Checkbox } from "@/components/ui/checkbox";


export function Trazabilidad() {

  const inputRef = useRef<HTMLInputElement>(null)

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
  const [loadingImg, setLoadingImg] = useState<Boolean>(false);
  const [manifiestoIndependiente, setManifiestoIndependiente] = useState<boolean>(false);
  

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try 
    {
      if (data.folio.length < 9) {
        return
      }

      setLoadingImg(true)

      setReporteData({
        photo_blob: "",
        pdf_blob: "",
      })

  
      //actualiza la salida y num manifiesto
      const result = await crearSalidaResiduos(data.folio, manifiestoIndependiente)


      if (result.result == false) 
      {
        toast(
          result.message, //error
          {
            icon: <MessageCircleWarning className="text-rojito" />,
            className: "bg-white !text-negrito !font-bold border !shadow-sm",
          }
        )
      } 
      else result.result && result.data 
      {

        if(result.message == "Reporte Peligroso!")
        {
          const dataToGeneratePDF: ResiduoPeligroPdfI = {
            descMateria: "",
            descResiduo: result.data.descResiduo,
            descSubTipoResiduo: result.data.descSubTipoResiduo,
            descGenerador: result.data.descGenerador,
            descArea: result.data.descArea,
            cantidad: result.data.cantidad,
            fEntrada: result.data.fecha_entrada,
            fSalida: result.data.fecha_salida,
            uuid: result.data.uuid,
            numManifiesto: result.data.numero_manifiesto
          }

          const result2 = await generarReporteResiduoPeligroso(dataToGeneratePDF);
          setReporteData(result2.data);
        }
        else if(result.message == "Reporte Especial!")
        {
          const data2ToGeneratePDF : ResiduoSolido2PdfI = {
            nombreResiduo: result.data.residuo,
            descGenerador: result.data.generador,
            descArea: result.data.area,
            cantidad: result.data.cantidad,
            fEntrada: result.data.fechaEntrada,
            fSalida: result.data.fechaSalida,
            descTransportistas: result.data.transportista,
            descTratamiento: result.data.tratamiento,
            manifiesto: result.data.manifiesto
          }

          const result3 = await generarReporteRME(data2ToGeneratePDF);
          setReporteData(result3.data);
        }
        
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
    } finally {
      setLoadingImg(false)
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
                          autoFocus
                          type="text"
                          placeholder="MML-RP-001-2026"
                          className="placeholder:text-placeholder"
                          value={field.value ?? ""}
                          name={field.name}
                          ref={(el) => {
                            field.ref(el)
                            inputRef.current = el
                          }}
                          onBlur={() => {
                            field.onBlur()

                            // Recupera el foco inmediatamente
                            requestAnimationFrame(() => {
                              inputRef.current?.focus()
                            })
                          }}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === "" ? "" : value)
                          }}
                          onKeyDown={(e) => {
                            console.log("Key pressed:", e.key)
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
                    className="mt-2 mb-3 w-full cursor-pointer bg-[#239954] p-4 hover:bg-[#52BE80] focus:bg-[#52BE80] focus:outline-none"
                  >
                    <ScanSearch />
                    <span>Buscar</span>
                  </Button>

                  <div id="reader" className="mt-3 w-full max-w-md" />

                  <div className="mt-2">
                    <Field orientation="horizontal">
                      <Checkbox id="toggle-checkbox" name="toggle-checkbox"  checked={manifiestoIndependiente} onCheckedChange={setManifiestoIndependiente} />
                      <FieldLabel htmlFor="toggle-checkbox" className="font-bold"> Manifiesto independiente  </FieldLabel>
                    </Field>
                  </div>


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

                    {loadingImg && (
                      <div className="bg-opacity-50 absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-white">
                        <Loader className="anime-pulse size-10 animate-spin text-[#3D4242]" />
                      </div>
                    )}

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
