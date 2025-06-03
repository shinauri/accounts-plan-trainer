"/salary-trainer/index.tsx";

"use client";

import { Card, CardBody, Input, Switch } from "@nextui-org/react";
import TAccount from "../t-account";
import PercentInput from "../percent-input"; // Assuming this component exists and works
import { useEffect, useState, useCallback } from "react"; // Added useCallback
import { useStoreActions, useStoreState } from "easy-peasy";
import { StoreModel } from "@/store"; // Import StoreModel for typing
import JournalEntryRow from "../journal/journal-entry-row";
import HelpRequest from "../help-request";

// Helper to get percentage as a decimal
const getNumberPercent = (value: number): number => {
  if (isNaN(value) || value < 0) return 0; // Basic validation
  return value / 100;
};

// Helper to get the gross-up factor (1 - tax rate as decimal)
const getNumberGrossPercent = (value: number): number => {
  if (isNaN(value) || value < 0) return 1; // Default to 1 if invalid
  if (value > 100) value = 100; // Cap at 100
  return (100 - value) / 100;
};

// Original calculation for Income Tax
const calculateIncomeTaxAmount_Original = (
  incomeTaxRatePercent: number,
  wageBase: number
): number => {
  if (!wageBase || isNaN(wageBase) || wageBase <= 0) return 0;
  if (isNaN(incomeTaxRatePercent) || incomeTaxRatePercent < 0) return 0;

  const percent = getNumberPercent(incomeTaxRatePercent);
  const grossFactor = getNumberGrossPercent(incomeTaxRatePercent);

  if (grossFactor === 0) {
    return wageBase > 0 ? Infinity : 0;
  }
  const val = (wageBase / grossFactor) * percent;
  return val;
};

// Original calculation for Pension Contribution
const calculatePensionAmount_Original = (
  pensionRatePercent: number,
  incomeTaxRatePercent: number,
  wageBase: number
): number => {
  if (!wageBase || isNaN(wageBase) || wageBase <= 0) return 0;
  if (isNaN(pensionRatePercent) || pensionRatePercent < 0) return 0;
  if (isNaN(incomeTaxRatePercent) || incomeTaxRatePercent < 0) return 0;

  const percent = getNumberPercent(pensionRatePercent);
  const incomeTaxGrossFactor = getNumberGrossPercent(incomeTaxRatePercent);
  const pensionGrossFactor = getNumberGrossPercent(pensionRatePercent);

  if (incomeTaxGrossFactor === 0) {
    return wageBase > 0 ? Infinity : 0;
  }
  const baseForPensionCalc = wageBase / incomeTaxGrossFactor;

  if (pensionGrossFactor === 0) {
    return baseForPensionCalc > 0 ? Infinity : 0;
  }

  const val = (baseForPensionCalc / pensionGrossFactor) * percent;
  return val;
};

const useRandomNumber = (baseValue: number): number => {
  const [randomNumber, setRandomNumber] = useState<number>(0);

  useEffect(() => {
    if (typeof baseValue === "number" && baseValue > 0 && isFinite(baseValue)) {
      const generate = () => {
        const min = baseValue * 2;
        const max = baseValue * 3;
        let randomVal = max === min ? min : Math.random() * (max - min) + min;
        setRandomNumber(Math.round(randomVal));
      };
      generate();
    } else {
      setRandomNumber(0);
    }
  }, [baseValue]);

  return randomNumber;
};

// Helper to round to two decimal places, returns null for non-finite or non-positive
const roundPositiveToTwoDecimals = (num: number): number | null => {
  if (!isFinite(num) || num <= 0) return null;
  return Math.round(num * 100) / 100;
};

// Helper to round to two decimal places, returns null for non-finite
const roundToTwoDecimals = (num: number): number | null => {
  if (!isFinite(num)) return null;
  // Allow zero, but not negative for most financial display, adjust if needed
  // if (num < 0) return null; // Uncomment if negative values should also be null
  return Math.round(num * 100) / 100;
};

