"use client";

import { Provider } from "react-redux";
import store from "@/lib/store/store";
import { useAppSelector } from "@/lib/hooks/store-hooks";
import { GlobalLoadingOverlay } from "@/components/ui/overlay";

interface ReduxProviderProps { 
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <GlobalLoadingOverlayWrapper>{children}</GlobalLoadingOverlayWrapper>
    </Provider>
  );
}

function GlobalLoadingOverlayWrapper({ children }: ReduxProviderProps) {
  const { isLoading, message } = useAppSelector((state) => state.loading);

  return (
    <>
      {children}
      <GlobalLoadingOverlay isLoading={isLoading} message={message} />
    </>
  );
}
