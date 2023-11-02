import { useContext } from "react";
import { useDisconnect } from "graz";
import { useStytch } from "@stytch/react";
import { Button } from "../Button";
import { AbstraxionTitle } from "../Abstraxion/Abstraxtion.styles";
import {
  AccountCard,
  AccountCardName,
  AccountCardSection,
  AccountCardSub,
  ProfileSection,
} from "./AbstraxionProfile.styles";
import {
  AbstraxionContext,
  AbstraxionContextProps,
} from "../AbstraxionContext";
import { truncateAddress } from "../../../utils/truncateAddress";
import { useAbstraxionAccount } from "../../hooks/useAbstraxionAccount";

export const AbstraxionProfile = () => {
  const { connectionType, setConnectionType } = useContext(
    AbstraxionContext,
  ) as AbstraxionContextProps;

  const stytchClient = useStytch();
  const { disconnect } = useDisconnect();
  const { data } = useAbstraxionAccount(connectionType);

  const handleDisconnect = async () => {
    if (connectionType === "stytch") {
      await stytchClient.session.revoke();
    } else if (connectionType === "graz") {
      disconnect();
    }

    setConnectionType("none");
  };

  return (
    <ProfileSection>
      <AbstraxionTitle>Welcome Back</AbstraxionTitle>
      {data ? (
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
            <AccountCardName>
              {connectionType === "graz"
                ? data.name
                : data.authentication_factors[0].email_factor.email_address}
            </AccountCardName>
            <AccountCardSub>
              {connectionType === "graz"
                ? truncateAddress(data.bech32Address)
                : data.user_id}
            </AccountCardSub>
          </AccountCardSection>
        </AccountCard>
      ) : null}
      <Button
        structure="outlined"
        theme="secondary"
        fullwidth={true}
        onClick={handleDisconnect}
      >
        Disconnect
      </Button>
    </ProfileSection>
  );
};
