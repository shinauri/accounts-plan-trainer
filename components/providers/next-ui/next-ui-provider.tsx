"use client";

import { NextUIProvider } from "@nextui-org/react";
import React from "react";

export type NextUiProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function NextUiProvider({ children }: NextUiProviderProps) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
