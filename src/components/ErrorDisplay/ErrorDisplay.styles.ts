import styled from "styled-components";

export const ErrorDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding: 2rem;
  gap: 1rem;
`;

export const ErrorDisplayTitle = styled.h1`
  color: black;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px; /* 100% */
  letter-spacing: -0.96px;
  text-transform: uppercase;
`;

export const ErrorDisplaySubtitle = styled.h1`
  color: #6c6a6a;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.14px;
`;

export const ErrorDisplayCode = styled.p`
  color: #6c6a6a;
  opacity: 60%;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.14px;
`;
