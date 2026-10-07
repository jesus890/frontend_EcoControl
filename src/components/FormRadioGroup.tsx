import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";

interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface FormRadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
}

export function FormRadioGroup<T extends FieldValues>({
  name,
  control,
  label,
  options,
  orientation = "horizontal",
  disabled = false,
}: FormRadioGroupProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel className="text-sm font-semibold text-negrito">
            {label}
          </FieldLabel>

          <RadioGroup
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
            className={`w-fit gap-3 ${orientation === "vertical" ? "flex-col" : "flex"}`}
            aria-invalid={fieldState.invalid}
          >
            {options.map((option) => {
              const id = `${name}-${option.value}`;

              return (
                <div key={option.value} className="flex items-center gap-3">
                  <RadioGroupItem
                    value={option.value}
                    id={id}
                    disabled={option.disabled}
                    className="h-4 w-4 border-grisito text-azulito focus-visible:border-azulito focus-visible:ring-[3px] focus-visible:ring-azulito/30 data-checked:border-azulito data-checked:text-azulito"
                  />

                  <Label
                    htmlFor={id}
                    className="cursor-pointer text-sm text-negrito"
                  >
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}
