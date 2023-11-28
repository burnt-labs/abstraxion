import { useContext, useEffect, useState } from "react";
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
import {
  AbstraxionContext,
  AbstraxionContextProps,
} from "../AbstraxionContext";
import { useAbstraxionAccount } from "../../hooks/useAbstraxionAccount";
import { truncateAddress } from "../../../utils/truncateAddress";
import { AllSmartWalletQuery } from "../../interfaces/queries";

export const AbstraxionWallets = () => {
  const {
    connectionType,
    setConnectionType,
    abstractAccount,
    setAbstractAccount,
    setAbstraxionError,
    config,
  } = useContext(AbstraxionContext) as AbstraxionContextProps;

  const { user } = useStytchUser();
  const stytchClient = useStytch();
  const session_jwt = stytchClient.session.getTokens()?.session_jwt;
  const session_token = stytchClient.session.getTokens()?.session_token;

  const API_URL = `${
    config?.apiUrl || "https://aa.xion-testnet-1.burnt.com"
  }/api/v1/jwt-accounts/create`;
  const AUTHENTICATOR = `${
    config?.projectId || "project-live-7e4a3221-79cd-4f34-ac1d-fedac4bde13e"
  }.${user?.user_id}`;

  const { disconnect } = useDisconnect();
  const { data: account } = useAbstraxionAccount();
  const { loading, error, data, startPolling, stopPolling, previousData } =
    useQuery(AllSmartWalletQuery, {
      variables: {
        authenticator: AUTHENTICATOR,
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
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          salt: Date.now().toString(),
          session_jwt,
          session_token,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error);
      }
      startPolling(500);
      setFetchingNewWallets(true);
      return;
    } catch (error) {
      setAbstraxionError("Error creating abstract account.");
    } finally {
      setIsGeneratingNewWallet(false);
    }
  };

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
                      onClick={() => setAbstractAccount(node)}
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
          <Button
            structure="outlined"
            theme="secondary"
            fullwidth={true}
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </WalletsSection>
      )}
    </>
  );
};
