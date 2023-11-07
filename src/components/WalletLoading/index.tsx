import {
  AbstraxionSubtitle,
  AbstraxionTitle,
  CenteredFlexBox,
  ModalSection,
} from "../Abstraxion/Abstraxtion.styles";
import { Spinner } from "../Icons/Spinner";

export const WalletLoading = () => {
  return (
    <ModalSection>
      <div>
        <AbstraxionTitle>Let's go</AbstraxionTitle>
        <AbstraxionSubtitle>Starting your journey...</AbstraxionSubtitle>
      </div>
      <CenteredFlexBox>
        <Spinner />
      </CenteredFlexBox>
    </ModalSection>
  );
};
