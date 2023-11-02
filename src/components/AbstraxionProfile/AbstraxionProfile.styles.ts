import styled from "styled-components";

export const ProfileSection = styled.div`
  width: 100%;
  height: 100%;
  display: inline-flex;
  padding: 40px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 50px;
`;

export const AccountCard = styled.div`
  display: flex;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid black;
  background: #fafafa;
  align-items: center;
  width: 100%;
  gap: 1rem;
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
