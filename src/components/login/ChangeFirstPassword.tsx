import {  useState } from "react";

import { LockKeyhole, Eye, EyeOff, LogIn,  MessageCircleWarning } from "lucide-react";
import { useNavigate } from "react-router";
import { InfoIcon } from "lucide-react";

//Toast
import { toast } from "sonner"

//validaciones y forms
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

//field
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { Button } from "@/components/ui/button"

import { restaurarPrimerPassword } from "@/api/service";

interface IComponent {
  userEmail: String
}

function ChangeFirstPassword({ userEmail }: IComponent) {
  const schema = z.object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),

    password_confirmation: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
  })


  type FormValues = z.infer<typeof schema>

  //inicializacion de variables
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      password_confirmation: ""
    },
    mode: "onBlur",
  })

  const navigate = useNavigate()

  //inputs password
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const [showPassword2, setShowPassword2] = useState(false)
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show)

  //restaura el password
  const onSubmit = async (data: any) => {
    if (data.password !== data.password_confirmation) 
    {
      toast("Las contraseñas ingresadas no coinciden", {
        icon: <MessageCircleWarning className="text-rojito" />,
        className: "bg-white !text-negrito !font-bold border !shadow-sm",
      })
      return;
    }

    const response = await restaurarPrimerPassword({
      email: userEmail,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });

    if(response?.result)
    {
      navigate("/mml/environment");
    }
  }

  return (
    <div>
      <h1 className="text-blanco mb-3 text-center text-xl leading-tight font-bold tracking-tight md:text-2xl">
        Cambiar contraseña
      </h1>

      <form
        className="space-y-4 md:space-y-6 flex flex-col h-[calc(55vh)]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="bg-inputs flex w-full rounded-lg border border-gray-700 p-3 shadow-lg">
          <InfoIcon className="mt-1 mr-3 h-12 w-12 text-[#C3A536]" />
          <p className="text-blanco text-justify text-[12px]">
            Por motivos de seguridad, debes cambiar tu contraseña. Asegúrese de
            que sea segura y fácil de recordar. Una vez ingresada, haga clic en
            'Restablecer' para completar el proceso.
          </p>
        </div>

        {/* password */}
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

        {/* password_confirmation */}
        <Controller
          name="password_confirmation"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="password_confirmation"
                className="text-[13px] font-bold text-negrito"
              >
                Contraseña *
              </FieldLabel>

              <InputGroup className="bg-inputs w-full rounded-md border border-gray-600 bg-white placeholder:text-placeholder focus:border-[#d4d4d8]">
                <InputGroupAddon align="inline-start">
                  <LockKeyhole className="text-[#C3A536]" />
                </InputGroupAddon>

                <InputGroupInput
                  id="password_confirmation"
                  required
                  type={showPassword2 ? "text" : "password"}
                  placeholder="Confirma tu contraseña"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />

                <InputGroupAddon
                  align="inline-end"
                  onClick={handleClickShowPassword2}
                >
                  {showPassword2 ? <EyeOff /> : <Eye />}
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

        <Button
          type="submit"
          className="flex mt-auto  mx-auto w-[60%] cursor-pointer bg-[#cb9636] p-4 hover:bg-[#fcd488] focus:outline-none w-[250px] items-center"
        >
          <LogIn />
          <span className="text-white font-bold text-md"> Restablecer </span>
        </Button>

      </form>
    </div>
  )
}

export default ChangeFirstPassword
