// @format
import { createRequire } from "module";
import { $, createCurrency, ethereum as ETH } from "moneysafe";
import { parseISO, isValid } from "date-fns";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");
const meow = require("meow");

import { parse, header, toLine } from "./format.mjs";
import { toList } from "./file.mjs";

// NOTE: If there's no `SOURCE` field attached to the definition, then it means
// nobody has checked these definitions for validity.
const BTC = createCurrency({ decimals: 8 });
const EUR = $;
const currencies = {
  BTC,
  BCH: BTC,
  ETH,
  OCEAN: ETH,
  ETC: ETH,
  // SOURCE: https://xrpl.org/currency-formats.html
  XRP: createCurrency({ decimals: 15 }),
  GNO: ETH,
  DNT: ETH,
  EOS: ETH,
  NMR: ETH,
  ANT: ETH,
  ZRX: ETH,
  XBTUSD: $,
  EUR
};

export const cli = meow(
  `
Usage:
  $ ${pkg.name} <input>

Options:
  --parse, -p
`,
  {
    flags: {
      parse: {
        type: "boolean",
        alias: "p",
        isRequired: true
      }
    }
  }
);

export async function route(input, flags) {
  if (flags.parse) {
    await parseInput(input[0]);
  } else {
    throw new Error("Not implemented");
  }
}

export function testNum(elem, unit) {
  if (!currencies[unit]) {
    throw new Error(`The currency "${unit}" is unkown and needs to be defined`);
  } else {
    return currencies[unit](elem.replace(/,/, ".")).toString();
  }
}

export async function parseInput(input) {
  let l = await toList(input);

  const testString = elem =>
    typeof elem === "string" && elem.length > 0 ? elem : null;
  const testDate = elem => (isValid(parseISO(elem)) ? elem : null);

  console.info(header.join(","));
  l = l.map(elem => {
    elem = parse(elem, {
      type: t => (t === "buy" || t === "sell" ? t : null),
      location: testString,
      asset: testString,
      amount: testNum,
      exchanged_asset: testString,
      exchanged_amount: testNum,
      datetime: testDate
    });

    console.info(toLine(elem));

    return elem;
  });

  return l;
}
