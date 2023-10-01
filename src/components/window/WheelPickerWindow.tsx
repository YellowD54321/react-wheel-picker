import {
  MouseEventHandler,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { StyledPaper, StyledWindow } from "./WheelPickerWindow.styles";
import WheelPicker from "../wheelPicker/WheelPicker";

interface Props extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const WheelPickerWindow = ({
  children,
  isOpen,
  onClose,
  onConfirm,
  ...props
}: Props) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [openStatus, setOpenStatus] = useState<
    "hide" | "opening" | "display" | "closing"
  >("hide");

  useEffect(() => {
    const tappayWindow = windowRef.current;
    if (!tappayWindow) {
      return;
    }

    const toggleHide = () => {
      setOpenStatus((preStatus) =>
        preStatus === "closing" ? "hide" : "display"
      );
    };

    tappayWindow.addEventListener("animationend", toggleHide);
    return () => {
      tappayWindow.removeEventListener("animationend", toggleHide);
    };
  }, []);

  useEffect(() => {
    if (isOpen && openStatus === "hide") {
      setOpenStatus("opening");
      return;
    }

    if (!isOpen && openStatus === "display") {
      setOpenStatus("closing");
    }
  }, [isOpen]);

  const handleClickWindow: MouseEventHandler = (e) => {
    const target = e.target;
    if (target !== windowRef.current) {
      return;
    }
    onClose();
  };

  return (
    <StyledWindow
      ref={windowRef}
      $status={openStatus}
      onClick={handleClickWindow}
    >
      <StyledPaper><WheelPicker>{children}</WheelPicker></StyledPaper>
    </StyledWindow>
  );
};

export default WheelPickerWindow;
