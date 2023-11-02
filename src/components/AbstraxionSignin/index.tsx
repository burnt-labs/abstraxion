import { useContext, useState } from "react";
import { WalletType, useSuggestChainAndConnect } from "graz";
import { useStytch } from "@stytch/react";
import PinInput from "react-pin-input";
import { Button } from "../Button";
import { Input } from "../Input";
import {
  AbstraxionSubtitle,
  AbstraxionTitle,
  ButtonGroup,
  HorizontalDivider,
  ModalSection,
  TOSDisclaimer,
  TOSLink,
} from "../Abstraxion/Abstraxtion.styles";
import { StytchButtonGroup } from "./AbstraxionSignin.styles";
import {
  AbstraxionContext,
  AbstraxionContextProps,
} from "../AbstraxionContext";
import { testChainInfo } from "../../../chain";

export const AbstraxionSignin = () => {
  const stytchClient = useStytch();

  const [email, setEmail] = useState("");
  const [methodId, setMethodId] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isOnOtpStep, setIsOnOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const { setConnectionType } = useContext(
    AbstraxionContext,
  ) as AbstraxionContextProps;

  const { suggestAndConnect } = useSuggestChainAndConnect({
    onError(error) {
      setConnectionType("none");
      if ((error as Error).message.includes("is not defined")) {
        alert(
          "Wallet not found. Make sure you download the wallet extension before trying again.",
        );
      }
    },
  });

  const handleEmail = async (event: any) => {
    event.preventDefault();

    try {
      setConnectionType("stytch");
      const emailRes = await stytchClient.otps.email.loginOrCreate(email);
      setMethodId(emailRes.method_id);
      setIsOnOtpStep(true);
    } catch (error) {
      console.log(error);
      setEmailError("Error sending email");
      setConnectionType("none");
    }
  };

  const handleOtp = async (event: any) => {
    event.preventDefault();

    try {
      await stytchClient.otps.authenticate(otp, methodId, {
        session_duration_minutes: 60,
      });
    } catch (error) {
      console.log(error);
      setOtpError("Error verifying otp");
    }
  };

  const handleConnect = (wallet: WalletType) => {
    setConnectionType("graz");
    suggestAndConnect({ chainInfo: testChainInfo, walletType: wallet });
  };

  return (
    <ModalSection>
      {isOnOtpStep ? (
        <>
          <div>
            <AbstraxionTitle>Input 6 Digit Code</AbstraxionTitle>
            <AbstraxionSubtitle>
              Please check your email for the verification code.
            </AbstraxionSubtitle>
          </div>
          <PinInput
            length={6}
            initialValue=""
            onChange={(value) => {
              setOtp(value);
            }}
            type="numeric"
            inputMode="number"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
            inputStyle={{
              border: "none",
              backgroundColor: "#F2F2F2",
              borderRadius: "2px",
              height: "64px",
              color: "black",
              fontSize: "16px",
            }}
            onComplete={(value) => {
              setOtp(value);
            }}
            autoSelect={true}
            regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
          />
          <StytchButtonGroup>
            <Button fullwidth={true} onClick={handleOtp}>
              Confirm
            </Button>
            <Button
              structure="outlined"
              theme="secondary"
              fullwidth={true}
              onClick={() => {
                console.log("resend");
              }}
            >
              Resend Code
            </Button>
          </StytchButtonGroup>
        </>
      ) : (
        <>
          <AbstraxionTitle>Welcome to XION</AbstraxionTitle>
          <Input
            placeholder="Email address"
            fullwidth={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button fullwidth={true} onClick={handleEmail}>
            Log in / Sign up
          </Button>
          <HorizontalDivider>OR</HorizontalDivider>
          <ButtonGroup>
            <Button
              structure="outlined"
              theme="secondary"
              fullwidth={true}
              onClick={() => {
                handleConnect(WalletType.METAMASK_SNAP_LEAP);
              }}
            >
              Metamask
            </Button>
            <Button
              structure="outlined"
              theme="secondary"
              fullwidth={true}
              onClick={() => {
                handleConnect(WalletType.KEPLR);
              }}
            >
              Keplr
            </Button>
          </ButtonGroup>
          <TOSDisclaimer>
            By continuing, you agree to Burnt's{" "}
            <TOSLink href="https://google.com">Terms of Service</TOSLink> and
            acknowledge that you have read and understand the XION{" "}
            <TOSLink href="https://google.com">Disclaimer</TOSLink>.
          </TOSDisclaimer>
        </>
      )}
    </ModalSection>
  );
};
