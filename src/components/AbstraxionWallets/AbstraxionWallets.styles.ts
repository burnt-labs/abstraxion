import styled, { css } from "styled-components";

export const WalletsSection = styled.div`
  width: 100%;
  height: 100%;
  display: inline-flex;
  padding: 40px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 30px;
`;

export const AccountsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  gap: 1rem;
`;

export const WalletList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
  max-height: 250px;
  overflow: scroll;
`;

export const AccountsHeader = styled.h2`
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */
  letter-spacing: -0.16px;
`;

export interface AccountCardProps {
  $selected?: boolean;
}

export const AccountCard = styled.div<AccountCardProps>`
  display: flex;
  padding: 1rem;
  border-radius: 8px;
  background: #fafafa;
  align-items: center;
  width: 100%;
  gap: 1rem;

  ${(props) =>
    props.$selected &&
    css`
      border: 1.5px solid black;
    `}
`;

export const AccountCardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const AccountCardName = styled.h1`
  font-size: 14px;
  font-weight: 700;
  color: black;
`;

export const AccountCardSub = styled.h1`
  font-size: 12px;
  font-weight: 400;
  color: #6c6a6a;
`;
