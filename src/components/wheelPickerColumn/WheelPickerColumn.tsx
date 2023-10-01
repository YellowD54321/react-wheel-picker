import { MouseEventHandler, useContext, useEffect, useRef } from "react";
import {
  StyledWheelPickerColumnOption,
  StyledWheelPickerColumnWrapper,
} from "./WheelPickerColumn.styles";
import { wheelPickerContext } from "../../contexts/wheelPickerContext";
import { PICKER_HEIGHT_PX, SELECTED_REGION_HEIGHT_PX } from "../../constants";

const OPTION_MARGIN_TOP = SELECTED_REGION_HEIGHT_PX / 2;
const FONT_HEIGHT = 1 * 16;

const GRAB_SLIDE_MS = 100;
const GRAB_RECORD_NUMBER = 10;

const WheelPickerColumn = ({
  value,
  onChange,
  datas,
  defaultValue,
  className,
  style,
}: {
  value: string;
  onChange: (text: string) => void;
  datas: string[] | string;
  defaultValue?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { wheelPicker } = useContext(wheelPickerContext);
  const selectRef = useRef<HTMLUListElement | null>(null);
  const optionsRef = useRef<Map<string, HTMLLIElement> | null>(null);
  const grab = useRef(getInitialGrab());
  const grabSliderId = useRef<number>(0);

  useEffect(() => {
    const selectElement = selectRef.current;
    if (!selectElement) {
      return;
    }
    selectElement.addEventListener("scroll", handleScroll);
    selectElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    const grabRecordTimer = setInterval(
      recordGrabDistance,
      GRAB_SLIDE_MS / GRAB_RECORD_NUMBER
    );
    return () => {
      selectElement.removeEventListener("scroll", handleScroll);
      selectElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      clearInterval(grabRecordTimer);
    };
  }, []);

  // initial observer
  useEffect(() => {
    if (!wheelPicker) {
      return;
    }
    const pickerHeight = PICKER_HEIGHT_PX;
    const selectRegionHeight = SELECTED_REGION_HEIGHT_PX;
    const INACCURACY_PIXEL = 5;
    const margin = (pickerHeight - selectRegionHeight) / 2 - INACCURACY_PIXEL;
    const options = {
      root: wheelPicker,
      rootMargin: `-${margin}px 0px -${margin}px 0px`,
      threshold: 1.0,
    };
    const observer = new IntersectionObserver((entries) => {
      if (!optionsRef.current) {
        return;
      }
      if (Array.isArray(datas) && entries?.length >= datas?.length) {
        // will get the entire data list when the very beginning
        // set value to default value or first item.
        onChange(defaultValue || datas[0] || "");
        return;
      }
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        const list = [...optionsRef.current.values()];
        const target = list.find((option) => option === entry.target);
        if (!target) {
          continue;
        }
        // get display text and set it as value
        const value = target.innerHTML;
        onChange(value);
      }
    }, options);

    if (!optionsRef.current || optionsRef.current.size <= 0) {
      return;
    }
    for (const targetElement of optionsRef.current.values()) {
      observer.observe(targetElement);
    }
    // scroll to default value or top
    scrollToTarget();
    // set style when initialization
    handleScroll();
  }, [wheelPicker, datas]);

  function getInitialGrab() {
    return {
      isGrabbing: false,
      startY: 0,
      previousY: 0,
      currentY: 0,
      distance: 0,
      distances: new Array(GRAB_RECORD_NUMBER).fill(0),
      timeCounter: 0,
      scrollTop: 0,
    };
  }

  /**
   * Sliding select element after grabbing finished on PC.
   * Keep sliding if distance still exists.
   * @param {number} distance first distance is distance of grabbing. Then decrease whenever function is called.
   */
  const grabSliding = (distance: number) => {
    distance *= 0.8;
    const selectElement = selectRef.current;
    if (!selectElement) {
      window.cancelAnimationFrame(grabSliderId.current);
      grab.current = getInitialGrab();
      return;
    }
    selectElement.scrollTop -= distance;
    if (
      Math.abs(distance) > 1 &&
      selectElement.scrollTop > 0 &&
      selectElement.scrollTop <
        selectElement.scrollHeight - selectElement.offsetHeight
    ) {
      // if distance is still exists, run it again.
      grabSliderId.current = window.requestAnimationFrame(() =>
        grabSliding(distance)
      );
    } else {
      window.cancelAnimationFrame(grabSliderId.current);
      // add scroll-snap-type back after sliding is finished.
      selectElement.style.scrollSnapType = "y mandatory";
      // initial grab data.
      grab.current = getInitialGrab();
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    // conflix with scroll-snap-type effect. remove it when grabbing.
    const selectElement = selectRef.current;
    if (!selectElement) {
      return;
    }
    selectElement.style.scrollSnapType = "none";
    // set grab data
    grab.current = getInitialGrab();
    grab.current.isGrabbing = true;
    grab.current.startY = e.pageY;
    grab.current.currentY = e.pageY;
    grab.current.previousY = e.pageY;
    grab.current.distances = new Array(GRAB_RECORD_NUMBER).fill(0);
    grab.current.timeCounter = 0;
    grab.current.scrollTop = selectElement.scrollTop;
    window.cancelAnimationFrame(grabSliderId.current);
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    const selectElement = selectRef.current;
    if (!selectElement || !grab.current.isGrabbing) {
      return;
    }
    // keep select staying with mouse.
    const dy = e.pageY - grab.current.startY;
    const startScrollTop = grab.current.scrollTop;
    selectElement.scrollTop = startScrollTop - dy;
    // record current Y
    grab.current.currentY = e.pageY;
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    // calculate grab distance.
    const dy = grab.current.distances.reduce((sum, dy) => sum + dy, 0);
    // disable grabbing.
    grab.current.isGrabbing = false;
    // run sliding.
    window.cancelAnimationFrame(grabSliderId.current);
    grabSliderId.current = window.requestAnimationFrame(() => grabSliding(dy));
  };

  // change option's style when select scrolling.
  const handleScroll = () => {
    const selectElement = selectRef.current;
    if (!selectElement || !optionsRef.current) {
      return;
    }
    const options = [...optionsRef.current.values()];
    const selectHeight = selectElement.offsetHeight;
    const scrollTop = selectElement.scrollTop;
    for (const option of options) {
      const optionHeight = option.offsetHeight + OPTION_MARGIN_TOP * 2;
      const selectRetionTopY = scrollTop;
      const selectRegionBottomY = selectRetionTopY + SELECTED_REGION_HEIGHT_PX;
      const optionOffsetTop = option.offsetTop;
      const optionTop = optionOffsetTop - optionHeight;

      if (optionTop + FONT_HEIGHT <= selectRetionTopY) {
        const topRegionHeight = (selectHeight - SELECTED_REGION_HEIGHT_PX) / 2;
        const ratio = (selectRetionTopY - optionTop) / topRegionHeight;
        option.style.opacity = `${(1 - ratio) * 0.5}`;
      } else if (optionTop + FONT_HEIGHT >= selectRegionBottomY) {
        const bottomRegionHeight =
          (selectHeight - SELECTED_REGION_HEIGHT_PX) / 2;
        const ratio = (optionTop - selectRegionBottomY) / bottomRegionHeight;
        option.style.opacity = `${(1 - ratio) * 0.5}`;
      } else {
        option.style.opacity = "1";
      }
    }
  };

  // record grab distance when select is grabbing on pc.
  const recordGrabDistance = () => {
    if (grab.current.isGrabbing !== true) {
      return;
    }
    // record distance
    grab.current.distances[grab.current.timeCounter] =
      grab.current.currentY - grab.current.previousY;
    // update previous y
    grab.current.previousY = grab.current.currentY;
    // set next array index
    grab.current.timeCounter += 1;
    if (grab.current.timeCounter >= GRAB_RECORD_NUMBER) {
      grab.current.timeCounter = 0;
    }
  };

  const scrollToY = (y: number) => {
    const selectElement = selectRef.current;
    if (!selectElement) {
      return;
    }
    selectElement.scrollTo({
      top: y,
    });
  };

  const scrollToTop = () => {
    scrollToY(0);
  };

  const scrollToTarget = () => {
    if (!defaultValue || !optionsRef.current || optionsRef.current.size <= 0) {
      scrollToTop();
      return;
    }
    // if there is an option's display text equals to default value, set it as target.
    const targetElement = [...optionsRef.current.values()].find(
      (option) => option.textContent === defaultValue
    );
    if (!targetElement) {
      scrollToTop();
      return;
    }
    targetElement.scrollIntoView({
      block: "center",
    });
  };

  const handleClickOption: MouseEventHandler<HTMLLIElement> = (e) => {
    const CLICK_RANGE = 10;
    if (
      grab.current.startY &&
      Math.abs(grab.current.startY - e.pageY) >= CLICK_RANGE
    ) {
      return;
    }
    const element = e.target as HTMLLIElement;
    const offsetTop = element.offsetTop;
    const y = offsetTop - SELECTED_REGION_HEIGHT_PX * 2;
    scrollToY(y);
  };

  // if datas is a single data instead of array, set it as array.
  const options = !datas ? [""] : !Array.isArray(datas) ? [datas] : datas;

  const getRefMap = () => {
    if (!optionsRef.current) {
      optionsRef.current = new Map();
    }
    return optionsRef.current;
  };

  return (
    <StyledWheelPickerColumnWrapper
      value={value}
      ref={selectRef}
      className={className || ""}
      style={style}
    >
      {options.map((data, index) => {
        const value = data || "";
        const key = value + index;
        return (
          <StyledWheelPickerColumnOption
            key={key}
            onClick={handleClickOption}
            ref={(node) => {
              const map = getRefMap();
              if (node) {
                map.set(data, node);
              } else {
                map.delete(data);
              }
            }}
          >
            {value}
          </StyledWheelPickerColumnOption>
        );
      })}
    </StyledWheelPickerColumnWrapper>
  );
};

export default WheelPickerColumn;
