import { styled } from "styled-components";
import { PICKER_HEIGHT, SELECTED_REGION_HEIGHT } from "../../constants";

interface ColumnProps {
  value: string;
}

export const StyledWheelPickerColumnWrapper = styled.ul<ColumnProps>`
  list-style-type: none;
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  height: 100% !important;
  width: 100% !important;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  cursor: grab;
  /* hide scroll bar for firefox */
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &:active {
    cursor: grabbing;
  }

  &::before,
  &::after {
    content: "";
    display: block;
    height: ${PICKER_HEIGHT};
  }
`;

export const StyledWheelPickerColumnOption = styled.li`
  scroll-snap-align: center;
  margin: calc(${SELECTED_REGION_HEIGHT} / 2) 0;
`;
