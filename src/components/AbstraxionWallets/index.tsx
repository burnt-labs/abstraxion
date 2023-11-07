import { useContext, useState } from "react";
import { useStytch, useStytchUser } from "@stytch/react";
import { useQuery } from "@apollo/client";
import { useDisconnect } from "graz";
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
  } = useContext(AbstraxionContext) as AbstraxionContextProps;

  const { user } = useStytchUser();
  const stytchClient = useStytch();
  const session_jwt = stytchClient.session.getTokens()?.session_jwt;
  const session_token = stytchClient.session.getTokens()?.session_token;

  const { disconnect } = useDisconnect();
  const { data: account } = useAbstraxionAccount(connectionType);
  const { loading, error, data, refetch } = useQuery(AllSmartWalletQuery, {
    variables: {
      authenticator: `project-test-185e9a9f-8bab-42f2-a924-953a59e8ff94.${user?.user_id}`,
    },
  });

  const [isGeneratingNewWallet, setIsGeneratingNewWallet] = useState(false);

  if (error) {
    return <WalletsSection>{error.message}</WalletsSection>;
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
        "http://localhost:8000/api/v1/jwt-account/create",
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
      if (res.status !== 200) {
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
            <AccountCard>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" rx="24" fill="black" />
                <path
                  d="M33.8947 30.8289V31.9342C33.8947 33.15 32.9 34.1447 31.6842 34.1447H16.2105C14.9837 34.1447 14 33.15 14 31.9342V16.4605C14 15.2447 14.9837 14.25 16.2105 14.25H31.6842C32.9 14.25 33.8947 15.2447 33.8947 16.4605V17.5658H23.9474C22.7205 17.5658 21.7368 18.5605 21.7368 19.7763V28.6184C21.7368 29.8342 22.7205 30.8289 23.9474 30.8289H33.8947ZM23.9474 28.6184H35V19.7763H23.9474V28.6184ZM28.3684 25.8553C27.4511 25.8553 26.7105 25.1147 26.7105 24.1974C26.7105 23.28 27.4511 22.5395 28.3684 22.5395C29.2858 22.5395 30.0263 23.28 30.0263 24.1974C30.0263 25.1147 29.2858 25.8553 28.3684 25.8553Z"
                  fill="white"
                />
              </svg>
              <AccountCardSection>
                <AccountCardName>{account.name}</AccountCardName>
                <AccountCardSub>
                  {truncateAddress(account.bech32Address)}
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
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="48" height="48" rx="24" fill="black" />
                        <path
                          d="M33.8947 30.8289V31.9342C33.8947 33.15 32.9 34.1447 31.6842 34.1447H16.2105C14.9837 34.1447 14 33.15 14 31.9342V16.4605C14 15.2447 14.9837 14.25 16.2105 14.25H31.6842C32.9 14.25 33.8947 15.2447 33.8947 16.4605V17.5658H23.9474C22.7205 17.5658 21.7368 18.5605 21.7368 19.7763V28.6184C21.7368 29.8342 22.7205 30.8289 23.9474 30.8289H33.8947ZM23.9474 28.6184H35V19.7763H23.9474V28.6184ZM28.3684 25.8553C27.4511 25.8553 26.7105 25.1147 26.7105 24.1974C26.7105 23.28 27.4511 22.5395 28.3684 22.5395C29.2858 22.5395 30.0263 23.28 30.0263 24.1974C30.0263 25.1147 29.2858 25.8553 28.3684 25.8553Z"
                          fill="white"
                        />
                      </svg>
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
