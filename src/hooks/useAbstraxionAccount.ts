import { useContext, useEffect } from "react";
import { useAccount } from "graz";
import { useStytchSession } from "@stytch/react";
import {
  AbstraxionContext,
  AbstraxionContextProps,
} from "../components/AbstraxionContext";

export interface useAbstraxionAccountProps {
  data?: any; // TODO: Define interface for data
  isConnected: boolean;
  isConnecting?: boolean;
  isReconnecting?: boolean;
}

export const useAbstraxionAccount = (
  type: "stytch" | "graz" | "none",
): useAbstraxionAccountProps => {
  const { session } = useStytchSession();
  const { data, isConnected, isConnecting, isReconnecting } = useAccount();

  const { setConnectionType, abstractAccount } = useContext(
    AbstraxionContext,
  ) as AbstraxionContextProps;

  useEffect(() => {
    const refreshConnectionType = () => {
      if (session) {
        setConnectionType("stytch");
      } else if (data) {
        setConnectionType("graz");
      }
    };

    if (type === "none") {
      refreshConnectionType();
    }
  }, [session, data]);

  switch (type) {
    case "stytch":
      return { data: abstractAccount, isConnected: !!session };
    case "graz":
      return {
        data: data,
        isConnected: isConnected,
        isConnecting: isConnecting,
        isReconnecting: isReconnecting,
      };
    default:
      return { data: null, isConnected: false };
  }
};
