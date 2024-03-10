"use client";

import { TAccountsPlan } from "@/types/TAccountsPlan";
import { Tooltip } from "@nextui-org/react";

export const DisplayQuestion = ({
  question,
}: {
  question: TAccountsPlan | null;
}) => {
  return (
    <div>
      <Tooltip content={question?.code} color="primary" placement="top-start">
        <p onClick={(e) => alert(question?.code)}>{question?.text}</p>
      </Tooltip>
    </div>
  );
};
