import styled from "styled-components";
import { PICKER_HEIGHT } from "../../constants";

// const PAPER_HEIGHT = "75vh";
const PAPER_BORDER_RADIUS = "7px";
// const TEXT_LINE_HEIGHT = "1.6rem";

export const StyledWindow = styled.div<{
  $status: "hide" | "opening" | "display" | "closing";
}>`
  width: 100vw;
  max-width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1100;

  display: ${(props) => (props.$status === "hide" ? "none" : "")};
  animation: ${(props) => {
    return props.$status === "opening"
      ? "opening 0.25s"
      : props.$status === "closing"
      ? "closing 0.25s"
      : "";
  }};

  @keyframes opening {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes closing {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
`;

export const StyledPaper = styled.div`
  width: 90vw;
  height: ${PICKER_HEIGHT};
  position: absolute;
  top: calc((100% - ${PICKER_HEIGHT}) / 2);
  left: 5vw;
`;
