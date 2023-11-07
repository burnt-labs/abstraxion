import { useContext, useEffect, useRef } from "react";
import { GrazProvider } from "graz";
import { StytchProvider } from "@stytch/react";
import { ApolloProvider } from "@apollo/client";
import { ErrorDisplay } from "../ErrorDisplay";
import { WalletLoading } from "../WalletLoading";
import { AbstraxionWallets } from "../AbstraxionWallets";
import { AbstraxionSignin } from "../AbstraxionSignin";
import { AbstraxionModal, ModalAnchor } from "./Abstraxtion.styles";
import {
  AbstraxionContext,
  AbstraxionContextProps,
  AbstraxionContextProvider,
} from "../AbstraxionContext";
import { useAbstraxionAccount } from "../../hooks/useAbstraxionAccount";
import { apolloClient, stytchClient } from "../../lib";

export interface AbstraxionModalProps {
  onClose: VoidFunction;
  isOpen: boolean;
  children?: React.ReactNode;
}

export const Abstraxion = ({ isOpen, onClose }: AbstraxionModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const { connectionType, abstraxionError } = useContext(
    AbstraxionContext,
  ) as AbstraxionContextProps;

  const { isConnected, isConnecting, isReconnecting } =
    useAbstraxionAccount(connectionType);

  useEffect(() => {
    const closeOnEscKey = (e: any) => (e.key === "Escape" ? onClose() : null);
    document.addEventListener("keydown", closeOnEscKey);
    return () => {
      document.removeEventListener("keydown", closeOnEscKey);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <ModalAnchor ref={modalRef}>
      <AbstraxionModal>
        {abstraxionError ? (
          <ErrorDisplay message={abstraxionError} />
        ) : isConnecting || isReconnecting ? (
          <WalletLoading />
        ) : isConnected ? (
          <AbstraxionWallets />
        ) : (
          <AbstraxionSignin />
        )}
      </AbstraxionModal>
    </ModalAnchor>
  );
};

// TODO: Pull in all the providers from up above and stack them here...
export const AbstraxionProvider = ({
  onClose,
  children,
}: {
  onClose: VoidFunction;
  children: React.ReactNode;
}) => {
  return (
    <AbstraxionContextProvider onClose={onClose}>
      <StytchProvider stytch={stytchClient}>
        <ApolloProvider client={apolloClient}>
          <GrazProvider>{children}</GrazProvider>
        </ApolloProvider>
      </StytchProvider>
    </AbstraxionContextProvider>
  );
};
