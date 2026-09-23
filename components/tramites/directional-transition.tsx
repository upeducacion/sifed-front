import { ViewTransition, type ReactNode } from "react";

const directional = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

/**
 * Pairs the outgoing and incoming version of a region across route changes so the
 * navigation direction (`Link transitionTypes`) drives the slide. Pairing by `name`
 * is what makes the animation fire when Next swaps the whole page segment; plain
 * enter/exit boundaries never get named in that scenario.
 */
export default function DirectionalTransition({ name, transitionKey, children }: Readonly<{ name: string; transitionKey: string; children: ReactNode }>) {
  return (
    <ViewTransition key={transitionKey} name={name} share={directional} default="none">
      {children}
    </ViewTransition>
  );
}
