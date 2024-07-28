const equ = (a?: Node, b?: Node) => {
  if (a instanceof Text && b instanceof Text) {
    return a.isEqualNode(b);
  } else {
    return a === b;
  }
};

/**
 * Original License:
 *
 * ISC License
 *
 * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

/**
 * @param {Node} parentNode The container where children live
 * @param {Node[]} a The list of current/live children
 * @param {Node[]} b The list of future children
 * @param {(entry: Node, action: number) => Node} get
 * The callback invoked per each entry related DOM operation.
 * @param {Node} [before] The optional node used as anchor to insert before.
 * @returns {Node[]} The same list of future children.
 */
export const diff = (parentNode: Node, a: Node[], b: Node[], get: (entry: Node, action: number) => Node, before?: Node): Node[] => {
  const bLength = b.length;
  let aEnd = a.length;
  let bEnd = bLength;
  let aStart = 0;
  let bStart = 0;
  let map: Map<Node, number> | null = null;

  while (aStart < aEnd || bStart < bEnd) {
    // append head, tail, or nodes in between: fast path
    if (aEnd === aStart) {
      const node = bEnd < bLength ? (bStart ? get(b[bStart - 1]!, -0).nextSibling : get(b[bEnd - bStart]!, 0)) : before;
      while (bStart < bEnd) parentNode.insertBefore(get(b[bStart++]!, 1), node === undefined ? null : node);
    }
    // remove head or tail: fast path
    else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart]!)) parentNode.removeChild(get(a[aStart]!, -1));
        aStart++;
      }
    }
    // same node: fast path
    else if (equ(a[aStart], b[bStart])) {
      aStart++;
      bStart++;
    }
    // same tail: fast path
    else if (equ(a[aEnd - 1], b[bEnd - 1])) {
      aEnd--;
      bEnd--;
    }
    // reverse swap: also fast path
    else if (equ(a[aStart], b[bEnd - 1]) && equ(b[bStart], a[aEnd - 1])) {
      const node = get(a[--aEnd]!, -1).nextSibling;
      parentNode.insertBefore(get(b[bStart++]!, 1), get(a[aStart++]!, -1).nextSibling);
      parentNode.insertBefore(get(b[--bEnd]!, 1), node);
      a[aEnd] = b[bEnd]!;
    }
    // map based fallback, "slow" path
    else {
      if (!map) {
        map = new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i]!, i++);
      }
      if (Array.from(map.entries()).find(([node]) => equ(node, a[aStart]!)) !== undefined) {
        const index = map.get(a[aStart]!)!;
        if (bStart < index && index < bEnd) {
          let i = aStart;
          let sequence = 1;
          while (++i < aEnd && i < bEnd && Array.from(map.entries()).find(([node]) => equ(node, a[i]!))?.[1] === index + sequence) sequence++;
          if (sequence > index - bStart) {
            const node = get(a[aStart]!, 0);
            while (bStart < index) parentNode.insertBefore(get(b[bStart++]!, 1), node);
          } else {
            parentNode.replaceChild(get(b[bStart++]!, 1), get(a[aStart++]!, -1));
          }
        } else {
          aStart++;
        }
      } else {
        parentNode.removeChild(get(a[aStart++]!, -1));
      }
    }
  }
  return b;
};