export default function SalaryTrainer() {
  const salaryAccounts = useStoreState(
    (state: StoreModel) => state.salary.accounts
  );
  const setAccount = useStoreActions(
    (actions: any) => actions.salary.setAccount // Cast to any for simplicity here, or type properly
  );

  const journal = useStoreState((state: StoreModel) => state.journal.items);
  const setJournal = useStoreActions(
    (actions: any) => actions.journal.setJournal // Cast to any for simplicity here, or type properly
  );

  const setIsHelpNeeded = useStoreActions(
    (actions: any) => actions.app.showOriginalData.setShow // Cast to any for simplicity here, or type properly
  );

  const [wageInput, setWageInput] = useState<string>("");
  const [incomeTaxRate, setIncomeTaxRate] = useState<string>("20");
  const [pensionTaxRate, setPensionTaxRate] = useState<string>("2");

  // State for display purposes, actual values for store are calculated in useEffect
  const [displayedIncomeTax, setDisplayedIncomeTax] = useState<number>(0);
  const [displayedPensionContribution, setDisplayedPensionContribution] =
    useState<number>(0);
  const [displayedGrossSalary, setDisplayedGrossSalary] = useState<number>(0);

  const budget = useRandomNumber(+wageInput);

  const onIncomeTaxRateChange = (value: string) => {
    setIncomeTaxRate(value);
  };

  const onPensionTaxRateChange = (value: string) => {
    setPensionTaxRate(value);
  };

  const onWageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setWageInput(event.target.value);
  };

  const clearInputsAndStore = useCallback(() => {
    setWageInput("");
    // Reset displayed values
    setDisplayedIncomeTax(0);
    setDisplayedPensionContribution(0);
    setDisplayedGrossSalary(0);

    // Clear all dependent store values by setting them to null
    // This assumes your TAccount components are set up to handle nulls gracefully
    const codesToClear = [3130, 1210, 3320, 3110, 7410, 7490]; // All account codes used
    codesToClear.forEach((code) => {
      const account = salaryAccounts.find((acc) => acc.code === code);
      if (account) {
        account.sideRows.left.forEach((_, index) => {
          setAccount({ code, index, side: "left", value: null });
        });
        account.sideRows.right.forEach((_, index) => {
          setAccount({ code, index, side: "right", value: null });
        });
      }
    });

    const journalIdsToClear = [
      "3130-1210",
      "3130-3320",
      "3130-3110",
      "7410-3130",
      "7490-3110",
    ];
    journalIdsToClear.forEach((journalId) => {
      setJournal({
        id: journalId,
        value: null,
      });
    });
  }, [setAccount, salaryAccounts, journal, setJournal]); // salaryAccounts added as it's used to iterate

  const allDataEntered =
    !!wageInput && !!incomeTaxRate && !!pensionTaxRate && +wageInput > 0;

  useEffect(() => {
    const wageNum = +wageInput || 0;
    const incomeRateNum = +incomeTaxRate || 0;
    const pensionRateNum = +pensionTaxRate || 0;

    if (wageNum <= 0) {
      clearInputsAndStore();
      return;
    }

    const incomeTaxGrossFactor = getNumberGrossPercent(incomeRateNum);
    const pensionTaxGrossFactor = getNumberGrossPercent(pensionRateNum);

    // Calculate current values
    const currentIncomeTax = calculateIncomeTaxAmount_Original(
      incomeRateNum,
      wageNum
    );
    const currentPensionContribution = calculatePensionAmount_Original(
      pensionRateNum,
      incomeRateNum,
      wageNum
    );

    let currentGrossSalary = 0;
    if (incomeTaxGrossFactor > 0 && pensionTaxGrossFactor > 0) {
      currentGrossSalary =
        wageNum / incomeTaxGrossFactor / pensionTaxGrossFactor;
    } else if (wageNum > 0) {
      currentGrossSalary = Infinity;
    }

    // Update state for display
    setDisplayedIncomeTax(currentIncomeTax);
    setDisplayedPensionContribution(currentPensionContribution);
    setDisplayedGrossSalary(currentGrossSalary);

    // Update store accounts with NUMBERS or NULL
    const roundedWageNum = roundPositiveToTwoDecimals(wageNum);
    const roundedGrossSalary = roundPositiveToTwoDecimals(currentGrossSalary);
    const roundedIncomeTax = roundPositiveToTwoDecimals(currentIncomeTax);
    const roundedPension = roundPositiveToTwoDecimals(
      currentPensionContribution
    );
    const roundedPensionX2 = roundPositiveToTwoDecimals(
      roundedPension ? roundedPension * 2 : 0
    );
    const roundedBudget = roundPositiveToTwoDecimals(budget);

    setJournal({
      id: "3130-1210",
      value: roundedWageNum,
    });

    setJournal({
      id: "3130-3320",
      value: roundedIncomeTax,
    });

    setJournal({
      id: "3130-3110",
      value: roundedPension,
    });

    setJournal({
      id: "7410-3130",
      value: roundedGrossSalary,
    });

    setJournal({
      id: "7490-3110",
      value: roundedPension,
    });

    // Account 3130
    setAccount({
      code: 3130,
      index: 0,
      side: "right",
      value: roundedGrossSalary,
    });
    setAccount({ code: 3130, index: 0, side: "left", value: roundedWageNum }); // Net wage
    setAccount({ code: 3130, index: 1, side: "left", value: roundedIncomeTax });
    setAccount({ code: 3130, index: 2, side: "left", value: roundedPension });

    // Account 1210
    setAccount({ code: 1210, index: 0, side: "left", value: roundedBudget });
    setAccount({ code: 1210, index: 0, side: "right", value: roundedWageNum });
    setAccount({
      code: 1210,
      index: 1,
      side: "right",
      value: roundedPensionX2,
    });
    setAccount({
      code: 1210,
      index: 2,
      side: "right",
      value: roundedIncomeTax,
    });

    // Account 3320
    setAccount({ code: 3320, index: 0, side: "left", value: roundedIncomeTax });
    setAccount({
      code: 3320,
      index: 0,
      side: "right",
      value: roundedIncomeTax,
    });

    // Account 3110
    setAccount({ code: 3110, index: 0, side: "left", value: roundedPensionX2 });
    setAccount({ code: 3110, index: 0, side: "right", value: roundedPension });
    setAccount({ code: 3110, index: 1, side: "right", value: roundedPension });

    // Account 7410 (Income Tax Payable - assuming this is what it represents)
    // Original logic used grossSalary, which is odd for "Income Tax Payable".
    // If 7410 is "Income Tax Payable", it should be `roundedIncomeTax`.
    // If it's some other expense related to gross, then `roundedGrossSalary`.
    // Sticking to original variable mapping for now.
    setAccount({
      code: 7410,
      index: 0,
      side: "left",
      value: roundedGrossSalary,
    });

    // Account 7490 (Pension Payable)
    setAccount({ code: 7490, index: 0, side: "left", value: roundedPension });
  }, [
    wageInput,
    incomeTaxRate,
    pensionTaxRate,
    budget, // budget is a dependency as it's used in setAccount
    setAccount,
    clearInputsAndStore, // clearInputsAndStore is memoized
  ]);

  const getIncomeTaxText = () => {
    if (!allDataEntered) return "";
    const incomeRateNum = +incomeTaxRate || 0;
    const wageNum = +wageInput || 0;
    const incomeTaxGrossFactor = getNumberGrossPercent(incomeRateNum);
    const incomeTaxPercentFactor = getNumberPercent(incomeRateNum);

    return `(${wageNum.toFixed(2)} / ${incomeTaxGrossFactor.toFixed(
      2
    )}) * ${incomeTaxPercentFactor.toFixed(2)} = ${displayedIncomeTax.toFixed(
      2
    )}`;
  };

  const getPensionTaxText = () => {
    if (!allDataEntered) return "";
    const incomeRateNum = +incomeTaxRate || 0;
    const pensionRateNum = +pensionTaxRate || 0;
    const wageNum = +wageInput || 0;

    const incomeTaxGrossFactor = getNumberGrossPercent(incomeRateNum);
    const pensionTaxGrossFactor = getNumberGrossPercent(pensionRateNum);
    const pensionPercentFactor = getNumberPercent(pensionRateNum);

    return `((${wageNum.toFixed(2)} / ${incomeTaxGrossFactor.toFixed(
      2
    )}) / ${pensionTaxGrossFactor.toFixed(2)}) * ${pensionPercentFactor.toFixed(
      2
    )} = ${displayedPensionContribution.toFixed(2)}`;
  };

  const getNetWageText = () => {
    // This is actually displaying Gross Salary for Accounting
    if (!allDataEntered) return "";
    return `${displayedGrossSalary.toFixed(2)}`;
  };

  return (
    <>
      <Card className="max-h-[400px] mb-4">
        <CardBody className="gap-4 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3">
            <PercentInput
              value={incomeTaxRate}
              onchange={onIncomeTaxRateChange}
              placeholder="საშემოსავლო % (მაგ: 20)"
            />
            <PercentInput
              value={pensionTaxRate}
              onchange={onPensionTaxRateChange}
              placeholder="საპენსიო % (მაგ: 2)"
            />
            <Input
              className="max-w-[300px]"
              classNames={{
                input:
                  "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
              }}
              isClearable
              size={"sm"}
              type="number"
              value={wageInput}
              onChange={onWageInputChange}
              placeholder="შეიყვანეთ ხელფასი (NET)"
              onClear={clearInputsAndStore} // Changed from clearWageInput
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              თქვენი წარმოსახვითი ბიუჯეტია:
              <b> {isFinite(budget) ? budget.toFixed(2) : "0.00"}</b>
            </div>
            <div>საშემოსავლო: {getIncomeTaxText()}</div>
            <div>საპენსიო: {getPensionTaxText()}</div>
            <div>დარიცხული ხელფასი: {getNetWageText()}</div>
            <div>
              <HelpRequest
                onChange={(val: boolean) => {
                  setIsHelpNeeded({ show: val });
                }}
              />
            </div>
          </div>
        </CardBody>
      </Card>
      {allDataEntered ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-5">
            {journal.map((item, idx) => {
              return (
                <div
                  key={item.id}
                  className="p-2 md:p-4 rounded-lg shadow-md flex items-center justify-center bg-sky-100"
                >
                  <JournalEntryRow entry={item} index={idx + 1} />
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {salaryAccounts.map((salaryAccount) => {
              return (
                <div
                  key={salaryAccount.code}
                  className="bg-sky-100 dark:bg-sky-700 p-2 md:p-4 rounded-lg shadow-md flex items-center justify-center"
                >
                  <TAccount account={salaryAccount} />
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </>
  );
}
