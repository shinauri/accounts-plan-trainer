import { Select, SelectItem } from "@nextui-org/react";
import React from "react";

export type ChaptersListProps = {
  chapterNames: string[];
  onSelect: (item: string) => void;
};

export default function ChaptersList({
  chapterNames,
  onSelect = () => {},
}: ChaptersListProps) {
  return (
    <Select
      onChange={(e) => onSelect(e.target.value)}
      size="md"
      label="აირჩიეთ ანგარიში"
      className="max-w-xs"
      defaultSelectedKeys={[chapterNames[0]]}
    >
      {chapterNames.map((text) => (
        <SelectItem key={text} value={text}>
          {text}
        </SelectItem>
      ))}
    </Select>
  );
}
