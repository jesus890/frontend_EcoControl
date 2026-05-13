import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { ArrowBigDownDash } from 'lucide-react';
import { Loader } from 'lucide-react';

import { Field, FieldGroup } from "@/components/ui/field";
import type { ReporteI, ResiduoSolido2PdfI } from "@/interfaces/interfaces";
import { generarReporteRME } from "../api/service";


interface PropI {
  open: boolean,
  setOpen: (prev: boolean) => void;
  data : ResiduoSolido2PdfI
}

export function DialogSolidoUrbano2({open, setOpen, data } : PropI) {

  const [reporteData, setReporteData] = useState<ReporteI>();
  const [loading, setLoading] = useState<Boolean>(false);


  useEffect(()=> {
    if(open)
      getReporte();
  },[open])


  const getReporte = async() => {
    const result = await generarReporteRME(data);
    setReporteData(result.data);
  }

  const descargarFicha = async() => {
    try
    {
      setLoading(true);
      await sleep(4000); // 4 segundos
      downloadBase64Pdf(reporteData?.pdf_blob);
    }
    catch(ex)
    {
      console.log({ex});
    }
    finally
    {
      setLoading(false);
    }
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  function downloadBase64Pdf (base64 : any, fileName = "reporte.pdf") {
    const cleanBase64 = base64.replace(/^data:application\/pdf;base64,/, "");
    const binaryString = atob(cleanBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl shadow-md ">
          
          <DialogHeader className="p-4">
            <DialogTitle className="text-azulito font-bold">Vale de Disposición — Residuo de Manejo Especial</DialogTitle>
          </DialogHeader>

          <FieldGroup >
            <Field className="p-0">
              <img className="w-full h-full" src={reporteData?.photo_blob} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose >
              <Button >Cancel</Button>
            </DialogClose>
            <Button className="cursor-pointer hover:bg-[#A94438] focus:bg-[#A94438] focus:outline-none bg-[#922b21]" onClick={()=> descargarFicha()}>
              {loading ? <Loader className="animate-spin"/>  : <ArrowBigDownDash />}
              <span>Descargar Ficha</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      
    </Dialog>
  )
}