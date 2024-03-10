"use client";

import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";

export type CodeInputProps = {
  onCheck: (code: number) => void;
  onType?: (code: number) => void;
  onNext: () => void;
  maxLength?: number;
};

export default function CodeInput({
  onCheck,
  onNext,
  onType,
  maxLength = 4,
}: CodeInputProps) {
  const [number, setNumber] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const code = event.target.value.slice(0, maxLength);
    if (onType && code.length === 1) {
      onType(+code);
    }
    setNumber(code);
  };

  const handleCheck = () => {
    if (!number) {
      return;
    }
    onCheck(+number);
    setNumber("");
  };

  const handleNext = () => {
    setNumber("");
    onNext();
  };

  const isDisabled = number === "" || number.length < maxLength;

  return (
    <div className="flex justify-between flex-wrap gap-3">
      <div className="w-full md:w-auto">
        <Input
          className=""
          size={"lg"}
          type="number"
          value={number}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          maxLength={4}
          placeholder="შეიყვანეთ კოდი"
        />
      </div>
      <div className="flex w-full md:w-auto justify-between gap-3">
        <Button
          disabled={isDisabled}
          onClick={handleCheck}
          color={isDisabled ? "default" : "primary"}
          size={"lg"}
        >
          შეამოწმე
        </Button>
        <Button onClick={handleNext} color="warning" size={"lg"}>
          არ ვიცი
        </Button>
      </div>
    </div>
  );
}
