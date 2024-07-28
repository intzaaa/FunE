import { minimatch } from "minimatch";

import { RouteEntry } from "./router";

/**
 * Direct Match
 */
export const DM: (p1: string) => RouteEntry["matcher"] = (p1) => (p2) => p1 === p2;

/**
 * Regular Expression Match
 */
export const RM: (regexp: RegExp) => RouteEntry["matcher"] = (regexp) => (p) => regexp.test(p);

/**
 * Glob Match
 */
export const GM: (glob: string) => RouteEntry["matcher"] = (glob) => (p) => minimatch(p, glob);
