import { Switch } from "@nextui-org/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

export type HelpRequestProps = {
  onText?: string;
  offText?: string;
  onChange: (val: boolean) => void;
};

export default function HelpRequest({
  onText = "დამეხმარე",
  offText = "ჩემით გავაკეთებ",
  onChange = () => {},
}: HelpRequestProps) {
  const [isHelpNeeded, setIsHelpNeeded] = useState(false);
  const [helpNeededTxt, sethelpNeededTxt] = useState(onText);

  useEffect(() => {
    const helpText = !isHelpNeeded ? onText : offText;
    sethelpNeededTxt(helpText);
    onChange(isHelpNeeded);
  }, [isHelpNeeded]);

  return (
    <Switch isSelected={isHelpNeeded} onValueChange={setIsHelpNeeded}>
      {helpNeededTxt}
    </Switch>
  );
}
