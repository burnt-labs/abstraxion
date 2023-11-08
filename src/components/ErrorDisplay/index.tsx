import { useContext } from "react";
import { Button } from "../Button";
import {
  ErrorDisplayCode,
  ErrorDisplayContainer,
  ErrorDisplaySubtitle,
  ErrorDisplayTitle,
} from "./ErrorDisplay.styles";
import {
  AbstraxionContext,
  AbstraxionContextProps,
} from "../AbstraxionContext";

export const ErrorDisplay = ({
  message,
  onClose,
}: {
  message?: string;
  onClose: VoidFunction;
}) => {
  const { setAbstraxionError } = useContext(
    AbstraxionContext,
  ) as AbstraxionContextProps;

  return (
    <ErrorDisplayContainer>
      <ErrorDisplayTitle>Uh oh.</ErrorDisplayTitle>
      <ErrorDisplaySubtitle>Something went wrong.</ErrorDisplaySubtitle>
      {message && <ErrorDisplayCode>{message}</ErrorDisplayCode>}
      <Button
        structure="outlined"
        theme="secondary"
        fullwidth={true}
        onClick={() => {
          onClose();
          setAbstraxionError("");
        }}
      >
        Dismiss
      </Button>
    </ErrorDisplayContainer>
  );
};
