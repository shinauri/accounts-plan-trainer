"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Input, Tooltip } from "@nextui-org/react";
import BraceSvg from "../brace-svg"; // Adjust path if needed
import { Journal } from "@/store";

interface JournalEntryRowProps {
  entry: Journal;
  index: number;
}

const JournalEntryRow: React.FC<JournalEntryRowProps> = ({ entry, index }) => {
  const [userInput, setUserInput] = useState<string>("");
  const [status, setStatus] = useState<"default" | "success" | "danger">(
    "default"
  );

  useEffect(() => {
    if (userInput === "") {
      return;
    }
    if (+userInput === entry.value) {
      // Comparing floats
      setStatus("success");
    } else {
      setStatus("danger");
    }
  }, [entry.value]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (value === "") {
      setStatus("default");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setStatus("danger"); // Or 'warning' if you prefer for non-numeric
      return;
    }

    // Compare with correctAmount (consider floating point precision if necessary)
    if (numValue === entry.value) {
      // Comparing floats
      setStatus("success");
    } else {
      setStatus("danger");
    }
  };

  const handleClear = () => {
    setUserInput("");
    setStatus("default");
  };

  const accounts = entry.id.split("-");
  const meanings = entry.meaning.split("-");

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <span className="font-medium w-6 text-right text-gray-600 dark:text-gray-400">
        <b>{`${index}.)`}</b>
      </span>

      <div className="flex flex-col justify-between text-md h-14 w-14 leading-tight">
        <div className="flex flex-row justify-between">
          <div className="text-green-500">დ.</div>
          <div>
            <Tooltip content={meanings[0]} color="primary" placement="top">
              <b onClick={(e) => alert(meanings[0])}>{accounts[0]}</b>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-red-500">კ.</div>
          <div>
            <Tooltip content={meanings[1]} color="primary" placement="bottom">
              <b onClick={(e) => alert(meanings[1])}>{accounts[1]}</b>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 w-4 text-gray-500 dark:text-gray-400">
        <BraceSvg strokeWidth={1} />
      </div>

      <Input
        //aria-label={`Amount for entry ${1}`}
        type="number"
        inputMode="decimal"
        placeholder=""
        value={userInput}
        onChange={handleInputChange}
        onClear={userInput ? handleClear : undefined}
        isClearable={true}
        color={status}
        //variant="bordered"
        size="sm"
        className="w-28 sm:w-32"
        classNames={{
          input:
            "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
        }}
      />
    </div>
  );
};

export default JournalEntryRow;
