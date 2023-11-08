import styled from "styled-components";

const CloseSvg = styled.svg`
  height: 20px;
  width: 20px;
`;

export const CloseIcon = ({ className }: { className?: string }) => {
  return (
    <CloseSvg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </CloseSvg>
  );
};
