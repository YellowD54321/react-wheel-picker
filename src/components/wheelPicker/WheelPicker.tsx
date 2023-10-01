import { PropsWithChildren, useContext, useEffect, useRef } from "react";
import {
  WheelPickerProvider,
  wheelPickerContext,
} from "../../contexts/wheelPickerContext";
import {
  StyledSelectArea,
  StyledWheelPicker,
  StyledWheelPickerColumns,
} from "./WheelPicker.styles";

interface Props extends PropsWithChildren {
  className?: string;
  style?: React.CSSProperties;
  selectAreaBorder?: string;
}

const Picker = ({ children, className, style, selectAreaBorder }: Props) => {
  const { setWheelPicker } = useContext(wheelPickerContext);
  const wheelPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWheelPicker(wheelPickerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wheelPickerRef.current]);

  return (
    <StyledWheelPicker ref={wheelPickerRef} className={className} style={style}>
      <StyledWheelPickerColumns>{children}</StyledWheelPickerColumns>
      <StyledSelectArea $border={selectAreaBorder} />
    </StyledWheelPicker>
  );
};

const WheelPicker = ({ children, ...props }: Props) => {
  return (
    <WheelPickerProvider>
      <Picker {...props}>{children}</Picker>
    </WheelPickerProvider>
  );
};

export default WheelPicker;
