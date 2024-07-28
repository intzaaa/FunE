import { Final } from "./type";
import { computed, signal, batch } from "./wrap";

type State = "processing" | "completed" | "errored";

/**
 * Async Computation
 */
export const A = <T>(calculate: (() => Promise<T>) | Promise<T>, handler: (state: State, data: T | undefined) => Final<any>) => {
  const data = signal<T | undefined>();
  const state = signal<State>("processing");
  const result = computed(() => {
    return handler(state.value, data.value);
  });

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
