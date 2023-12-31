import { useCallback, useContext, useEffect, useState } from "react";
import { useDisconnect } from "graz";
import { useStytch, useStytchUser } from "@stytch/nextjs";
import { useQuery } from "@apollo/client";
import { AccountWalletLogo } from "../Icons/AccountWalletLogo";
import { Spinner } from "../Icons/Spinner";
import { Button } from "../Button";
import { WalletLoading } from "../WalletLoading";
import { AbstraxionTitle } from "../Abstraxion/Abstraxtion.styles";
import {
  AccountCard,
  AccountCardName,
  AccountCardSection,
  AccountCardSub,
  AccountsHeader,
  AccountsSection,
  WalletList,
  WalletsSection,
} from "./AbstraxionWallets.styles";
import { ColumnButtonGroup } from "../AbstraxionSignin/AbstraxionSignin.styles";
import {
  AbstraxionContext,
  AbstraxionContextProps,
} from "../AbstraxionContext";
import { useAbstraxionAccount } from "../../hooks/useAbstraxionAccount";
import { truncateAddress } from "../../../utils/truncateAddress";
import { AllSmartWalletQuery } from "../../interfaces/queries";
import { decodeJwt } from "jose";


export const AbstraxionWallets = () => {
  const {
    connectionType,
    setConnectionType,
    abstractAccount,
    setAbstractAccount,
    setAbstraxionError,
  } = useContext(AbstraxionContext) as AbstraxionContextProps;

  const { user } = useStytchUser();
  const stytchClient = useStytch();
  const session_jwt = stytchClient.session.getTokens()?.session_jwt;
  const session_token = stytchClient.session.getTokens()?.session_token;

  const { aud, sub } = decodeJwt(session_jwt || "");
  if(!aud || !sub) throw new Error("Missing aud or sub");

  const { disconnect } = useDisconnect();
  const { data: account } = useAbstraxionAccount();
  const { loading, error, data, startPolling, stopPolling, previousData } =
    useQuery(AllSmartWalletQuery, {
      variables: {
        authenticator: `${Array.isArray(aud) ? aud[0] : aud}.${sub}`,
      },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    });

  const [isGeneratingNewWallet, setIsGeneratingNewWallet] = useState(false);
  const [fetchingNewWallets, setFetchingNewWallets] = useState(false);

  useEffect(() => {
    if (previousData && data !== previousData) {
      stopPolling();
      setFetchingNewWallets(false);
    }
  }, [data, previousData]);

  if (error) {
    setAbstraxionError((error as Error).message);
    return null;
  }

  const handleDisconnect = async () => {
    if (connectionType === "stytch") {
      await stytchClient.session.revoke();
    } else if (connectionType === "graz") {
      disconnect();
    }

    setConnectionType("none");
    setAbstractAccount(undefined);
  };

  const handleJwtAALoginOrCreate = async (
    session_jwt?: string,
    session_token?: string,
  ) => {
    try {
      if (!session_jwt || !session_token) {
        throw new Error("Missing token/jwt");
      }
      setIsGeneratingNewWallet(true);
      const res = await fetch(
          "https://burnt-abstraxion-api.onrender.com/api/v1/jwt-accounts/create",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            salt: Date.now().toString(),
            session_jwt,
            session_token,
          }),
        },
      );
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error);
      }
      startPolling(500);
      setFetchingNewWallets(true);
      return;
    } catch (error) {
      console.log(error);
      setAbstraxionError("Error creating abstract account.");
    } finally {
      setIsGeneratingNewWallet(false);
    }
  };

  const registerWebAuthn = useCallback(async () => {
    try {
      await stytchClient.webauthn.register({
        domain: window.location.hostname,
        session_duration_minutes: 60,
      });
    } catch (error) {
      console.log(error);
    }
  }, [stytchClient]);

  return (
    <>
      {isGeneratingNewWallet ? (
        <WalletLoading />
      ) : (
        <WalletsSection>
          <AbstraxionTitle>Welcome Back</AbstraxionTitle>
          {connectionType === "graz" ? (
            <AccountCard $selected>
              <AccountWalletLogo />
              <AccountCardSection>
                <AccountCardName>{account?.name}</AccountCardName>
                <AccountCardSub>
                  {truncateAddress(account?.bech32Address)}
                </AccountCardSub>
              </AccountCardSection>
            </AccountCard>
          ) : (
            <AccountsSection>
              <AccountsHeader>Accounts</AccountsHeader>
              <WalletList>
                {loading || fetchingNewWallets ? (
                  <Spinner />
                ) : data?.smartAccounts.nodes.length >= 1 ? (
                  data?.smartAccounts?.nodes?.map((node: any, i: number) => (
                    <AccountCard
                      key={i}
                      onClick={() =>
                        setAbstractAccount({ ...node, userId: user?.user_id })
                      }
                      $selected={node.id === abstractAccount?.id}
                    >
                      <AccountWalletLogo />
                      <AccountCardSection>
                        <AccountCardName>
                          Personal Account {i + 1}
                        </AccountCardName>
                        <AccountCardSub>
                          {truncateAddress(node.id)}
                        </AccountCardSub>
                      </AccountCardSection>
                    </AccountCard>
                  ))
                ) : (
                  <p>No Accounts Found.</p>
                )}
              </WalletList>
              <Button
                structure="naked"
                theme="primary"
                fullwidth={true}
                onClick={async () => {
                  await handleJwtAALoginOrCreate(session_jwt, session_token);
                }}
              >
                Create a new account
              </Button>
            </AccountsSection>
          )}
          <ColumnButtonGroup>
            {connectionType === "stytch" &&
              user &&
              user?.webauthn_registrations.length < 1 && (
                <Button
                  structure="outlined"
                  theme="secondary"
                  fullwidth={true}
                  onClick={registerWebAuthn}
                >
                  Add Passkey/Biometrics
                </Button>
              )}
            <Button
              structure="outlined"
              theme="secondary"
              fullwidth={true}
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </ColumnButtonGroup>
        </WalletsSection>
      )}
    </>
  );
};
