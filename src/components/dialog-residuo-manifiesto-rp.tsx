import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ReporteI, ManifiestoPeligrosoPDF } from "@/interfaces/interfaces"
import { generarReporteManifiestoRP } from "../api/service"
import { ArrowBigDownDash } from "lucide-react"
import { Loader } from "lucide-react"
import { Printer } from "lucide-react"

interface PropI {
  data: ManifiestoPeligrosoPDF
  open: boolean
  setOpen: (prev: boolean) => void
}

export function DialogResiduoPeligrosoManfiesto({
  data,
  open,
  setOpen,
}: PropI) {
  const [reporteData, setReporteData] = useState<ReporteI>()
  const [loading, setLoading] = useState<Boolean>(false)

  useEffect(() => {
    if (open) getReporte()
  }, [open])

  const getReporte = async () => {
    const result = await generarReporteManifiestoRP(data)
    console.log({ data })
    setReporteData(result.data)
  }

  const descargarFicha = async () => {
    try {
      setLoading(true)
      await sleep(4000) // 4 segundos
      downloadBase64Pdf(reporteData?.pdf_blob)
    } catch (ex) {
      console.log({ ex })
    } finally {
      setLoading(false)
    }
  }

  const imprimirFicha = async () => {
    try {
      setLoading(true)
      await sleep(4000) // 4 segundos
      printPDF(reporteData?.pdf_blob)
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

  function printPDF(base64: any) {
    const cleanBase64 = base64.replace(/^data:application\/pdf;base64,/, "")
    const binaryString = atob(cleanBase64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const blob = new Blob([bytes], { type: "application/pdf" })
    const blobUrl = URL.createObjectURL(blob)

    // Crear iframe oculto
    const iframe: HTMLIFrameElement = document.createElement("iframe")

    iframe.style.position = "fixed"
    iframe.style.right = "0"
    iframe.style.bottom = "0"
    iframe.style.width = "0"
    iframe.style.height = "0"
    iframe.style.border = "0"

    iframe.src = blobUrl

    document.body.appendChild(iframe)

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
      }, 1000)

      // Limpiar recursos
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl)
        document.body.removeChild(iframe)
      }, 1000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[90vh] w-full max-w-2xl flex-col">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="font-bold text-azulito">
            Vista Previa Manifiesto
          </DialogTitle>
        </DialogHeader>

        {/* CONTENIDO */}

        <iframe className="h-full w-full" src={reporteData?.pdf_blob} />

        {/* FOOTER FIJO */}
        <DialogFooter className="border-t p-4">
          <Button
            className="cursor-pointer bg-[#922b21] hover:bg-[#A94438] focus:bg-[#A94438] focus:outline-none"
            onClick={() => descargarFicha()}
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <ArrowBigDownDash />
            )}
            <span>Descargar Ficha</span>
          </Button>

          <Button
            onClick={() => imprimirFicha()}
            className="cursor-pointer p-4 hover:bg-[#5D86A6] focus:bg-[#5D86A6] focus:outline-none"
          >
            {loading ? <Loader className="animate-spin" /> : <Printer />}
            <span>Imprimir Ficha</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
