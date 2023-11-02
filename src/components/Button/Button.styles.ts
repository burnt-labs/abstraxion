import styled, { css } from "styled-components";

interface StyledButtonProps {
  $structure?: "base" | "outlined" | "naked";
  $theme?: "primary" | "secondary" | "destructive";
  $fullwidth?: boolean;
  disabled?: boolean;
}

// Base styled button
export const StyledButton = styled.button<StyledButtonProps>`
  /* Common styles for all buttons */
  font-size: 14px;
  font-weight: 700;
  padding: 14px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  ${(props) =>
    props.$fullwidth &&
    css`
      width: 100%;
    `}

  ${({ $structure, $theme, disabled }) => {
    // The disabled prop overrides the $theme prop and gives buttons a greyed-out look.
    if (disabled) {
      return css`
        pointer-events: none;
        ${$structure === "base" && // disabled & base
        css`
          background-color: #bdbdbd;
          color: #fff;
        `}
        ${$structure === "outlined" && // disabled & outlined
        css`
          border: 1px solid #bdbdbd;
          color: #bdbdbd;
        `}
      ${$structure === "naked" && // disabled & naked
        css`
          color: #bdbdbd;
        `}
      `;
    }

    if ($structure === "outlined") {
      if ($theme === "primary") {
        // outlined & primary
        return css`
          border: 1px solid #01000a;
          background-color: transparent;
        `;
      } else if ($theme === "secondary") {
        // outlined & secondary
        return css`
          border: 1px solid #00000033;
          background-color: transparent;
          color: black;
        `;
      } else if ($theme === "destructive") {
        // outlined & destructive
        return css`
          border: 1px solid #ff4136;
          background-color: transparent;
          color: #ff4136;
        `;
      }
    } else if ($structure === "naked") {
      if ($theme === "primary") {
        // naked & primary
        return css`
          border: none;
          background-color: inherit;
        `;
      } else if ($theme === "secondary") {
        // naked & secondary
        return css`
          border: none;
          background-color: transparent;
          color: #00000033;
        `;
      } else if ($theme === "destructive") {
        // naked & destructive
        return css`
          border: none;
          background-color: transparent;
          color: #ff4136;
        `;
      }
    } else {
      // base
      if ($theme === "primary") {
        // base & primary
        return css`
          background-color: #01000a;
          color: white;
        `;
      } else if ($theme === "secondary") {
        // base & secondary
        return css`
          background-color: #f0f0f0;
        `;
      } else if ($theme === "destructive") {
        // base & destructive
        return css`
          background-color: #ff4136;
          color: white;
        `;
      }
    }
  }}
`;
