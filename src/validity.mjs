// @format
import { toLine } from "./format.mjs";

export function checkDuplicates(list, path) {
  if (!path) {
    throw new Error(`"path" argument is required`);
  }
  const headerSpace = 1;
  // NOTE: Line counting (in vim) starts at 1 (and not 0).
  const lineOffset = 1 + headerSpace;

  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    for (let j = 0; j < list.length; j++) {
      if (j === i) continue;

      const b = list[j];
      if (JSON.stringify(a) === JSON.stringify(b)) {
        const message = `Found duplicate in file "${path}" at L${j +
          lineOffset}.

L${lineOffset + i}: ${toLine(a)}

L${lineOffset + j}: ${toLine(b)}

`;
        throw new Error(message);
      } else {
        continue;
      }
    }
  }
}
