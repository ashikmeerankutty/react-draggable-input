import { ReactElement } from "react";

export interface DraggableInputProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dragElement?: ReactElement;
  options?: DraggableOptions;
  className?: string;
  initialValue?: number;
}

export interface DraggableInputState {
  currentValue: number;
}

export interface PortalProps {
  children: ReactElement;
}

export type DraggableOptions = {
  min: number;
  max: number;
  step: number;
  initialValue: number;
};
