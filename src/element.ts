import type CSS from "csstype";

import type { Final, StaticFinal } from "./lib/type";
import { effect } from "./lib/_";
import { diff } from "./lib/diff";
import { value, assign } from "./lib/util";

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
    const before = Array.from(element.childNodes);
    const hold: number[] = [];
    const after = (sub ? value(sub) : [])
      .map((e) => value(e))
      .filter((x) => !(x === null || x === undefined))
      .map((x) => {
        if (!(x instanceof Node)) {
          return new Text(String(x));
        } else {
          return x;
        }
      })
      .map((x) => {
        return (
          before.find((y, i) => {
            const isEqu = x.isEqualNode(y);
            const isHold = hold.includes(i);
            const result = isEqu && !isHold;

            if (result) hold.push(i);

            return result;
          }) ?? x
        );
      });

    diff(element, before, after, (o: any) => o);
  });

  return element;
};
