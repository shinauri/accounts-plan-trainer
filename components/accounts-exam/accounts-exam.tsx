"use client";

import CodeInput from "@/components/code-input/code-input";
import { DisplayQuestion } from "@/components/questions/display-question";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Skeleton,
} from "@nextui-org/react";

import React, { useEffect, useState } from "react";
import AcountsList from "./acounts-list";
import { getChapterNamesList, getQuestionsByChapter } from "@/utils/utils";
import ChaptersList from "./chapters-list";
import { TAccountsPlan } from "@/types/TAccountsPlan";
import { useRandomQusetionGenerator } from "@/hooks/random-questions-generator";
import { TQuestions } from "@/types/TQuestions";
import { IsAnswerCorrect } from "../is-answer-correct";
import ExamResults from "../exam-results/exam-results";
import { TTest } from "@/types/TTest";

export type AccountsExamProps = {
  questions: TQuestions<TAccountsPlan>[];
  initialChapter: string;
};

export default function AccountsExam({
  questions,
  initialChapter,
}: AccountsExamProps) {
  const [chapter, setChapter] = useState(initialChapter);
  const [test, setTest] = useState<TTest<TAccountsPlan> | null>(null);
  const [questionsByChapter, setQuestionsByChapter] = useState(
    getQuestionsByChapter(questions, chapter)
  );
  const { getNextQuestion, setQuestionGenerator } =
    useRandomQusetionGenerator<TAccountsPlan>(questionsByChapter);

  const [currentQuestion, setCurrentQuestion] = useState<TAccountsPlan | null>(
    null
  );

  const [chapterNames, setChapterNames] = useState<string[]>([]);

  useEffect(() => {
    const chapters = getChapterNamesList(questions);
    setChapterNames(chapters);
  }, [questions]);

  useEffect(() => {
    if (!chapter.length) {
      return;
    }
    const qByChapters = getQuestionsByChapter(questions, chapter);
    setQuestionsByChapter(qByChapters);
    setTest(null);
    setQuestionGenerator(qByChapters);
    setNextQuestion();
  }, [chapter]);

  function handleCheck(code: number | null) {
    if (!currentQuestion) {
      return;
    }

    setTest({
      ...currentQuestion,
      result: currentQuestion.code === code,
    });

    setNextQuestion();
  }

  function handleNext() {
    if (currentQuestion) {
      setTest({
        ...currentQuestion,
        result: false,
      });
    }
    setNextQuestion();
  }

  function handleType(code: number) {
    setTest(null);
  }

  function setNextQuestion() {
    const q = getNextQuestion();
    setCurrentQuestion(q);
  }

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <div className="flex flex-col gap-3 h-2/4 min-w-[320px] sm:w-full md:w-full lg:w-2/6">
        <Card className="w-full max-h-[350px]">
          <CardHeader className="min-h-[75px]">
            <DisplayQuestionLayout question={currentQuestion} />
          </CardHeader>
          <Divider />
          <CardBody className="overflow-hidden">
            <CodeInput
              onCheck={handleCheck}
              onNext={handleNext}
              onType={handleType}
            />
          </CardBody>
          <Divider />
          <CardFooter className="min-h-[75px]">
            {test && (
              <IsAnswerCorrect
                correctAnswer={<CorrectAnswerLayout text="პასუხი სწორეა" />}
                inCorrectAnswer={
                  <IncorrectAnswerLayout text={test.text} code={test.code} />
                }
                isCorrect={test.result}
              />
            )}
          </CardFooter>
        </Card>
        <ExamResults examItem={test} />
      </div>
      <Card className="sm:w-full md:w-full lg:w-2/4">
        <CardHeader className="flex gap-3">
          <ChaptersListLayout chapters={chapterNames} onSelect={setChapter} />
        </CardHeader>
        <Divider />
        <CardBody className="h-[500px]">
          <AcountsList accounts={questionsByChapter} />
        </CardBody>
      </Card>
    </div>
  );
}

function DisplayQuestionLayout({
  question,
}: {
  question: TAccountsPlan | null;
}) {
  return (
    <>
      {!question ? (
        <Skeleton className="w-full rounded-lg">
          <div className="h-3 w-full rounded-lg bg-default-300 mb-2"></div>
        </Skeleton>
      ) : (
        <DisplayQuestion question={question} />
      )}
    </>
  );
}

function ChaptersListLayout({
  chapters,
  onSelect,
}: {
  chapters: string[];
  onSelect: (item: string) => void;
}) {
  return (
    <>
      {!chapters.length ? (
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-12 w-2/5 rounded-lg bg-default-300"></div>
        </Skeleton>
      ) : (
        <ChaptersList chapterNames={chapters} onSelect={onSelect} />
      )}
    </>
  );
}

function CorrectAnswerLayout({ text }: { text: string }) {
  return (
    <Chip color="success" radius="sm" size="lg">
      {text}
    </Chip>
  );
}

function IncorrectAnswerLayout({ text, code }: { text: string; code: number }) {
  return (
    <div className="text-red-500 font-semibold">
      <span>{text}:</span>
      &nbsp;&nbsp;
      <span>{code}</span>
    </div>
  );
}
