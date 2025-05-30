import SearchCodeMeaning from "@/components/search/search-code-meaning";
import { angarish_gegma } from "@/data/angarishgegma";
import { TAccountsPlan } from "@/types/TAccountsPlan";
import { TQuestions } from "@/types/TQuestions";

const questions: TQuestions<TAccountsPlan>[] = angarish_gegma;

export default function SearchPage() {
  return (
    <main className="min-h-screen md:p-10 bg-slate-200">
      <section className="">
        <SearchCodeMeaning questions={questions} />
      </section>
    </main>
  );
}
