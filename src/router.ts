import { isNil } from "ramda";

import type { Final } from "./lib/_";
import { computed, signal } from "./lib/_";
import { E } from "./element";
import { PM } from "./router-helper";

export type RouteData = {
  location: URL;
};

export type RouteMatcher = (path: string) => boolean;

export type RouteElement = (data: RouteData) => Final<HTMLElement>;

export type RouteEntry = {
  matcher: RouteMatcher;
  element: RouteElement;
};

const registry = signal<RouteEntry[]>([]);

const location = signal<URL>(new URL(window.location.href));

export const Location = computed(() => location.value);

/**
 * Declare a Route Entry
 */
export const R = (items: [matcher: RouteMatcher | string, element: RouteElement][]) => {
  registry.value = [
    ...registry.value,
    ...items.map(([matcher, element]) => {
      if (typeof matcher === "string") {
        return {
          matcher: PM(matcher),
          element,
        };
      } else {
        return { matcher, element };
      }
    }),
  ];
};

const match = (path: string) => {
  const entry = registry.value.find(({ matcher }) => matcher(path));
  return entry ? entry.element : null;
};

window.onpopstate = () => {
  location.value = new URL(window.location.href);
};

/**
 * Router Root Element
 */
export const RouterRoot = (fallback?: RouteElement) => {
  const defaultFallback: RouteElement = () => E("div", {}, ["404 Not Found"]);

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
            window.history.pushState({}, "", location.value.href);
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
