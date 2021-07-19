import { useEffect, useState } from "react";
import { DraggableOptions, DraggableInputState } from "./types";

export const useDraggableInput = (
  inputRef: HTMLInputElement | undefined,
  dragElementRef: HTMLElement | undefined,
  options: DraggableOptions,
  currentValue: number,
  setCurrentValue: React.Dispatch<React.SetStateAction<number>>
): DraggableInputState => {
  const [mouseX, setMouseX] = useState(0);

  const updatePointerPosition = (position: number): void => {
    if (dragElementRef) {
      dragElementRef.style.left = `${position}px`;
    }
  };

  const onMouseDown = (e: MouseEvent): void => {
    inputRef?.requestPointerLock();
    setMouseX(e.clientX);
    updatePointerPosition(e.clientX);
    inputRef?.addEventListener(
      "mouseup",
      () => {
        document.exitPointerLock();
      },
      false
    );
  };

  const onMouseMove = (e: MouseEvent): void => {
    const lockedElement = document.pointerLockElement;

    if (!lockedElement) {
      return;
    }

    const incrementDelta = e.movementX < mouseX ? -1 : 1;
    setMouseX((mouseX) => {
      let newMouseX = mouseX + e.movementX;
      if (newMouseX > window.innerWidth) {
        newMouseX = 0;
      }
      if (newMouseX < 0) {
        newMouseX = window.innerWidth;
      }
      updatePointerPosition(newMouseX);
      return newMouseX;
    });

    setCurrentValue((currentValue) => {
      const increment = incrementDelta * options.step;
      let newValue = currentValue + increment;
      newValue = Math.min(newValue, options.max);
      newValue = Math.max(newValue, options.min);
      if (inputRef) {
        inputRef.value = newValue.toString();
      }
      return newValue;
    });
  };

  const onMouseLeave = (): void => {
    return;
  };

  const onPointerLockChange = (): void => {
    const lockedElement = document.pointerLockElement;
    if (dragElementRef) {
      dragElementRef.style.display = lockedElement ? "block" : "none";
    }
  };

  useEffect(() => {
    if (!inputRef) {
      return;
    }
    inputRef.addEventListener("mousedown", onMouseDown);
    inputRef.addEventListener("mousemove", onMouseMove);
    inputRef.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("pointerlockchange", onPointerLockChange, false);

    return () => {
      inputRef.removeEventListener("mousedown", onMouseDown);
      inputRef.removeEventListener("mousemove", onMouseMove);
      inputRef.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener(
        "pointerlockchange",
        onPointerLockChange,
        false
      );
    };
  }, [inputRef]);

  return {
    currentValue,
  };
};
export default useDraggableInput;
