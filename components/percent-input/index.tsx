import { Input, InputProps as NextUIInputProps } from "@nextui-org/react";
import { useState } from "react";

export type PecentInputProps = {
  value: string;
  onchange?: (value: string) => void;
} & NextUIInputProps;

export default function PercentInput({
  value = "0",
  onchange = (value: string) => {},
  ...rest
}: PecentInputProps) {
  const [number, setNumber] = useState<string>(value);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const val = event.target.value;
    setNumber(val);
    onchange(val);
  };
  return (
    <Input
      className="max-w-[300px]"
      classNames={{
        input:
          "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
      }}
      isClearable
      size={"sm"}
      value={number}
      placeholder="შეიყვანეთ ხელფასი 1"
      {...rest}
      endContent={
        <div className="pointer-events-none flex items-center">
          <span className="text-default-400 text-small">%</span>
        </div>
      }
      type="number"
      onChange={handleChange}
      // onClear={() => {
      //   setNumber("");
      //   setCodeMening(null);
      // }}
    />
  );
}
