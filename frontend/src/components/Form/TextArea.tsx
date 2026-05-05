import clsx from "clsx";
import { UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";

type TextAreaFieldProps = FieldWrapperPassThroughProps & {
  className?: string;
  placeholder?: string;
  rows?: number;
  blueLabel?: boolean;
  registration: Partial<UseFormRegisterReturn>;
  floating?: boolean;
};

export const TextAreaField = (props: TextAreaFieldProps) => {
  const {
    label,
    className,
    registration,
    error,
    placeholder,
    rows = 4,
    blueLabel = false,
    floating = false,
  } = props;
   
  const TextArea = (
    <textarea
      className={clsx("form-control", error?.message && "is-invalid", className)}
      placeholder={placeholder ?? label}
      rows={rows}
      {...registration}
    />
  );

  let TextAreaType = null;

  if (!floating) {
    TextAreaType = TextArea;
  } else {
    TextAreaType = (
      <div className="form-floating">
        {TextArea}
        <label>{label}</label>
      </div>
    );
  }

  return (
    <FieldWrapper floating={floating} label={label} error={error} blueLabel={blueLabel}>
      {TextAreaType}
    </FieldWrapper>
  );
};
