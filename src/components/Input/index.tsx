import React from "react";
import { StyledInput } from "./Input.styles";

interface InputProps {
  type?: "text" | "password" | "number" | "email" | "date" | "tel";
  placeholder?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  fullwidth: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  name = "",
  value = "",
  onChange,
  className,
  fullwidth = false,
}) => {
  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      $fullwidth={fullwidth}
    />
  );
};
