import React from "react";
import { Listbox, ListboxItem, Tooltip } from "@nextui-org/react";
import { TQuestions } from "@/types/TQuestions";
import { TAccountsPlan } from "@/types/TAccountsPlan";

export type AcountsListProps = {
  accounts: TQuestions<TAccountsPlan>;
};

export default function AcountsList({ accounts }: AcountsListProps) {
  return (
    <Listbox aria-label="accounts" onAction={(key) => alert(key)}>
      {accounts.items.map((item) => {
        return (
          <ListboxItem key={item.code} textValue={item.text}>
            <Tooltip content={item.code} color="primary" placement="top-start">
              <div>{item.text}</div>
            </Tooltip>
          </ListboxItem>
        );
      })}
    </Listbox>
  );
}
