import type CSS from "csstype";

import type { Final, StaticFinal } from "./lib/type";
import { effect } from "./lib/_";
import { diff } from "./lib/diff";
import { value, assign } from "./lib/util";
import { isNil } from "ramda";

type Override<What, With> = Omit<What, keyof With> & With;

/**
 * Declare a HTML Element
 */
export const E = <T extends keyof HTMLElementTagNameMap>(
  tag: StaticFinal<T>,
  atr?: Final<
    Partial<
      Override<
        HTMLElementTagNameMap[T],
        {
          style: Partial<CSS.PropertiesHyphenFallback>;
          action: (self: HTMLElementTagNameMap[T]) => void;
        }
      >
    >
  >,
  sub?: Final<Final<any>[]>
) => {
  const element = document.createElement(value(tag));

  effect(() => {
    if (atr) assign(value, element, value(atr));
  });

  effect(() => {
    diff(
      element,
      Array.from(element.childNodes).filter((x) => !isNil(x)),
      (sub ? value(sub) : [])
        .map((e) => value(e))
        .map((e) => {
          if (!(e instanceof Node)) {
            return new Text(e);
          } else {
            return e;
          }
        }),
      (o: any) => o
    );
  });

  return element;
};
