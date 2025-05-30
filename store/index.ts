import { createStore, action, Action } from "easy-peasy";

export interface Account {
  code: number;
  meaning: string;
  sideRows: {
    left: Array<number | null>;
    right: Array<number | null>;
  };
  hasSummaryField: boolean;
}

export interface SalaryModel {
  accounts: Account[];
  setAccount: Action<
    SalaryModel,
    {
      code: number;
      index: number;
      side: "left" | "right";
      value: number | null;
    }
  >;
}

type NumberString = `${number}`;
type NumberRangeString = `${NumberString}-${NumberString}`;
type RangeString = `${string}-${string}`;

export interface Journal {
  id: NumberRangeString;
  meaning: RangeString;
  value: number | null;
}

export interface JournalModel {
  items: Journal[];
  setJournal: Action<
    JournalModel,
    {
      id: NumberRangeString;
      value: number | null;
    }
  >;
}

export interface StoreModel {
  salary: SalaryModel;
  journal: JournalModel;
}

const store = createStore<StoreModel>({
  salary: {
    accounts: [
      {
        code: 3130,
        meaning: "გადასახდელი ხელფასი",
        sideRows: { left: [null, null, null], right: [null] },
        hasSummaryField: true,
      },
      {
        code: 1210,
        meaning: "ეროვნული ვალუტა რეზიდენტ ბანკებში",
        sideRows: { left: [null], right: [null, null, null] },
        hasSummaryField: false,
      },
      {
        code: 3320,
        meaning: "გადასახდელი საშემოსავლო გადასახადი",
        sideRows: { left: [null], right: [null] },
        hasSummaryField: true,
      },
      {
        code: 3110,
        meaning: "მოწოდებიდან და მომსახურებიდან წარმოქმნილი ვალდებულებები",
        sideRows: { left: [null], right: [null, null] },
        hasSummaryField: true,
      },
      {
        code: 7410,
        meaning: "შრომის ანაზღაურება",
        sideRows: { left: [null], right: [] },
        hasSummaryField: false,
      },
      {
        code: 7490,
        meaning: "სხვა საერთო ხარჯები",
        sideRows: { left: [null], right: [] },
        hasSummaryField: false,
      },
    ],
    setAccount: action((state, payload) => {
      const account = state.accounts.find((acc) => acc.code === payload.code);

      if (account) {
        const targetSideArray: Array<number | null> =
          account.sideRows[payload.side];

        // Ensure array is long enough, fill with nulls if necessary
        // Immer allows direct mutation of the draft state here
        while (targetSideArray.length <= payload.index) {
          targetSideArray.push(null);
        }
        targetSideArray[payload.index] = payload.value;

        // Optional: To ensure React detects a change in the account object itself,
        // you could create a new object for the account, though Immer often handles nested changes.
        // For easy-peasy, direct mutation of draft state as above is standard.
      }
    }),
  },
  journal: {
    items: [
      {
        id: "3130-1210",
        meaning: "გადასახდელი ხელფასი-ეროვნული ვალუტა რეზიდენტ ბანკებში",
        value: null,
      },
      {
        id: "3130-3320",
        meaning: "გადასახდელი ხელფასი-გადასახდელი საშემოსავლო გადასახადი",
        value: null,
      },
      {
        id: "3130-3110",
        meaning:
          "გადასახდელი ხელფასი-მოწოდებიდან და მომსახურებიდან წარმოქმნილი ვალდებულებები",
        value: null,
      },
      {
        id: "7410-3130",
        meaning: "შრომის ანაზღაურება-გადასახდელი ხელფასი",
        value: null,
      },
      {
        id: "7490-3110",
        meaning:
          "სხვა საერთო ხარჯები-მოწოდებიდან და მომსახურებიდან წარმოქმნილი ვალდებულებები",
        value: null,
      },
    ],
    setJournal: action((state, payload) => {
      const journal = state.items.find((item) => item.id === payload.id);

      if (journal) {
        journal.value = payload.value;
      }
    }),
  },
});

export default store;
