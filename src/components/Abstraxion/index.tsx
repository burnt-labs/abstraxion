import { useContext, useEffect, useRef } from "react";
import { GrazProvider } from "graz";
import { StytchProvider } from "@stytch/nextjs";
import { ApolloProvider } from "@apollo/client";
import { CloseIcon } from "../Icons/CloseIcon";
import { ErrorDisplay } from "../ErrorDisplay";
import { WalletLoading } from "../WalletLoading";
import { AbstraxionWallets } from "../AbstraxionWallets";
import { AbstraxionSignin } from "../AbstraxionSignin";
import {
  AbstraxionClose,
  AbstraxionModal,
  ModalAnchor,
} from "./Abstraxtion.styles";
import {
  AbstraxionConfig,
  AbstraxionContext,
  AbstraxionContextProps,
  AbstraxionContextProvider,
} from "../AbstraxionContext";
import { useAbstraxionAccount } from "../../hooks/useAbstraxionAccount";
import { getStytchClient, getApolloClient } from "../../lib";

export interface AbstraxionModalProps {
  onClose: VoidFunction;
  isOpen: boolean;
}

export const Abstraxion = ({ isOpen, onClose }: AbstraxionModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const { abstraxionError } = useContext(
    AbstraxionContext,
  ) as AbstraxionContextProps;

  const { isConnected, isConnecting, isReconnecting } = useAbstraxionAccount();

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
        <AbstraxionClose onClick={onClose}>
          <CloseIcon />
        </AbstraxionClose>
        {abstraxionError ? (
          <ErrorDisplay message={abstraxionError} onClose={onClose} />
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

export const AbstraxionProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config?: AbstraxionConfig;
}) => {
  const stytchClient = getStytchClient(config?.publicToken);
  const apolloClient = getApolloClient(config?.indexerUrl);

  return (
    <AbstraxionContextProvider config={config}>
      <StytchProvider stytch={stytchClient}>
        <ApolloProvider client={apolloClient}>
          <GrazProvider>{children}</GrazProvider>
        </ApolloProvider>
      </StytchProvider>
    </AbstraxionContextProvider>
  );
};
