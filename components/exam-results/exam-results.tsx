"use client";

import { TAccountsPlan } from "@/types/TAccountsPlan";
import { TTest } from "@/types/TTest";
import {
  Accordion,
  AccordionItem,
  Card,
  Chip,
  Listbox,
  ListboxItem,
  Tooltip,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

type TTestedListItem = TAccountsPlan & { correctAnswers: number };
type ExamState = Map<number, TTest<TTestedListItem>>;

export default function ExamResults({
  examItem,
}: {
  examItem: TTest<TAccountsPlan> | null;
}) {
  const [examItems, setExamItems] = useState<ExamState>(new Map());

  useEffect(() => {
    if (!examItem) {
      return;
    }

    const newItem = {
      ...examItem,
      correctAnswers: 0,
    };

    const listItem = examItems.get(examItem.code);

    if (listItem) {
      newItem.correctAnswers = examItem.result
        ? listItem.correctAnswers + 1
        : listItem.correctAnswers - 1;
    } else {
      newItem.correctAnswers = examItem.result ? 1 : -1;
    }

    setExamItems(
      (prevItems) =>
        new Map([...Array.from(prevItems), [newItem.code, newItem]])
    );
  }, [examItem]);

  const getChipColor = (num: number) => {
    return num > 0 ? "primary" : num === 0 ? "warning" : "danger";
  };

  return (
    <Accordion variant="shadow">
      <AccordionItem aria-label="results" title="შედეგები">
        <Card
          shadow="none"
          className="w-full max-h-[270px] overflow-y-auto overflow-x-auto"
        >
          <Listbox aria-label="accounts" onAction={(key) => alert(key)}>
            {Array.from(examItems.entries()).map(([key, item]) => {
              return (
                <ListboxItem key={item.code} textValue={item.text}>
                  <Tooltip
                    content={`${item.code} : ${item.text}`}
                    color="primary"
                    placement="top-start"
                  >
                    <div>
                      <Chip
                        isDisabled
                        color={getChipColor(item.correctAnswers)}
                      >
                        {item.correctAnswers}
                      </Chip>
                      &nbsp;
                      <span>{item.text}</span>
                    </div>
                  </Tooltip>
                </ListboxItem>
              );
            })}
          </Listbox>
        </Card>
      </AccordionItem>
    </Accordion>
  );
}
