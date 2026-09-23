import { ViewTransition, type ReactNode } from "react";

const directional = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

export default function DirectionalTransition({ transitionKey, children }: Readonly<{ transitionKey: string; children: ReactNode }>) {
  return (
    <ViewTransition key={transitionKey} enter={directional} exit={directional} default="none">
      {children}
    </ViewTransition>
  );
}
