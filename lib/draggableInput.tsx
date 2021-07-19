import React, { cloneElement, useState } from "react";

import { useDraggableInput } from "./hook";
import Portal from "./portal";
import { DraggableInputProps, DraggableOptions } from "./types";

const defaultOptions: DraggableOptions = {
  min: 10,
  max: 3000,
  step: 4,
  initialValue: 1000,
};

const draggableElementStyle = {
  fontSize: "20px",
  display: "none",
  zIndex: 100,
  position: "fixed" as const,
  top: 0,
  left: 0,
};

export const DraggableInput: React.FC<DraggableInputProps> = ({
  dragElement = <span style={draggableElementStyle}>↔</span>,
  options,
  onChange,
  className,
  initialValue = 0,
}) => {
  const [inputRef, setInputRef] = useState<HTMLInputElement>();
  const [dragElementRef, setDragElementRef] = useState<HTMLElement>();
  const [currentValue, setCurrentValue] = useState(initialValue);

  useDraggableInput(
    inputRef,
    dragElementRef,
    {
      ...options,
      ...defaultOptions,
    },
    currentValue,
    setCurrentValue
  );

  const renderDragElement = () => (
    <Portal>
      {cloneElement(dragElement, {
        ref: (ref: HTMLElement) => setDragElementRef(ref),
      })}
    </Portal>
  );

  return (
    <>
      {renderDragElement()}
      {
        <input
          type="number"
          className={className}
          value={currentValue}
          onChange={(e) => {
            setCurrentValue(parseFloat(e.target.value));
            if (onChange) {
              onChange(e);
            }
          }}
          ref={(ref: HTMLInputElement) => setInputRef(ref)}
        />
      }
    </>
  );
};
