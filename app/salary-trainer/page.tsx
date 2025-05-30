import SalaryTrainer from "@/components/salary-trainer";
import { angarish_gegma } from "@/data/angarishgegma";
import { TAccountsPlan } from "@/types/TAccountsPlan";
import { TQuestions } from "@/types/TQuestions";

const questions: TQuestions<TAccountsPlan>[] = angarish_gegma;

export default function SalaryTrainerPage() {
  return (
    <main className="min-h-screen p-5 bg-slate-200">
      <section className="">
        <SalaryTrainer />
      </section>
    </main>
  );
}
