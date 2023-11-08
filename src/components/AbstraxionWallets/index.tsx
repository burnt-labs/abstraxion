import { useContext, useState } from "react";
import { useDisconnect } from "graz";
import { useStytch, useStytchUser } from "@stytch/react";
import { useQuery } from "@apollo/client";
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
import { AccountWalletLogo } from "../Icons/AccountWalletLogo";

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

  const { disconnect } = useDisconnect();
  const { data: account } = useAbstraxionAccount();
  const { loading, error, data, refetch } = useQuery(AllSmartWalletQuery, {
    variables: {
      authenticator: `project-test-185e9a9f-8bab-42f2-a924-953a59e8ff94.${user?.user_id}`,
    },
  });

  const [isGeneratingNewWallet, setIsGeneratingNewWallet] = useState(false);

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
      await refetch();
      return;
    } catch (error) {
      setAbstraxionError("Error creating abstract account.");
    } finally {
      setIsGeneratingNewWallet(false);
    }
  };

  return (
    <>
      {isGeneratingNewWallet || loading ? (
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
                {data?.smartAccounts.nodes.length >= 1 ? (
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