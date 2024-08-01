import { Final } from "./type";
import { computed, signal, batch, ReadonlySignal } from "./wrap";

type State = "processing" | "completed" | "errored";

/**
 * Async Computation
 */
export const A = <T>(
  calculate: (() => Promise<T>) | Promise<T>,
  handler: (state: ReadonlySignal<State>, data: ReadonlySignal<T | undefined>) => Final<any>
) => {
  const data = signal<T | undefined>();
  const state = signal<State>("processing");
  const result = handler(
    computed(() => state.value),
    computed(() => data.value)
  );

  (typeof calculate === "function" ? calculate() : calculate)
    .then((r) => {
      batch(() => {
        state.value = "completed";
        data.value = r;
      });
    })
    .catch((e) => {
      batch(() => {
        state.value = "errored";
        data.value = e;
      });
    });

  return result;
};
