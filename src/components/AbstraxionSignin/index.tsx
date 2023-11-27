import { useContext, useEffect, useState } from "react";
import { WalletType, useSuggestChainAndConnect } from "graz";
import { useStytch } from "@stytch/nextjs";
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
import { AdvancedFilter, ColumnButtonGroup } from "./AbstraxionSignin.styles";
import {
  AbstraxionContext,
  AbstraxionContextProps,
} from "../AbstraxionContext";
import { testnetChainInfo } from "../../../chain";
import { EMAIL_REGEX } from "../../../utils/regex";
import { ChevronDown } from "../Icons/ChevronDown";

export const AbstraxionSignin = () => {
  const stytchClient = useStytch();

  const [email, setEmail] = useState("");
  const [methodId, setMethodId] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isOnOtpStep, setIsOnOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailError("");
    setEmail(e.target.value.toLowerCase());
  };

  const validateEmail = () => {
    if (EMAIL_REGEX.test(email) || email === "") {
      setEmailError("");
    } else {
      setEmailError("Invalid Email Format");
    }
  };

  const handleEmail = async (event: any) => {
    event.preventDefault();

    if (!email) {
      setEmailError("Please enter your email");
      return;
    }

    try {
      setConnectionType("stytch");
      const emailRes = await stytchClient.otps.email.loginOrCreate(email);
      setMethodId(emailRes.method_id);
      setIsOnOtpStep(true);
      setTimeLeft(60);
    } catch (error) {
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
      setOtpError("Error verifying otp");
    }
  };

  const handleConnect = (wallet: WalletType) => {
    setConnectionType("graz");
    suggestAndConnect({ chainInfo: testnetChainInfo, walletType: wallet });
  };

  async function handleWebauthnAuthenticate() {
    try {
      await stytchClient.webauthn.authenticate({
        domain: window.location.hostname,
        session_duration_minutes: 60,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // For the "resend otp" countdown
  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null);
    }
    if (!timeLeft) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

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
              setOtpError("");
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
              border: otpError ? "1px solid red" : "none",
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
          <ColumnButtonGroup>
            <Button fullwidth={true} onClick={handleOtp}>
              Confirm
            </Button>
            <Button
              structure="outlined"
              theme="secondary"
              fullwidth={true}
              onClick={handleEmail}
              disabled={!!timeLeft}
            >
              Resend Code {timeLeft && `in ${timeLeft} seconds`}
            </Button>
          </ColumnButtonGroup>
        </>
      ) : (
        <>
          <AbstraxionTitle>Welcome to XION</AbstraxionTitle>
          <Input
            placeholder="Email address"
            fullwidth={true}
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            onBlur={validateEmail}
          />
          <Button
            structure="base"
            fullwidth={true}
            onClick={handleEmail}
            disabled={!!emailError}
          >
            Log in / Sign up
          </Button>
          <HorizontalDivider>OR</HorizontalDivider>
          <ColumnButtonGroup>
            <Button
              structure="outlined"
              theme="secondary"
              fullwidth={true}
              onClick={handleWebauthnAuthenticate}
            >
              Passkey/TouchID
            </Button>
            <AdvancedFilter onClick={() => setShowAdvanced(!showAdvanced)}>
              Advanced <ChevronDown isUp={showAdvanced} />{" "}
              {showAdvanced ? "Login with an existing EOA" : ""}
            </AdvancedFilter>
            {showAdvanced && (
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
            )}
          </ColumnButtonGroup>
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
