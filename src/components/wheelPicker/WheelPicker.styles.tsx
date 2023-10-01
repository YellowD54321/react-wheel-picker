import { styled } from "styled-components";
import { PICKER_HEIGHT, SELECTED_REGION_HEIGHT } from "../../constants";

export const StyledWheelPicker = styled.div`
  position: relative !important;
  width: 100%;
  height: ${PICKER_HEIGHT} !important;
  background-color: black;
  color: rgb(255, 255, 255);
  overflow: none !important;
`;

export const StyledWheelPickerColumns = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
`;

export const StyledSelectArea = styled.div<{ $border?: string }>`
  backdrop-filter: brightness(100%);
  position: absolute !important;
  top: calc(50% - ${SELECTED_REGION_HEIGHT} / 2) !important;
  left: 0;
  width: 100% !important;
  height: ${SELECTED_REGION_HEIGHT} !important;
  pointer-events: none !important;
  border-top: ${(props) => props.$border || "1px solid gray"};
  border-bottom: ${(props) => props.$border || "1px solid gray"};
`;
