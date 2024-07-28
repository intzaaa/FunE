import { minimatch } from "minimatch";

import { RouteMatcher } from "./router";

/**
 * Plain Matcher
 */
export const PM: (p1: string) => RouteMatcher = (p1) => (p2) => p1 === p2;

/**
 * Regular Expression Matcher
 */
export const RM: (regexp: RegExp) => RouteMatcher = (regexp) => (p) => regexp.test(p);

/**
 * Glob Matcher
 */
export const GM: (glob: string) => RouteMatcher = (glob) => (p) => minimatch(p, glob);
