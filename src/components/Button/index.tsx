import { ButtonHTMLAttributes } from "react";
import { StyledButton } from "./Button.styles";

export interface ButtonProps {
  structure?: "base" | "outlined" | "naked";
  theme?: "primary" | "secondary" | "destructive";
  fullwidth?: boolean;
  disabled?: boolean;
  onClick: (params?: any) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Button = ({
  structure = "base",
  theme = "primary",
  fullwidth = false,
  disabled = false,
  onClick,
  children,
  style,
}: ButtonProps) => {
  return (
    <StyledButton
      disabled={disabled}
      onClick={onClick}
      $structure={structure}
      $theme={theme}
      $fullwidth={fullwidth}
      style={style}
    >
      {children}
    </StyledButton>
  );
};
