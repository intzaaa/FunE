import { isNil } from "ramda";

import type { Final } from "./lib/_";
import { computed, signal } from "./lib/_";
import { E } from "./element";

export type RouteData = {
  location: URL;
};

export type RouteEntry = {
  matcher: (path: string) => boolean;
  element: (data: RouteData) => Final<HTMLElement>;
};

const registry = signal<RouteEntry[]>([]);

const location = signal<URL>(new URL(window.location.href));

export const Location = computed(() => location.value);

/**
 * Declare a Route Entry
 */
export const R = (matcher: RouteEntry["matcher"], element: RouteEntry["element"]) => {
  registry.value = [...registry.value, { matcher, element }];
};

const match = (path: string) => {
  const entry = registry.value.find(({ matcher }) => matcher(path));
  return entry ? entry.element : null;
};

/**
 * Router Root Element
 */
export const RouterRoot = (fallback?: RouteEntry["element"]) => {
  const defaultFallback: RouteEntry["element"] = () => E("div", {}, ["404 Not Found"]);
  return E(
    "div",
    {
      style: {
        display: "contents",
        width: "100%",
        height: "100%",
      },
      onclick(event) {
        if (event.target && event.target instanceof HTMLAnchorElement) {
          if (isNil(event.target.href)) {
            return;
          }

          const url = new URL(event.target.href, window.location.href);
          if (location.value.href !== event.target.href && location.value.origin === url.origin) {
            event.preventDefault();
            location.value = url;
          }
        }
      },
    },
    [
      () => {
        const loc = location.value;
        return (match(loc.pathname) || (fallback ?? defaultFallback))({
          location: loc,
        });
      },
    ]
  );
};
