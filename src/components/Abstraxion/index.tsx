import { useContext, useEffect, useRef } from "react";
import { GrazProvider } from "graz";
import { StytchProvider } from "@stytch/react";
import { StytchUIClient } from "@stytch/vanilla-js";
import { AbstraxionProfile } from "../AbstraxionProfile";
import {
  AbstraxionContext,
  AbstraxionContextProps,
  AbstraxionContextProvider,
} from "../AbstraxionContext";
import { AbstraxionSignin } from "../AbstraxionSignin";
import {
  AbstraxionModal,
  AbstraxionSubtitle,
  AbstraxionTitle,
  ModalAnchor,
  ModalSection,
} from "./Abstraxtion.styles";
import { useAbstraxionAccount } from "../../hooks/useAbstraxionAccount";

export interface AbstraxionModalProps {
  onClose: VoidFunction;
  isOpen: boolean;
}

const AbstraxionMain = ({ isOpen }: AbstraxionModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const { onClose } = useContext(AbstraxionContext) as AbstraxionContextProps;

  const { connectionType } = useContext(
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
        {isConnecting || isReconnecting ? (
          <ModalSection>
            <div>
              <AbstraxionTitle>Welcome to XION</AbstraxionTitle>
              <AbstraxionSubtitle>
                Connecting to your wallet...
              </AbstraxionSubtitle>
            </div>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="3rem"
                height="3rem"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
              >
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  stroke="#0a0a0a"
                  strokeWidth="8"
                  r="35"
                  strokeDasharray="164.93361431346415 56.97787143782138"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    repeatCount="indefinite"
                    dur="1.25s"
                    values="0 50 50;360 50 50"
                    keyTimes="0;1"
                  ></animateTransform>
                </circle>
              </svg>
            </div>
          </ModalSection>
        ) : isConnected ? (
          <AbstraxionProfile />
        ) : (
          <AbstraxionSignin />
        )}
      </AbstraxionModal>
    </ModalAnchor>
  );
};

// TODO: Temporarily hard-coded
const stytchClient = new StytchUIClient(
  "public-token-test-62177c24-f8f4-4ddd-962b-0436b445ccaa",
);

export const Abstraxion = (props: AbstraxionModalProps) => {
  return (
    <AbstraxionContextProvider onClose={props.onClose}>
      <StytchProvider stytch={stytchClient}>
        <AbstraxionMain {...props} />
      </StytchProvider>
    </AbstraxionContextProvider>
  );
};

// TODO: Be conscious of the "use client" primitive. Should we import here to save devs trouble in impl?

// TODO: Pull in all the providers from up above and stack them here...
export const AbstraxionProvider = (props: React.PropsWithChildren) => {
  return <GrazProvider>{props.children}</GrazProvider>;
};
