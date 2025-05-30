import AccountsExam from "@/components/accounts-exam/accounts-exam";
import { angarish_gegma } from "@/data/angarishgegma";
import { TAccountsPlan } from "@/types/TAccountsPlan";
import { TQuestions } from "@/types/TQuestions";

const questions: TQuestions<TAccountsPlan>[] = angarish_gegma;

export default function Home() {
  return (
    <main className="min-h-screen md:p-10 bg-slate-200">
      <section className="">
        <AccountsExam
          questions={questions}
          initialChapter="მიმდინარე აქტივები"
        />
      </section>
    </main>
  );
}

{
  /* 
  import { Tab, Tabs } from "@nextui-org/react";
  <Tabs aria-label="Options">
          <Tab key="accounts-exam-trainer" title="ანგარიშთა გეგმის ტრენაჟორი">
            
          </Tab>
          <Tab key="music" title="Music">
            <div>hhhh</div>
          </Tab>
          <Tab key="videos" title="Videos">
            <div>hhhh</div>
          </Tab>
        </Tabs> */
}
