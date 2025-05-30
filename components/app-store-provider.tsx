"use client";

import React from "react";
import { StoreProvider } from "easy-peasy";
import store from "../store";

export type AppStoreProviderProps = {
  children: React.ReactNode;
};

export default function AppStoreProvider({ children }: AppStoreProviderProps) {
  return <StoreProvider store={store}>{children}</StoreProvider>;
}
