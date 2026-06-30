import { useState } from "react";
import { LogIn, Mail, MessageCircleWarning, MessageCircleCheck, InfoIcon } from "lucide-react"

//Toast
import { toast } from "sonner"

//validaciones y forms
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

//field
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import { Button } from "@/components/ui/button"

import { contrasenaOlvidada } from "@/api/service"

import { Toaster } from "@/components/ui/sonner"

import LogoGeosoftsolutions from "../assets/smc.png"


function RestorePassword() {
  
  const [loading, setLoading] = useState(false)

  const schema = z.object({
    email: z.email("Correo electrónico inválido")
  })

  type FormValues = z.infer<typeof schema>

  //inicializacion de variables
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: ""
    },
    mode: "onBlur",
  })


  //procede a iniciar sesion
  const onSubmit = async (data: any) => {
    try {

      const response = await contrasenaOlvidada(data);
      setLoading(true);

      
      //si las credenciales son invalidas
      if (!response.result) {
        toast(response.message, {
          icon: <MessageCircleWarning className="text-rojito" />,
          className: "bg-white !text-negrito !font-bold border !shadow-sm",
        })
      }
      else if (response.result) {
        toast(response.message, {
          icon: <MessageCircleCheck className="text-verdecito" />,
          className: "bg-white !text-negrito !font-bold border !shadow-sm",
        })
      }      
    } catch (error) {

      console.log({ error })

    } finally {
      //limpia los valores
      form.reset();
      setLoading(false);
    }
  }

  return (
    <div className="h-[100vh] w-full rounded-lg bg-azulito shadow-xl">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="h-[calc(82vh)] w-[35vw] rounded-lg border-gray-700 bg-white shadow-xl">
          <div className="space-y-4 p-6 sm:p-4 md:space-y-4">
            <img
              className="mx-auto h-auto w-[220px]"
              src={LogoGeosoftsolutions}
              alt="logo"
            />

      <Toaster />

      <h1 className="text-blanco text-center text-xl leading-tight font-bold tracking-tight md:text-2xl">
        ¿Ha olvidado su contraseña?
      </h1>

      <form
        className="space-y-4 md:space-y-6 flex flex-col h-[calc(55vh)]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="bg-inputs flex w-full rounded-lg border border-gray-700 p-3 shadow-lg">
          <InfoIcon className="mt-1 mr-3 h-12 w-12 text-[#C3A536]" />
          <p className="text-blanco text-justify text-[12px]">
            No se preocupe, le puede ocurrir a cualquiera. Simplemente
            introduzca su dirección de correo electrónico, haga clic en
            Siguiente y le enviaremos a su correo electrónico un enlace
            para restablecer la contraseña.
          </p>
        </div>
        
        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="email"
                className="text-[13px] font-bold text-negrito"
              >
                Email *
              </FieldLabel>

              <InputGroup className="bg-inputs w-full rounded-md border border-gray-600 bg-white placeholder:text-placeholder focus:border-[#d4d4d8]">
                <InputGroupAddon align="inline-start">
                  <Mail className="text-[#C3A536]" />
                </InputGroupAddon>

                <InputGroupInput
                  id="email"
                  required
                  type="text"
                  placeholder="Ingresa tu correo electronico"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </InputGroup>

              {fieldState.error && (
                <FieldError className="text-rojito">
                  {fieldState.error.message}
                </FieldError>
              )}
            </Field>
          )}
        />

        <Button
          disabled={loading}
          type="submit"
          className="flex mt-auto  mx-auto w-[60%] cursor-pointer items-center bg-[#cb9636] p-4 hover:bg-[#fcd488] focus:outline-none"
        >
          <LogIn />
          <span className="text-md font-bold text-white"> { loading ? "Enviando enlance..." : "Enviar enlace" } </span>
        </Button>
      </form>

      </div>
      </div>
      </div>
    </div>

    
  )
}

export default RestorePassword
