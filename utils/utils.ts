import { TQuestions } from "@/types/TQuestions";

export const getQuestionsByChapter = <T>(
  chaptersList: TQuestions<T>[],
  chapter: string
): TQuestions<T> => {
  const questionsByChapter = chaptersList.filter((ch) => {
    return ch.chapterName === chapter;
  });

  return questionsByChapter[0];
};

export const getChapterNamesList = <T>(
  chaptersList: TQuestions<T>[]
): string[] => {
  const chapterNames = chaptersList.map((ch) => ch.chapterName);

  return chapterNames;
};
