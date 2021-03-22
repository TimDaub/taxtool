// @format
import { toLine, currencies } from "./format.mjs";

export function calcBalance(assetName, list) {
  const asset = currencies[assetName];

  const state = {
    bought: asset(0),
    sold: asset(0)
  };
  for (let t of list) {
    if (t.type === "buy") {
      if (t.asset === assetName) {
        state.bought = state.bought.plus(asset(t.amount));
      }

      if (t.exchanged_asset === assetName) {
        state.bought = state.bought.plus(asset(t.exchanged_amount));
      }
    }
    if (t.type === "sell") {
      if (t.asset === assetName) {
        state.sold = state.sold.plus(asset(t.amount));
      }

      if (t.exchanged_asset === assetName) {
        state.sold = state.sold.plus(asset(t.exchanged_amount));
      }
    }

    t[`${assetName}_BOUGHT`] = state.bought.toString();
    t[`${assetName}_SOLD`] = state.sold.toString();
  }

  return list;
}

export function checkDuplicates(list, path, header, delimiter) {
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

L${lineOffset + i}: ${toLine(a, header, delimiter)}

L${lineOffset + j}: ${toLine(b, header, delimiter)}

`;
        throw new Error(message);
      } else {
        continue;
      }
    }
  }
}
