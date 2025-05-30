"/t-account/index.tsx";

"use client";

import { Account } from "@/store";
import { Input, Tooltip } from "@nextui-org/react";
// Import useMemo from React
import React, { useEffect, useState, useMemo } from "react";

export type TAccountProps = {
  account: Account;
};

export default function TAccount({ account }: TAccountProps) {
  const [userInputs, setUserInputs] = useState<{
    left: string[];
    right: string[];
  }>(() => ({
    left: Array(account.sideRows.left.length).fill(""),
    right: Array(account.sideRows.right.length).fill(""),
  }));

  useEffect(() => {
    setUserInputs({
      left: Array(account.sideRows.left.length).fill(""),
      right: Array(account.sideRows.right.length).fill(""),
    });
  }, [
    account.code,
    account.sideRows.left.length,
    account.sideRows.right.length,
  ]);

  const handleUserInputChange = (
    side: "left" | "right",
    index: number,
    newValue: string
  ) => {
    setUserInputs((prevInputs) => {
      const newSideInputs = [...prevInputs[side]];
      newSideInputs[index] = newValue;
      return {
        ...prevInputs,
        [side]: newSideInputs,
      };
    });
  };

  const renderSide = (side: "left" | "right") => {
    const sideData = account.sideRows[side];
    const userInputData = userInputs[side];

    const allowedValuesFormatted: string[] = account.sideRows[side]
      .filter((v): v is number => v !== null && isFinite(v))
      .map((v) => v.toFixed(2));

    return sideData.map((originalValueInCell, index) => {
      return (
        <GridItem
          key={`${side}-${account.code}-${index}`}
          originalValueInCell={originalValueInCell}
          currentInputValue={userInputData[index]}
          onInputChange={(newValue) =>
            handleUserInputChange(side, index, newValue)
          }
          allowedValuesForSide={allowedValuesFormatted}
          allUserInputsOnThisSide={userInputData}
        />
      );
    });
  };

  // Calculate sums for the summary field using useMemo
  const sumLeft = useMemo(() => {
    if (!account.hasSummaryField) return 0;
    return userInputs.left.reduce((acc, valStr) => {
      const num = parseFloat(valStr);
      // Add to accumulator if it's a valid, finite number
      return !isNaN(num) && isFinite(num) ? acc + num : acc;
    }, 0);
  }, [userInputs.left, account.hasSummaryField]);

  const sumRight = useMemo(() => {
    if (!account.hasSummaryField) return 0;
    return userInputs.right.reduce((acc, valStr) => {
      const num = parseFloat(valStr);
      // Add to accumulator if it's a valid, finite number
      return !isNaN(num) && isFinite(num) ? acc + num : acc;
    }, 0);
  }, [userInputs.right, account.hasSummaryField]);

  // Calculate the final result for display
  const summaryResultValue = useMemo(() => {
    if (!account.hasSummaryField) return 0; // Default to 0 if not applicable
    return sumLeft - sumRight;
  }, [sumLeft, sumRight, account.hasSummaryField]);

  const isBalanced = summaryResultValue === 0;

  return (
    <div className="w-full max-w-xs mx-auto p-1 font-sans bg-white dark:bg-neutral-800 rounded">
      {/* Header section for account code */}
      <div className="">
        <div className="flex justify-between items-baseline">
          <span className="text-1xl font-mono text-gray-600 dark:text-gray-400">
            დ.
          </span>
          <h2 className="text-center font-semibold text-lg mx-2 text-gray-800 dark:text-gray-200">
            <Tooltip content={account.meaning} color="primary" placement="top">
              <p onClick={(e) => alert(account.meaning)}>{account.code}</p>
            </Tooltip>
          </h2>
          <span className="text-1xl font-mono text-gray-600 dark:text-gray-400">
            კ.
          </span>
        </div>
        <div className="border-b-2 border-black dark:border-gray-600 mt-1 mb-1"></div>
      </div>
      {/* Body section for T-account rows and summary */}
      <div>
        <div className="grid grid-cols-2">
          {/* Left Column (Debit) */}
          <div className="border-r-2 border-black dark:border-gray-600 pr-1">
            {renderSide("left")}
          </div>

          {/* Right Column (Credit) */}
          <div className="pl-1">{renderSide("right")}</div>
        </div>{" "}
        {/* End of grid grid-cols-2 */}
        {/* Summary Field Section */}
        {account.hasSummaryField ? (
          <div
            className={`flex justify-end text-center  ${
              isBalanced ? "text-green-500" : "text-red-500"
            }`}
          >
            <div className="w-1/2">{summaryResultValue.toFixed(2)}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type GridItemProps = {
  originalValueInCell: number | null; // Original value for this specific cell (used for placeholder)
  currentInputValue: string;
  onInputChange: (newValue: string) => void;
  allowedValuesForSide: string[]; // All formatted numbers allowed on this side (can have duplicates)
  allUserInputsOnThisSide: string[]; // All current user string inputs for this side
};

export function GridItem({
  originalValueInCell,
  currentInputValue,
  onInputChange,
  allowedValuesForSide,
  allUserInputsOnThisSide,
}: GridItemProps) {
  return (
    <div>
      <EditableDiv
        originalValueInCell={originalValueInCell}
        currentInputValue={currentInputValue}
        onInputChange={onInputChange}
        allowedValuesForSide={allowedValuesForSide}
        allUserInputsOnThisSide={allUserInputsOnThisSide}
      />
      <div className="border-b border-gray-400 dark:border-gray-700"></div>
    </div>
  );
}

export type EditableDivProps = {
  originalValueInCell: number | null;
  currentInputValue: string;
  onInputChange: (newValue: string) => void;
  allowedValuesForSide: string[];
  allUserInputsOnThisSide: string[];
};

export function EditableDiv({
  originalValueInCell,
  currentInputValue,
  onInputChange,
  allowedValuesForSide,
  allUserInputsOnThisSide,
}: EditableDivProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onInputChange(event.target.value);
  };

  const handleClear = () => {
    onInputChange("");
  };

  let inputColor: "success" | "danger" | "warning" | "default" = "default";

  if (currentInputValue === "") {
    inputColor = "default";
  } else {
    const parsedNum = parseFloat(currentInputValue);

    if (isNaN(parsedNum) || !isFinite(parsedNum)) {
      inputColor = "danger"; // Input is not a valid, finite number
    } else {
      const formattedInputValue = parsedNum.toFixed(2); // Normalize user input for comparison

      const isGenerallyAllowed =
        allowedValuesForSide.includes(formattedInputValue);

      if (!isGenerallyAllowed) {
        inputColor = "danger"; // This specific number is not in the list of allowed values for this side
      } else {
        const maxOccurrencesAllowed = allowedValuesForSide.filter(
          (v) => v === formattedInputValue
        ).length;

        const currentUserOccurrences = allUserInputsOnThisSide
          .map((s) => {
            const p = parseFloat(s);
            return !isNaN(p) && isFinite(p)
              ? p.toFixed(2)
              : "__INVALID_FOR_COUNTING__";
          })
          .filter((v) => v === formattedInputValue).length;

        if (currentUserOccurrences > maxOccurrencesAllowed) {
          inputColor = "warning"; // User has entered this number more times than allowed
        } else {
          inputColor = "success"; // Allowed and within frequency limits
        }
      }
    }
  }

  return (
    <div>
      <Input
        classNames={{
          input:
            "text-left text-sm py-1 px-2 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
          inputWrapper:
            "h-auto min-h-[2em] rounded-none bg-transparent shadow-none border-0 p-0",
        }}
        isClearable={currentInputValue !== ""}
        color={inputColor}
        size={"sm"}
        // placeholder={
        //   originalValueInCell !== null && isFinite(originalValueInCell)
        //     ? originalValueInCell.toFixed(2)
        //     : ""
        // }
        variant="flat"
        radius="none"
        type="text"
        inputMode="decimal"
        value={currentInputValue}
        onChange={handleChange}
        onClear={handleClear}
      />
    </div>
  );
}
