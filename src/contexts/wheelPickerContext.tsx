import { PropsWithChildren, createContext, useState } from "react";

interface IProviderValue {
  wheelPicker: null | HTMLDivElement;
  setWheelPicker: React.Dispatch<React.SetStateAction<null | HTMLDivElement>>;
}

const initialValue = {
  wheelPicker: null,
} as IProviderValue;

export const wheelPickerContext = createContext(initialValue);
export const WheelPickerProvider = ({ children }: PropsWithChildren) => {
  const [wheelPicker, setWheelPicker] = useState(initialValue.wheelPicker);
  return (
    <wheelPickerContext.Provider value={{ wheelPicker, setWheelPicker }}>
      {children}
    </wheelPickerContext.Provider>
  );
};
