import { Final } from "./lib/_";

/**
 * Conditional Element
 */
export const C = (items: [predicate: (() => boolean) | null, then: Final<HTMLElement>][]) => {
  return () => {
    const fallback = items.find(([predicate]) => predicate === null)?.[1];

    return items.find(([predicate]) => predicate?.())?.[1] ?? fallback;
  };
};
