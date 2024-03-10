export type IsAnswerCorrectProps = {
  isCorrect: boolean;
  correctAnswer: React.ReactNode | string;
  inCorrectAnswer: React.ReactNode | string;
};

export function IsAnswerCorrect({
  isCorrect = false,
  correctAnswer,
  inCorrectAnswer,
}: IsAnswerCorrectProps) {
  let displayText: React.ReactNode | string = isCorrect
    ? correctAnswer
    : inCorrectAnswer;

  return <div className="w-full">{displayText}</div>;
}
