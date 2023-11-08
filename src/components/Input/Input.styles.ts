import styled, { css } from "styled-components";

interface StyledInputProps {
  $fullwidth?: boolean;
  $error?: string;
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

  ${(props) =>
    props.$error &&
    css`
      border: 1px solid red;
    `}

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #bdbdbd;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1px;s
`;

export const InputErrorMessage = styled.p`
  color: red;
  font-size: 11px;
  font-weight: 500;
`;
