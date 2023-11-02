import { ReactNode, createContext, useState } from "react";

export interface AbstraxionContextProps {
  onClose: VoidFunction;
  connectionType: "stytch" | "graz" | "none";
  setConnectionType: React.Dispatch<
    React.SetStateAction<"stytch" | "graz" | "none">
  >;
}

export const AbstraxionContext = createContext<AbstraxionContextProps>(
  {} as AbstraxionContextProps,
);

export const AbstraxionContextProvider = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: VoidFunction;
}) => {
  const [connectionType, setConnectionType] = useState<
    "stytch" | "graz" | "none"
  >("none");
  const handleClose = () => {
    onClose();
  };

  return (
    <AbstraxionContext.Provider
      value={{
        onClose: handleClose,
        connectionType,
        setConnectionType,
      }}
    >
      {children}
    </AbstraxionContext.Provider>
  );
};
