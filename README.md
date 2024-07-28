<center>
  <h1> FunE </h1>
  <p> <b>Fun</b>ctional <b>E</b>lement </p>
</center>

Forget about boring objects and HTML. Build scalable web pages with declarative functions.

## Example

### Counter

```ts
import { E, signal } from "fune";

export const Counter = () => {
  const count = signal(0);
  const increase = () => (count.value = count.value + 1);
  const decrease = () => (count.value = count.value - 1);

  return E("div", {}, [
    E("h1", {}, ["Counter"]),
    E("p", {}, ["Count: ", count]),
    E("button", { onclick: increase }, ["Increment"]),
    E("button", { onclick: decrease }, ["Decrement"]),
  ]);
};
```
