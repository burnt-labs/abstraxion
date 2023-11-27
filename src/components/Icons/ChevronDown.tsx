export const ChevronDown = ({ isUp = false }: { isUp?: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: isUp ? "rotate(180deg)" : "" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};
