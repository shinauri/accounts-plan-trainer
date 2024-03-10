"use client";

import { TQuestions } from "@/types/TQuestions";
import { useRef } from "react";

const getRundomItem = <T>(question: TQuestions<T>): T => {
  const randomIndex = Math.floor(Math.random() * question.items.length);
  return question.items[randomIndex];
};

export function* randomQuestionGenerator<T>(
  question: TQuestions<T>
): Generator<T, T, boolean> {
  let stop = false;
  while (!stop) {
    stop = yield getRundomItem(question);
  }

  return getRundomItem(question);
}

export function useRandomQusetionGenerator<T>(questions: TQuestions<T>) {
  const questionsIterator = useRef<Iterator<T, T, boolean>>(
    randomQuestionGenerator<T>(questions)
  );

  const setQuestionGenerator = (questions: TQuestions<T>): void => {
    questionsIterator.current.next(true).value;
    questionsIterator.current = randomQuestionGenerator<T>(questions);
  };

  const getNextQuestion = (stop = false): T => {
    return questionsIterator.current.next(stop).value;
  };

  return { getNextQuestion, setQuestionGenerator };
}
