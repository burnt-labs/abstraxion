import styled from "styled-components";

export const ModalAnchor = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100000;
  /* Make background be translucent with a slight blur */
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
`;

export const AbstraxionModal = styled.div`
  width: 100%;
  max-width: 465px;
  background: white;
  color: black;
`;

export const ModalSection = styled.div`
  width: 100%;
  height: 100%;
  display: inline-flex;
  padding: 40px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 50px;
`;

export const AbstraxionTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 28px;
`;

export const AbstraxionSubtitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 12px;
  line-height: 24px;
`;

export const HorizontalDivider = styled.h1`
  display: flex;
  flex-direction: row;
  font-size: 12px;
  font-weight: 500;
  width: 100%;
  color: rgba(0, 0, 0, 0.5);

  &:before,
  &:after {
    content: "";
    flex: 1 1;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin: auto;
  }

  &:before {
    margin-right: 20px;
  }

  &:after {
    margin-left: 20px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

export const TOSDisclaimer = styled.p`
  font-size: 11px;
  line-height: 16px;
  color: #a6a6a6;
`;

export const TOSLink = styled.a`
  color: black;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
