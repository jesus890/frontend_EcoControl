import React, { useState } from "react"
import {
  LockKeyhole,
  Eye,
  EyeOff,
  LogIn,
  Mail,
  MessageCircleWarning,
} from "lucide-react"
import { useNavigate } from "react-router"

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

import { iniciarSesion } from "@/api/service"

import { Toaster } from "@/components/ui/sonner"

interface IComponent {
  setFirstTime: React.Dispatch<React.SetStateAction<Boolean>>
  setUserEmail: React.Dispatch<React.SetStateAction<String>>
}

function Login({ setFirstTime, setUserEmail }: IComponent) {
    
  const schema = z.object({
    email: z.email("Correo electrónico inválido"),
    password: z.string(),
  })

  type FormValues = z.infer<typeof schema>

  //inicializacion de variables
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  })

  const navigate = useNavigate()

  //inputs password
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)

  //procede a iniciar sesion
  const onSubmit = async (data: any) => {
    try {

      const response = await iniciarSesion(data)

      //si las credenciales son invalidas
      if (!response.result) {
        toast(response.message, {
          icon: <MessageCircleWarning className="text-rojito" />,
          className: "bg-white !text-negrito !font-bold border !shadow-sm",
        })
      }

      //si no ha cambiado su contraseña temporal
      if (response.data.user.email_verification_date == null) {
        setFirstTime(true)
        setUserEmail(response.data.user.email)
      } else //si ya ha cambiado su password por defecto
      {
        //credenciales validas
        if (response.result)
        {
          localStorage.setItem("token", response.data.token)
          navigate("/mml/environment")
        }
      }
    } catch (error) {

      console.log({ error })

    } finally {
      //limpia los valores
      form.reset()
    }
  }

  return (
    <div>

      <Toaster />

      <h1 className="text-blanco text-center text-xl leading-tight font-bold tracking-tight md:text-2xl">
        Iniciar Sesión
      </h1>

      <form
        className="space-y-4 md:space-y-6 flex flex-col h-[calc(55vh)]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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

        {/* password_confirmation */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="password"
                className="text-[13px] font-bold text-negrito"
              >
                Contraseña *
              </FieldLabel>

              <InputGroup className="bg-inputs w-full rounded-md border border-gray-600 bg-white placeholder:text-placeholder focus:border-[#d4d4d8]">
                <InputGroupAddon align="inline-start">
                  <LockKeyhole className="text-[#C3A536]" />
                </InputGroupAddon>

                <InputGroupInput
                  id="password"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />

                <InputGroupAddon
                  align="inline-end"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </InputGroupAddon>
              </InputGroup>

              {fieldState.error && (
                <FieldError className="text-rojito">
                  {fieldState.error.message}
                </FieldError>
              )}
            </Field>
          )}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                className="focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-3 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
              />
            </div>
            <div className="ml-3 text-sm">
              <label className="text-blanco">Recordar Contraseña</label>
            </div>
          </div>
          <a
            href="/cambiar-contraseña"
            className="text-blanco text-sm font-medium font-semibold hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button
          type="submit"
          className="flex mt-auto  mx-auto w-[60%] cursor-pointer items-center bg-[#cb9636] p-4 hover:bg-[#fcd488] focus:outline-none"
        >
          <LogIn />
          <span className="text-md font-bold text-white"> Iniciar Sesión </span>
        </Button>
      </form>
    </div>
  )
}

export default Login
