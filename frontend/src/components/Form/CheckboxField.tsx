import clsx from "clsx";
import { UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapperPassThroughProps } from "./FieldWrapper";
import { useEffect } from "react";

type RadioButtonFieldProps = FieldWrapperPassThroughProps & {
  className?: string;
  value?: string;
  label: string;
  registration: Partial<UseFormRegisterReturn>;
};

export const CheckboxField = (props: RadioButtonFieldProps) => {
  const { className, registration, value, error, label } = props;
  const id = Math.random();

  useEffect(() => {
    console.log(error);
  }, [])
  return (
    <div className="form-check">
      <input
        {...registration}
        className={clsx(className, "form-check-input")}
        type="checkbox"
        value={value}
        id={id ? `${id}id` : "flexCheckDefault"}
      />
      <label
        className="form-check-label"
        htmlFor={id ? `${id}id` : "flexCheckDefault"}
      >
        {label}
      </label>
    </div>
  );
};
