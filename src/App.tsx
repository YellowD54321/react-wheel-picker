import React, { useState } from "react";
import WheelPicker from "./components/wheelPicker/WheelPicker";
import WheelPickerColumn from "./components/wheelPickerColumn/WheelPickerColumn";
import { styled } from "styled-components";
import WheelPickerWindow from "./components/window/WheelPickerWindow";
import Unit from "./components/unit/Unit";
import "./app.css";

const testList = new Array(100).fill("").map((_, index) => `${index + 2}`);
const testListSecond: { [key: string]: string[] } = {};
for (const testItem of testList) {
  testListSecond[testItem] = new Array(100)
    .fill("")
    .map((_, index) => `${testItem}-${index}`);
}

console.log("testListSecond", testListSecond);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: white;
`;

function App() {
  const [firstValue, setFirstValue] = useState<string>(testList[0]);
  const [secondValue, setSecondValue] = useState<string>(
    testListSecond[testList[0]][0]
  );
  const [isOpenWheelPickerWindow, setIsOpenWheelPickerWindow] = useState(false);

  const handleChangeFirstSelect = (value: string) => {
    setFirstValue(value);
    setSecondValue(testListSecond[value][0]);
  };

  const handleChangeSecondSelect = (value: string) => {
    setSecondValue(value);
  };

  const handleOpenWheelPicker = () => {
    setIsOpenWheelPickerWindow(true);
  };

  const handleCloseWheelPicker = () => {
    return setIsOpenWheelPickerWindow(false);
  };

  return (
    <Wrapper>
      <h4>{`first value: ${firstValue}`}</h4>
      <h4>{`second value: ${secondValue}`}</h4>
      <button onClick={handleOpenWheelPicker}>open wheel picker</button>
      <WheelPicker>
        <WheelPickerColumn
          value={firstValue}
          onChange={handleChangeFirstSelect}
          datas={testList}
          defaultValue={testList[5]}
        />
        <WheelPickerColumn
          value={secondValue}
          onChange={handleChangeSecondSelect}
          datas={testListSecond[firstValue]}
          defaultValue={testListSecond[firstValue][4]}
        />
      </WheelPicker>
      {/* <WheelPickerWindow
        isOpen={isOpenWheelPickerWindow}
        onClose={handleCloseWheelPicker}
        onConfirm={handleCloseWheelPicker}
      >
        <WheelPickerColumn
          value={firstValue}
          onChange={handleChangeFirstSelect}
          datas={testList}
          defaultValue={testList[5]}
          className="red"
          // style={{ fontSize: "3rem" }}
        />
        <Unit>市</Unit>
        <WheelPickerColumn
          value={secondValue}
          onChange={handleChangeSecondSelect}
          datas={testListSecond[firstValue]}
          defaultValue={testListSecond[firstValue][4]}
        />
        <Unit>Month</Unit>
      </WheelPickerWindow> */}
    </Wrapper>
  );
}

export default App;
