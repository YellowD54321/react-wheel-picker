import { PropsWithChildren } from "react";
import StyledUnit from "./Unit.styles";

const Unit = ({ children }: PropsWithChildren) => {
  return <StyledUnit>{children}</StyledUnit>;
};

export default Unit;
