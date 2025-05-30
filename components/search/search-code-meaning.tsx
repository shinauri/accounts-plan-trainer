"use client";
import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { TQuestions } from "@/types/TQuestions";
import { TAccountsPlan } from "@/types/TAccountsPlan";

export type SearchCodeMeaningProps = {
  questions: TQuestions<TAccountsPlan>[];
};

export default function SearchCodeMeaning({
  questions,
}: SearchCodeMeaningProps) {
  const [number, setNumber] = useState<string>("");
  const [codeMening, setCodeMening] = useState<{
    title: string;
    mening: string;
  } | null>(null);

  const findCodeMening = (code: number) => {
    for (const chapter of questions) {
      if (chapter.items && Array.isArray(chapter.items)) {
        for (const item of chapter.items) {
          if (item.code === code) {
            return {
              title: chapter.chapterName,
              mening: item.text,
            };
          }
        }
      }
    }

    return null;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const code = event.target.value.slice(0, 4);
    setNumber(code);

    if (code.length !== 4) {
      setCodeMening(null);
      return;
    }

    const result = findCodeMening(+code);
    setCodeMening(result);
  };

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <div className="flex flex-col gap-3 h-2/4 min-w-[320px] sm:w-full md:w-full lg:w-2/6">
        <Card className="w-full max-h-[350px]">
          <CardBody className="overflow-hidden">
            <div className="flex justify-between gap-3">
              <Input
                className=""
                isClearable
                size={"lg"}
                type="number"
                value={number}
                onChange={handleChange}
                maxLength={4}
                placeholder="შეიყვანეთ კოდი"
                onClear={() => {
                  setNumber("");
                  setCodeMening(null);
                }}
              />
            </div>
          </CardBody>
        </Card>
      </div>
      <Card className="w-full lg:w-2/6">
        {codeMening ? (
          <>
            <CardHeader className="min-h-[75px]">{codeMening.title}</CardHeader>
            <Divider />
            <CardBody className="h-auto">{codeMening.mening}</CardBody>
          </>
        ) : number.length === 4 ? (
          <CardBody className="h-auto">
            <div
              style={{ color: "red" }}
            >{`კოდით ${number}, ვერაფერი მოიძებნა`}</div>
          </CardBody>
        ) : null}
      </Card>
    </div>
  );
}
