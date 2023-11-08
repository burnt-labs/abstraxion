import React from "react";
import { InputContainer, InputErrorMessage, StyledInput } from "./Input.styles";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "password" | "number" | "email" | "date" | "tel";
  placeholder?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  fullwidth: boolean;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  name = "",
  value = "",
  onChange,
  className,
  fullwidth = false,
  error,
  ...props
}) => {
  return (
    <InputContainer>
      <StyledInput
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        $fullwidth={fullwidth}
        $error={error}
        {...props}
      />
      <InputErrorMessage>{error}</InputErrorMessage>
    </InputContainer>
  );
};
