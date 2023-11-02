import styled, { css } from "styled-components";

interface StyledInputProps {
  $fullwidth?: boolean;
}

export const StyledInput = styled.input<StyledInputProps>`
  font-size: 16px;
  background-color: #f2f2f2;
  color: black;
  padding: 8px 20px;
  border-radius: 5px;
  height: 46px;
  border: none;

  ${(props) =>
    props.$fullwidth &&
    css`
      width: 100%;
    `}

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #bdbdbd;
  }
`;
